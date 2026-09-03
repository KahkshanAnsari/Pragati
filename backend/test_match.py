from app.db.supabase import supabase_admin
from app.services.matching_engine import rank_startups_for_problem

p_res = supabase_admin.table('problems').select('*').ilike('title', '%Water%').limit(1).execute()
if not p_res.data:
    print("No water problem found")
    exit()

prob = p_res.data[0]
s_res = supabase_admin.table('startups').select('*').execute()
startups = s_res.data

matches = rank_startups_for_problem(prob, startups)
print("=" * 60)
print(f"MATCH RESULTS FOR: {prob['title']}")
print(f"Sector: {prob['sector']}")
print("=" * 60)
for i, m in enumerate(matches):
    st = m['startup']
    exp = m['explainability']
    print(f"#{i+1} {st['name']}: {m['match_percent']}% [{exp['ui_rating']}]")
    print(f"    Sector Fit: {exp['sector_score']}/30 | Tech Fit: {exp['tech_score']}/25 | Cap Fit: {exp['cap_score']}/20")
    print(f"    Exp: {exp['exp_score']}/15 | Gov: {exp['gov_score']}/5 | Trust: {exp['trust_score_comp']}/5")
    print(f"    Reason: {exp['reason']}")
    print(f"    Strengths: {exp['strengths']}")
    print("-" * 60)
