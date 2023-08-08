from pydantic import BaseModel
from typing import Optional

class ServiceModelSchemas(BaseModel):
    name: str
    description: str
    duration: str
    price: float