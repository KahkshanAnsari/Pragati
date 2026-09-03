from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class SolutionBase(BaseModel):
    model_config = ConfigDict(extra="allow")

    solution_name: Optional[str] = "Validated Solution"
    sector: Optional[str] = "General"
    technologies: Optional[List[str]] = []
    problem_description: Optional[str] = None
    kpi_achievement_percent: Optional[float] = None
    pilot_id: Optional[str] = None
    startup_id: Optional[str] = None
    department_id: Optional[str] = None
    deployment_location: Optional[str] = None
    validation_status: Optional[str] = "pilot_completed"

class SolutionResponse(SolutionBase):
    model_config = ConfigDict(extra="allow")

    id: str
    startup: Optional[Any] = None
    department: Optional[Any] = None
    created_at: Optional[datetime] = None
