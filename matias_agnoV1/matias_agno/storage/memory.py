"""
memory.py — Persistence backend for Agno agent memory / sessions.

M3-AI-04: Added TTL policy constants, ``get_db_url()`` helper (used by
cleanup.py), and kept the original ``get_memory_storage()`` for Agno.
"""

import os

from agno.db.postgres import PostgresDb
from agno.db.sqlite import SqliteDb

# ── Table names (OFIX-scoped to avoid Agno upgrade conflicts) ────────────────
DEFAULT_SESSION_TABLE = os.getenv("AGNO_SESSION_TABLE", "ofix_agno_sessions")
DEFAULT_MEMORY_TABLE = os.getenv("AGNO_MEMORY_TABLE", "ofix_agno_memories")
DEFAULT_METRICS_TABLE = os.getenv("AGNO_METRICS_TABLE", "ofix_agno_metrics")

# Use /tmp by default so we don't ship a pre-baked sqlite DB from the repo image.
DEFAULT_SQLITE_FILE = os.getenv("SQLITE_DB_FILE", "/tmp/ofix_matias.db")

# ── TTL Policy (M3-AI-04) ────────────────────────────────────────────────────
# Authenticated sessions: keep for 30 days (env-overridable).
AUTH_MEMORY_TTL_DAYS = int(os.getenv("AGNO_AUTH_MEMORY_TTL_DAYS", "30"))
# Public sessions: keep for 1 hour — they should have no persistent memory,
# but if any leak through they get cleaned aggressively.
PUBLIC_MEMORY_TTL_HOURS = int(os.getenv("AGNO_PUBLIC_MEMORY_TTL_HOURS", "1"))

# The agent_id used by the public agent (must match agents/matias.py).
PUBLIC_AGENT_ID = os.getenv("AGNO_PUBLIC_AGENT_ID", "matias-public")


# ── Helpers ───────────────────────────────────────────────────────────────────

def _ensure_sslmode_require(db_url: str) -> str:
    """Supabase requires SSL. Adds ``sslmode=require`` if not present."""
    url = (db_url or "").strip()
    if not url:
        return url
    if "sslmode=" in url:
        return url
    return f"{url}{'&' if '?' in url else '?'}sslmode=require"


def get_db_url() -> str | None:
    """
    Return the Postgres connection string (with sslmode) or ``None``
    when Postgres is not configured.  Re-used by ``cleanup.py``.
    """
    raw = (os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL") or "").strip()
    if not raw:
        return None
    return _ensure_sslmode_require(raw)


def get_memory_storage():
    """
    Returns the persistence backend for Agno:
    - Postgres (Supabase) when configured
    - SQLite fallback otherwise (non-persistent on Render free tier)
    """
    db_url = get_db_url()

    if db_url:
        print("[memory] Using Postgres persistence")
        try:
            return PostgresDb(
                db_url=db_url,
                session_table=DEFAULT_SESSION_TABLE,
                memory_table=DEFAULT_MEMORY_TABLE,
                metrics_table=DEFAULT_METRICS_TABLE,
            )
        except Exception as exc:
            print(f"[memory] Postgres init failed ({type(exc).__name__}): {exc}. Falling back to SQLite.")

    print("[memory] Using SQLite fallback")
    return SqliteDb(
        db_file=DEFAULT_SQLITE_FILE,
        session_table=DEFAULT_SESSION_TABLE,
        memory_table=DEFAULT_MEMORY_TABLE,
        metrics_table=DEFAULT_METRICS_TABLE,
    )

