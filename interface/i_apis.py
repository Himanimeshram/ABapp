from fastapi import APIRouter, HTTPException
from interface.mongodbop import create_user

router = APIRouter(prefix="/appointment_scheduling_app", tags=["app"])

@router.post("/signup")
async def signup(username: str, first_name: str, last_name: str, password: str, email_id: str, phone_number: int, role: str):
    try:
        create_user(username, first_name, last_name, password, email_id, phone_number, role)
        return {"message": "Signup successful"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
