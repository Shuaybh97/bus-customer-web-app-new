from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.supabase_client import get_supabase_client
from supabase import Client

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Request/Response Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict

class User(BaseModel):
    id: str
    email: str
    created_at: str

@router.post("/register", response_model=dict)
async def register(user: UserRegister, supabase: Client = Depends(get_supabase_client)):
    """
    Register a new user using Supabase Auth.
    
    Supabase automatically:
    - Hashes the password
    - Creates user in auth.users table
    - Sends confirmation email (if enabled)
    """
    try:
        # Sign up with Supabase Auth
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
        
        return {
            "message": "Registration successful",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        }
        
    except Exception as e:
        error_message = str(e)
        if "already registered" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, supabase: Client = Depends(get_supabase_client)):
    """
    Login with email and password using Supabase Auth.
    
    Returns access token and refresh token.
    """
    try:
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

@router.get("/me", response_model=User)
async def get_me(supabase: Client = Depends(get_supabase_client)):
    """
    Get current user information.
    
    Note: Requires Authorization header with Bearer token.
    The Supabase client will automatically use the token from the request.
    """
    try:
        # Get user from Supabase Auth
        user = supabase.auth.get_user()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "created_at": user.user.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

@router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase_client)):
    """
    Logout the current user.
    
    This invalidates the current session.
    """
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    supabase: Client = Depends(get_supabase_client)
):
    """
    Refresh access token using refresh token.
    
    This is useful for maintaining user sessions without re-login.
    """
    try:
        response = supabase.auth.refresh_session(refresh_token)
        
        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.post("/reset-password-request")
async def reset_password_request(
    email: EmailStr,
    supabase: Client = Depends(get_supabase_client)
):
    """
    Request a password reset email.
    
    Supabase will send a password reset link to the user's email.
    """
    try:
        supabase.auth.reset_password_for_email(email)
        return {"message": "Password reset email sent"}
    except Exception as e:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/update-password")
async def update_password(
    new_password: str,
    supabase: Client = Depends(get_supabase_client)
):
    """
    Update user password.
    
    Requires valid authentication token.
    """
    try:
        response = supabase.auth.update_user({
            "password": new_password
        })
        
        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
        
        return {"message": "Password updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
