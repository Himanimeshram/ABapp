from pydantic import BaseModel, validator
from datetime import datetime

class AppointmentModelSchemas(BaseModel):
    service_id: str
    user_id: str
    date_time: datetime  # Use datetime from the pydantic module
    status: str = "scheduled"

    @validator("date_time")
    def validate_date_time(cls, value):
        # You can perform validation or modification here
        return value
