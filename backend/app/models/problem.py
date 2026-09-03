from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class ProblemCreate(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: str
    description: str
    department_id: Optional[str] = None
    sector: str
    location: Optional[str] = None
    required_capabilities: Optional[List[str]] = []
    required_technologies: Optional[List[str]] = []
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    timeline_days: Optional[int] = None
    pilot_duration_days: Optional[int] = None
    expected_outcome: Optional[str] = None
    kpis: Optional[List[str]] = []
    eligibility_requirements: Optional[str] = None
    ai_structured: Optional[Any] = None
    status: str = "draft"


class ProblemUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: Optional[str] = None
    description: Optional[str] = None
    sector: Optional[str] = None
    location: Optional[str] = None
    required_capabilities: Optional[List[str]] = None
    required_technologies: Optional[List[str]] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    timeline_days: Optional[int] = None
    pilot_duration_days: Optional[int] = None
    expected_outcome: Optional[str] = None
    kpis: Optional[List[str]] = None
    eligibility_requirements: Optional[str] = None
    status: Optional[str] = None


class ProblemResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    title: str
    description: str
    department_id: Optional[str] = None
    officer_id: Optional[str] = None
    sector: Optional[str] = None
    location: Optional[str] = None
    required_capabilities: Optional[List[str]] = []
    required_technologies: Optional[List[str]] = []
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    timeline_days: Optional[int] = None
    pilot_duration_days: Optional[int] = None
    expected_outcome: Optional[str] = None
    kpis: Optional[List[str]] = []
    status: str = "draft"
    ai_structured: Optional[Any] = None
    department: Optional[Any] = None
    officer: Optional[Any] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
