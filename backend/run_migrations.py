"""
Run all Supabase migrations and seed data via the REST API.
Usage: python run_migrations.py
"""
import os
import sys
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

MIGRATIONS_DIR = Path(__file__).parent.parent / "supabase" / "migrations"
SEED_FILE = Path(__file__).parent.parent / "supabase" / "seed.sql"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}


def run_sql(sql: str, label: str) -> bool:
    """Execute SQL via Supabase's SQL endpoint."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    # Use the pg extension endpoint
    url2 = f"{SUPABASE_URL}/pg/query"

    # Try the management API approach via httpx
    try:
        resp = httpx.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers=HEADERS,
            json={"query": sql},
            timeout=60,
        )
        if resp.status_code in (200, 201, 204):
            print(f"  ✅ {label}")
            return True
        else:
            print(f"  ⚠️  {label}: {resp.status_code} — {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ {label}: {e}")
        return False


def run_sql_direct(sql: str, label: str) -> bool:
    """Execute SQL via Supabase's direct query endpoint."""
    try:
        resp = httpx.post(
            f"{SUPABASE_URL}/rest/v1/",
            headers={**HEADERS, "Content-Type": "application/sql"},
            content=sql.encode(),
            timeout=120,
        )
        print(f"  Status {resp.status_code}: {label}")
        return resp.status_code in (200, 201, 204)
    except Exception as e:
        print(f"  Error: {e}")
        return False


def split_sql_statements(sql: str) -> list[str]:
    """Split SQL file into individual statements."""
    # Simple split on semicolons — handles most DDL
    statements = []
    current = []
    
    for line in sql.splitlines():
        stripped = line.strip()
        # Skip pure comment lines
        if stripped.startswith("--") or not stripped:
            current.append(line)
            continue
        current.append(line)
        if stripped.endswith(";"):
            stmt = "\n".join(current).strip()
            if stmt and not all(l.strip().startswith("--") or not l.strip() for l in current):
                statements.append(stmt)
            current = []
    
    # Add any remaining
    if current:
        stmt = "\n".join(current).strip()
        if stmt:
            statements.append(stmt)
    
    return [s for s in statements if s.strip() and not s.strip().startswith("--")]


def main():
    print(f"\n🚀 Running Pragati migrations on: {SUPABASE_URL}\n")

    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    all_files = migration_files + [SEED_FILE]

    for sql_file in all_files:
        if not sql_file.exists():
            print(f"⚠️  File not found: {sql_file}")
            continue
        
        print(f"\n📄 {sql_file.name}")
        sql_content = sql_file.read_text(encoding="utf-8")
        
        # For each file, we send the full content as one transaction
        # via httpx to Supabase's SQL execution endpoint
        try:
            resp = httpx.post(
                f"{SUPABASE_URL}/rest/v1/rpc/run_sql",
                headers=HEADERS,
                json={"sql": sql_content},
                timeout=120,
            )
            
            if resp.status_code == 404:
                # run_sql RPC doesn't exist — try chunked approach
                statements = split_sql_statements(sql_content)
                print(f"  Running {len(statements)} statements...")
                
                success = 0
                failed = 0
                for i, stmt in enumerate(statements):
                    r = httpx.post(
                        f"{SUPABASE_URL}/rest/v1/rpc/run_sql",
                        headers=HEADERS,
                        json={"sql": stmt},
                        timeout=30,
                    )
                    if r.status_code in (200, 201, 204):
                        success += 1
                    else:
                        failed += 1
                        if failed <= 3:
                            print(f"    Stmt {i+1}: {r.status_code} — {r.text[:100]}")
                
                print(f"  Done: {success} OK, {failed} failed")
            elif resp.status_code in (200, 201, 204):
                print(f"  ✅ Applied successfully")
            else:
                print(f"  ⚠️  Status {resp.status_code}: {resp.text[:300]}")
        
        except Exception as e:
            print(f"  ❌ Error: {e}")

    print("\n✅ Migration script complete.\n")
    print("NOTE: If you see 404 errors, run the SQL files manually in:")
    print(f"  {SUPABASE_URL.replace('.supabase.co', '')}.supabase.com/dashboard/project/tkmcpckbvagyplolrjsz/sql")


if __name__ == "__main__":
    main()
