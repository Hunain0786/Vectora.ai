from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QueryRequest(BaseModel):
    question: str
    visualize: bool = False
    user_id: Optional[str] = None

class User(BaseModel):
    email: str
    username: str
    password_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatLog(BaseModel):
    user_id: Optional[str]
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
