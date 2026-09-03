from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class PilotBase(BaseModel):
    problem_id: str
    startup_id: str
    application_id: str
    status: str = "draft"
    department: str
    success_criteria: Optional[str] = None

class PilotCreate(PilotBase):
    pass

class PilotUpdate(BaseModel):
    status: Optional[str] = None
    success_criteria: Optional[str] = None

class PilotResponse(PilotBase):
    id: str
    created_at: datetime
