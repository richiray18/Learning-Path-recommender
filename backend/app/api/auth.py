from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, LearnerProfile
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserMeResponse
from app.core.security import verify_password, get_password_hash, create_access_token, security_bearer, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> User:
    if not credentials:
        # Fallback to demo user if unauthenticated in preview
        demo = db.query(User).filter(User.email == "demo@learnora.app").first()
        if demo:
            return demo
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication credentials required")

    user_id = decode_access_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password)
    )
    db.add(user)
    db.flush()

    profile = LearnerProfile(
        user_id=user.id,
        experience_level=data.experience_level or "intermediate",
        career_goal=data.career_goal or "Machine Learning Engineer"
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        email=user.email
    )

@router.post("/login", response_model=TokenResponse)
def login(data: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        email=user.email
    )

@router.get("/me", response_model=UserMeResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserMeResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        avatar=current_user.avatar
    )

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}
