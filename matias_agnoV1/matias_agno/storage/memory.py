import os

from agno.db.postgres import PostgresDb
from agno.db.sqlite import SqliteDb

# Default table names are OFIX-scoped to avoid schema conflicts when Agno upgrades.
DEFAULT_SESSION_TABLE = os.getenv("AGNO_SESSION_TABLE", "ofix_agno_sessions")
DEFAULT_MEMORY_TABLE = os.getenv("AGNO_MEMORY_TABLE", "ofix_agno_memories")
DEFAULT_METRICS_TABLE = os.getenv("AGNO_METRICS_TABLE", "ofix_agno_metrics")

# Use /tmp by default so we don't accidentally ship a pre-baked sqlite DB from the repo image.
DEFAULT_SQLITE_FILE = os.getenv("SQLITE_DB_FILE", "/tmp/ofix_matias.db")


def _ensure_sslmode_require(db_url: str) -> str:
    # Supabase requires SSL. Adding sslmode=require keeps things working across providers.
    url = (db_url or "").strip()
    if not url:
        return url
    if "sslmode=" in url:
        return url
    return f"{url}{'&' if '?' in url else '?'}sslmode=require"


def get_memory_storage():
    """
    Returns the persistence backend:
    - Postgres (Supabase) when configured
    - SQLite fallback otherwise (non-persistent on Render free tier)
    """

    # Prefer SUPABASE_DB_URL, but support DATABASE_URL as fallback (common in PaaS).
    raw_db_url = (os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL") or "").strip()

    if raw_db_url:
        db_url = _ensure_sslmode_require(raw_db_url)
        print("[memory] Using Postgres persistence")
        try:
            # Agno v2: table_name is deprecated; configure domain tables explicitly.
            return PostgresDb(
                db_url=db_url,
                session_table=DEFAULT_SESSION_TABLE,
                memory_table=DEFAULT_MEMORY_TABLE,
                metrics_table=DEFAULT_METRICS_TABLE,
            )
        except Exception as exc:
            # Keep the service alive even if Postgres is misconfigured/unreachable.
            print(f"[memory] Postgres init failed ({type(exc).__name__}): {exc}. Falling back to SQLite.")

    print("[memory] Using SQLite fallback")
    return SqliteDb(
        db_file=DEFAULT_SQLITE_FILE,
        session_table=DEFAULT_SESSION_TABLE,
        memory_table=DEFAULT_MEMORY_TABLE,
        metrics_table=DEFAULT_METRICS_TABLE,
    )

