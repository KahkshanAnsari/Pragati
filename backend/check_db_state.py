from app.db.supabase import supabase_admin

tables = [
    ("startups", "name, sector, verification_status"),
    ("problems", "title, sector, status"),
    ("government_departments", "name, sector"),
    ("government_officers", "name, designation"),
    ("applications", "status"),
    ("pilots", "status, progress_percent, pilot_number"),
    ("milestones", "status"),
    ("kpis", "metric_name"),
    ("startup_matches", "problem_id, match_percent"),
    ("validated_solutions", "startup_id"),
    ("procurement_cases", "status"),
    ("users", "email, role"),
]

for table, cols in tables:
    try:
        r = supabase_admin.table(table).select(cols).execute()
        print(f"=== {table.upper()} === Count: {len(r.data or [])}")
        for row in (r.data or [])[:3]:
            print(f"  {row}")
        print()
    except Exception as e:
        print(f"=== {table.upper()} === ERROR: {e}")
        print()
