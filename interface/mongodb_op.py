from fastapi import HTTPException
import datetime 
import json

import pandas as pd
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from config import settings
from passlib.hash import bcrypt


MONGODB_CONN_STR = settings.MONGODB_CONN_STR

# Connection to MongoDB
client = MongoClient(MONGODB_CONN_STR)

# database
db = client["ABAPP"]

# collections
users_collection = db["users"]
appointments_collection = db["appointments"]
company_collection = db["companyDetails"]
customer_collection = db["customerDetails"]
services_collection = db["services"]


def create_user(username, first_name, last_name, password, email_id, phone_number, role):
    # Check if the username is aleady taken
    existing_user = users_collection.find_one({"userName": username})
    if existing_user:
        raise ValueError("Username already exists")

    # Get the current date and time
    timestamp = datetime.datetime.utcnow()

    # Hash the password using bcrypt
    password_hash = bcrypt.hash(password)
    

    # Create a new user document
    user = {
        "userName": username, 
        "firstName": first_name,
        "lastName": last_name,
        "passwordHash": password_hash, 
        "emailId": email_id, 
        "phoneNumber": phone_number, 
        "role": role, 
        "createdAt": timestamp,
        "updatedAt": ""
    }

    try:
        # Insert the user document into the users collection
        users_collection.insert_one(user)
    except DuplicateKeyError:
        raise ValueError("Username already exists")
    
    
    
async def create_service(name, description, duration, price):
    
    #check if service already exists
    existing_service = await services_collection.find_one({"serviceName": name})
    if existing_service:
            raise ValueError("Service already exists")
    
    #create new service document
    services = {
        "serviceName": name,
        "serviceDescription": description,
        "serviceDuration": duration,
        "servicePrice": price
    }
    try:
        service = await services_collection.insert_one(services)
        return service.inserted_id
    except DuplicateKeyError:
        raise ValueError("Service already exists")
    

def get_service():
    cursor = services_collection.find({})
    df = pd.DataFrame(list(cursor))
    df["_id"] = df["_id"].astype(str)
    parsed_df = json.loads(df.to_json(orient="records"))
    return {"data": parsed_df}

def add_appointments(service_id, user_id, date_time, status):
    service = services_collection.find_one({"_id": ObjectId(service_id)})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    date_time = date_time.isoformat() 
    
    appointment = {
        "serviceId": ObjectId(service_id),
        "userId": ObjectId(user_id),
        "dateTime": date_time,
        "status":  status  
    }
    try:
        insert_result = appointments_collection.insert_one(appointment)
        return insert_result.inserted_id
    except DuplicateKeyError:
        raise ValueError("Service already exists")

