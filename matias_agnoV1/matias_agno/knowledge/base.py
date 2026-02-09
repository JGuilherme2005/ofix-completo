import os

from agno.knowledge import Knowledge
from agno.knowledge.embedder.fastembed import FastEmbedEmbedder
from agno.vectordb.lancedb import LanceDb

# Knowledge (LanceDB) config.
#
# - LanceDB Cloud uses URIs like: db://<database_id>
#   It requires LANCEDB_API_KEY at runtime.
# - Local LanceDB can use a filesystem path/URI and does not require an API key.
#
# This project defaults to the OFIX cloud DB URI, but will gracefully disable
# knowledge if the required credentials are not present.
LANCEDB_API_KEY = os.getenv("LANCEDB_API_KEY", "").strip()
LANCEDB_URI = os.getenv("LANCEDB_URI", "db://ofx-rbf7i6").strip()
LANCEDB_TABLE = os.getenv("LANCEDB_TABLE", "conhecimento_oficina_v5_completo").strip()
LANCEDB_SEARCH_TYPE = os.getenv("LANCEDB_SEARCH_TYPE", "hybrid").strip() or "hybrid"
LANCEDB_REQUIRED = os.getenv("LANCEDB_REQUIRED", "false").lower() == "true"


def get_knowledge_base():
    """
    Return a Knowledge instance if LanceDB is configured, otherwise None.

    If you want to hard-fail when not configured, set LANCEDB_REQUIRED=true.
    """

    if not LANCEDB_URI:
        if LANCEDB_REQUIRED:
            raise RuntimeError("LANCEDB_URI not set (LANCEDB_REQUIRED=true).")
        return None

    is_cloud = LANCEDB_URI.startswith("db://")
    if is_cloud and not LANCEDB_API_KEY:
        if LANCEDB_REQUIRED:
            raise RuntimeError("LANCEDB_API_KEY not set (LANCEDB_REQUIRED=true).")
        return None

    vector_db_kwargs = {
        "table_name": LANCEDB_TABLE,
        "uri": LANCEDB_URI,
        "search_type": LANCEDB_SEARCH_TYPE,
        "embedder": FastEmbedEmbedder(),
    }
    if LANCEDB_API_KEY:
        vector_db_kwargs["api_key"] = LANCEDB_API_KEY

    vector_db = LanceDb(**vector_db_kwargs)
    return Knowledge(vector_db=vector_db)

