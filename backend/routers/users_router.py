from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, models, auth, database

router = APIRouter()

@router.get("/", response_model=List[schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users
