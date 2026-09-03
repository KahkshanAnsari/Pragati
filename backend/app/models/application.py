from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    problem_id: str
    startup_id: str
    proposal_text: str
    status: str = "submitted" # submitted, under_review, accepted, rejected

class ApplicationResponse(ApplicationBase):
    id: str
    created_at: datetime
