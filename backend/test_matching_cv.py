import asyncio
import requests
from app.services.gemini import match_startups
from app.db.supabase import supabase_admin

base = 'http://127.0.0.1:8000'
prob_id = 'c0000006-1111-4111-8111-000000000006'

async def test():
    p = requests.get(f"{base}/api/problems/{prob_id}").json()
    print("Testing AI Matching on:", p["title"])
    st = supabase_admin.table("startups").select("*").execute().data or []
    matches = await match_startups(p, st)
    print(f"Generated {len(matches)} matches:")
    for m in matches[:5]:
        st_match = next((s for s in st if s["id"] == m.get("startup_id")), {})
        print(f"  -> {st_match.get('name')}: {m.get('match_percent')}% ({m.get('match_rating')}) | Reason: {m.get('explainability', {}).get('reason')}")

if __name__ == "__main__":
    asyncio.run(test())
