import datetime 

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
