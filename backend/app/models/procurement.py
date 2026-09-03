from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProcurementBase(BaseModel):
    pilot_id: str
    status: str = "draft" # draft, submitted, approved, rejected
    readiness_score: Optional[int] = None
    readiness_level: Optional[str] = None
    missing_items: Optional[list[str]] = None
    recommendations: Optional[list[str]] = None

class ProcurementResponse(ProcurementBase):
    id: str
    created_at: datetime
