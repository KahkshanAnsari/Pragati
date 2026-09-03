from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class StartupBase(BaseModel):
    model_config = ConfigDict(extra="allow")

    name: str
    founder_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    sector: str
    technologies: List[str] = []
    capabilities: List[str] = []
    team_size: Optional[int] = 0
    experience_years: Optional[int] = 0
    gst_number: Optional[str] = None
    incorporation_number: Optional[str] = None
    dpiit_recognition_number: Optional[str] = None
    verification_status: Optional[str] = "draft"
    trust_score: Optional[int] = 0
    pilot_success_rate: Optional[float] = 0.0
    previous_projects: Optional[int] = 0
    government_pilots: Optional[int] = 0

class StartupResponse(StartupBase):
    model_config = ConfigDict(extra="allow")

    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
