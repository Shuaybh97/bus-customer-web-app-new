from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.core.supabase_client import get_supabase_client
from typing import Optional

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Get current authenticated user from Supabase token.
    
    Returns None if not authenticated (for optional authentication).
    """
    if not credentials:
        return None
    
    try:
        # Get user from token
        token = credentials.credentials
        
        # Set the auth token for this request
        supabase.auth.set_session(token, token)  # access_token, refresh_token
        
        # Get user
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            return None
        
        return user_response.user
        
    except Exception as e:
        return None

async def require_authentication(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Require authentication - raise 401 if not authenticated.
    
    Use this as a dependency for protected routes.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        token = credentials.credentials
        
        # Set the auth token
        supabase.auth.set_session(token, token)
        
        # Get user
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user_response.user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
