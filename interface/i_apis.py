from fastapi import APIRouter, HTTPException, Depends
from typing import List
from interface.mongodb_op import create_user, create_service, get_service, add_appointments, get_user
from models.service_model_schemas import ServiceModelSchemas
from models.appointment_model_schemas import AppointmentModelSchemas

router = APIRouter(prefix="/appointment_scheduling_app", tags=["app"])

@router.post("/signup")
async def signup(username: str, first_name: str, last_name: str, password: str, email_id: str, phone_number: int, role: str):
    try:
        create_user(username, first_name, last_name, password, email_id, phone_number, role)
        return {"message": "Signup successful"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login")
async def login(username: str, password: str):
    try:
        user = await get_user(username, password)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/add_services/", response_model=ServiceModelSchemas)
async def add_service(model: ServiceModelSchemas):
    try:
        create_service(model.name, model.description, model.duration, model.price)
        return model
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        

@router.get("/get_services/")
async def get_services():
     services = get_service()  
     return services 
 
@router.post("/appointments/")
async def create_appointment(appointment: AppointmentModelSchemas):
    inserted_id = add_appointments(
        appointment.service_id, 
        appointment.user_id, 
        appointment.date_time, 
        appointment.status
    )
    return {"inserted_id": str(inserted_id)}
    