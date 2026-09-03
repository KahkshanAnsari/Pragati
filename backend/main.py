from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    auth, problems, startups, matching, applications,
    pilots, milestones, kpis, inspections, issues,
    procurement, solutions, notifications, audit, admin, budget
)

app = FastAPI(
    title="Pragati Government Innovation Platform API",
    description="Connecting government departments with innovative startups",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pragati-eta-opal.vercel.app",
        "https://pragati-g3xc7vtvn-kahkasha-s-team.vercel.app",
        "https://pragati-ajmn211jk-kahkasha-s-team.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
@app.get("/api", tags=["health"])
async def health_check():
    return {"status": "ok", "message": "Pragati API is running"}

@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "healthy"}

app.include_router(auth.router,          prefix="/api/auth",         tags=["auth"])
app.include_router(problems.router,      prefix="/api/problems",     tags=["problems"])
app.include_router(startups.router,      prefix="/api/startups",     tags=["startups"])
app.include_router(matching.router,      prefix="/api",              tags=["matching"])
app.include_router(matching.router,      prefix="/api/matching",     tags=["matching"])
app.include_router(applications.router,  prefix="/api/applications", tags=["applications"])
app.include_router(pilots.router,        prefix="/api/pilots",       tags=["pilots"])
app.include_router(milestones.router,    prefix="/api/milestones",   tags=["milestones"])
app.include_router(kpis.router,          prefix="/api/kpis",         tags=["kpis"])
app.include_router(budget.router,        prefix="/api/budget",       tags=["budget"])
app.include_router(inspections.router,   prefix="/api/inspections",  tags=["inspections"])
app.include_router(issues.router,        prefix="/api/issues",       tags=["issues"])
app.include_router(procurement.router,   prefix="/api/procurement",  tags=["procurement"])
app.include_router(solutions.router,     prefix="/api/solutions",    tags=["solutions"])
app.include_router(notifications.router, prefix="/api/notifications",tags=["notifications"])
app.include_router(audit.router,         prefix="/api/audit-logs",   tags=["audit"])
app.include_router(admin.router,         prefix="/api/admin",        tags=["admin"])

