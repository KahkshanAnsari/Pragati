from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InspectionBase(BaseModel):
    pilot_id: str
    inspector_id: str
    status: str = "assigned" # assigned, completed
    report_text: Optional[str] = None
    evidence_url: Optional[str] = None

class InspectionResponse(InspectionBase):
    id: str
    created_at: datetime
