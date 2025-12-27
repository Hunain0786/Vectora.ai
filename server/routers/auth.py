from fastapi import APIRouter, HTTPException, Body
from passlib.context import CryptContext
from models import User, UserRegister, UserLogin
from database import db
from datetime import datetime

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
async def register(user: UserRegister):
    try:
        users_collection = db.get_db()["ai.Users"]
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user document
        new_user = User(
            email=user.email,
            username=f"{user.first_name} {user.last_name}",
            password_hash=get_password_hash(user.password),
            created_at=datetime.utcnow()
        )
        
        result = await users_collection.insert_one(new_user.dict())
        
        return {
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[!] Database Error in /register: {e}")
        raise HTTPException(status_code=503, detail="Database connection unavailable")

@router.post("/login")
async def login(credentials: UserLogin):
    try:
        users_collection = db.get_db()["ai.Users"]
        
        user = await users_collection.find_one({"email": credentials.email})
        if not user:
            raise HTTPException(status_code=400, detail="Invalid email or password")
            
        if not verify_password(credentials.password, user.get("password_hash")):
            raise HTTPException(status_code=400, detail="Invalid email or password")
            
        return {
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[!] Database Error in /login: {e}")
        raise HTTPException(status_code=503, detail="Database connection unavailable")
