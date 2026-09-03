"""
Directly apply all SQL migrations to Supabase via PostgreSQL connection.
Run: python apply_migrations.py
"""
import os
import sys
import psycopg2
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Supabase PostgreSQL connection details
# Project ref extracted from URL: tkmcpckbvagyplolrjsz
PROJECT_REF = "tkmcpckbvagyplolrjsz"
DB_HOST = f"db.{PROJECT_REF}.supabase.co"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"

# The database password is the service role key for direct connections
# Actually for Supabase, the postgres password is set separately
# We use the connection string format
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

BASE_DIR = Path(__file__).parent.parent

SQL_FILES = [
    BASE_DIR / "supabase" / "migrations" / "001_initial_schema.sql",
    BASE_DIR / "supabase" / "migrations" / "002_rls_policies.sql",
    BASE_DIR / "supabase" / "migrations" / "003_triggers.sql",
    BASE_DIR / "supabase" / "seed.sql",
]

def apply_migrations(password: str):
    print(f"\n🔌 Connecting to {DB_HOST}...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=password,
            sslmode="require",
            connect_timeout=15,
        )
        conn.autocommit = True
        cur = conn.cursor()
        print("✅ Connected!\n")

        for sql_file in SQL_FILES:
            if not sql_file.exists():
                print(f"⚠️  File not found: {sql_file}")
                continue

            print(f"📄 Applying: {sql_file.name}")
            sql = sql_file.read_text(encoding="utf-8")
            try:
                cur.execute(sql)
                print(f"   ✅ Done\n")
            except Exception as e:
                print(f"   ❌ Error: {e}\n")
                # Continue with next file
                conn.rollback() if not conn.autocommit else None

        cur.close()
        conn.close()
        print("🎉 All migrations applied successfully!")

    except psycopg2.OperationalError as e:
        print(f"\n❌ Connection failed: {e}")
        print("\n💡 To apply migrations manually:")
        print(f"   1. Go to: https://supabase.com/dashboard/project/{PROJECT_REF}/sql")
        print(f"   2. Open file: d:\\Pragati\\supabase\\FULL_SETUP.sql")
        print(f"   3. Paste and click Run")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        db_password = sys.argv[1]
    else:
        db_password = input("Enter your Supabase database password: ").strip()
    
    apply_migrations(db_password)
