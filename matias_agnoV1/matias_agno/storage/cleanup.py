"""
cleanup.py — TTL-based memory / session purge (M3-AI-04).

Deletes rows from the Agno tables based on ``updated_at`` epoch timestamps:
  - Authenticated agent: rows older than AUTH_MEMORY_TTL_DAYS  (default 30 d)
  - Public agent:         rows older than PUBLIC_MEMORY_TTL_HOURS (default 1 h)

Can be invoked:
  1. Via the FastAPI endpoint ``POST /agno/cleanup-memories`` (see api.py).
  2. As a standalone script:  ``python -m matias_agno.storage.cleanup``
  3. From a Render/Railway Cron Job hitting the endpoint with the Bearer token.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field

from matias_agno.storage.memory import (
    AUTH_MEMORY_TTL_DAYS,
    DEFAULT_MEMORY_TABLE,
    DEFAULT_SESSION_TABLE,
    PUBLIC_AGENT_ID,
    PUBLIC_MEMORY_TTL_HOURS,
    get_db_url,
)

logger = logging.getLogger(__name__)

# ── Helpers ───────────────────────────────────────────────────────────────────


def _epoch_cutoff(*, days: int = 0, hours: int = 0) -> int:
    """Return a Unix-epoch (seconds) cutoff: ``now − delta``."""
    delta_seconds = days * 86_400 + hours * 3_600
    return int(time.time()) - delta_seconds


# ── Result dataclass ─────────────────────────────────────────────────────────


@dataclass
class CleanupResult:
    """Holds per-table deletion counts returned by ``run_cleanup``."""

    sessions_auth_deleted: int = 0
    sessions_public_deleted: int = 0
    memories_auth_deleted: int = 0
    memories_public_deleted: int = 0
    errors: list[str] = field(default_factory=list)

    @property
    def total_deleted(self) -> int:
        return (
            self.sessions_auth_deleted
            + self.sessions_public_deleted
            + self.memories_auth_deleted
            + self.memories_public_deleted
        )

    @property
    def ok(self) -> bool:
        return len(self.errors) == 0

    def to_dict(self) -> dict:
        return {
            "ok": self.ok,
            "total_deleted": self.total_deleted,
            "sessions": {
                "auth_deleted": self.sessions_auth_deleted,
                "public_deleted": self.sessions_public_deleted,
            },
            "memories": {
                "auth_deleted": self.memories_auth_deleted,
                "public_deleted": self.memories_public_deleted,
            },
            "errors": self.errors,
        }


# ── Core routine ──────────────────────────────────────────────────────────────


def run_cleanup(*, dry_run: bool = False) -> CleanupResult:
    """
    Purge expired rows from ``ofix_agno_sessions`` and ``ofix_agno_memories``.

    The timestamps stored by Agno are **Unix epoch seconds** (bigint).

    Parameters
    ----------
    dry_run : bool
        If ``True``, counts rows that *would* be deleted without removing them.

    Returns
    -------
    CleanupResult
    """
    result = CleanupResult()

    db_url = get_db_url()
    if not db_url:
        result.errors.append("Postgres not configured (no SUPABASE_DB_URL / DATABASE_URL). Cleanup skipped.")
        logger.warning(result.errors[-1])
        return result

    # Cutoffs (epoch seconds)
    auth_cutoff = _epoch_cutoff(days=AUTH_MEMORY_TTL_DAYS)
    public_cutoff = _epoch_cutoff(hours=PUBLIC_MEMORY_TTL_HOURS)

    sessions_table = DEFAULT_SESSION_TABLE
    memories_table = DEFAULT_MEMORY_TABLE

    verb = "SELECT count(*)" if dry_run else "DELETE"
    returning = "" if dry_run else " RETURNING 1"

    try:
        import sqlalchemy

        engine = sqlalchemy.create_engine(db_url, pool_pre_ping=True)

        with engine.begin() as conn:
            # ── Sessions ─────────────────────────────────────────────────

            # 1a) Public sessions older than PUBLIC_MEMORY_TTL_HOURS
            q = sqlalchemy.text(
                f"{verb} FROM {sessions_table} "
                f"WHERE agent_id = :pub_agent AND updated_at < :pub_cutoff"
                f"{returning}"
            )
            rows = conn.execute(q, {"pub_agent": PUBLIC_AGENT_ID, "pub_cutoff": public_cutoff})
            result.sessions_public_deleted = rows.rowcount if not dry_run else (rows.scalar() or 0)

            # 1b) Auth sessions older than AUTH_MEMORY_TTL_DAYS
            q = sqlalchemy.text(
                f"{verb} FROM {sessions_table} "
                f"WHERE (agent_id IS NULL OR agent_id != :pub_agent) "
                f"AND updated_at < :auth_cutoff"
                f"{returning}"
            )
            rows = conn.execute(q, {"pub_agent": PUBLIC_AGENT_ID, "auth_cutoff": auth_cutoff})
            result.sessions_auth_deleted = rows.rowcount if not dry_run else (rows.scalar() or 0)

            # ── Memories ─────────────────────────────────────────────────

            # 2a) Public memories (should rarely exist — public agent has memory OFF)
            q = sqlalchemy.text(
                f"{verb} FROM {memories_table} "
                f"WHERE agent_id = :pub_agent AND updated_at < :pub_cutoff"
                f"{returning}"
            )
            rows = conn.execute(q, {"pub_agent": PUBLIC_AGENT_ID, "pub_cutoff": public_cutoff})
            result.memories_public_deleted = rows.rowcount if not dry_run else (rows.scalar() or 0)

            # 2b) Auth memories older than AUTH_MEMORY_TTL_DAYS
            q = sqlalchemy.text(
                f"{verb} FROM {memories_table} "
                f"WHERE (agent_id IS NULL OR agent_id != :pub_agent) "
                f"AND updated_at < :auth_cutoff"
                f"{returning}"
            )
            rows = conn.execute(q, {"pub_agent": PUBLIC_AGENT_ID, "auth_cutoff": auth_cutoff})
            result.memories_auth_deleted = rows.rowcount if not dry_run else (rows.scalar() or 0)

        engine.dispose()

    except Exception as exc:
        msg = f"Cleanup failed: {type(exc).__name__}: {exc}"
        logger.error(msg)
        result.errors.append(msg)

    if result.ok:
        logger.info(
            "[cleanup] done — deleted %d rows (sessions_auth=%d, sessions_pub=%d, "
            "memories_auth=%d, memories_pub=%d)%s",
            result.total_deleted,
            result.sessions_auth_deleted,
            result.sessions_public_deleted,
            result.memories_auth_deleted,
            result.memories_public_deleted,
            " (DRY RUN)" if dry_run else "",
        )

    return result


# ── CLI entrypoint ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    from dotenv import load_dotenv

    load_dotenv()
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    dry = "--dry-run" in sys.argv
    res = run_cleanup(dry_run=dry)
    print(res.to_dict())
    sys.exit(0 if res.ok else 1)
