from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import EnhancementRequest, EnhancementResponse, ErrorResponse
from app.services.enhancement import enhancement_service
from app.core.exceptions import NVIDIAAPIError, ValidationError

router = APIRouter()

@router.post("/enhance", response_model=EnhancementResponse, responses={
    400: {"model": ErrorResponse},
    429: {"model": ErrorResponse},
    500: {"model": ErrorResponse},
    503: {"model": ErrorResponse}
})
async def enhance_prompt(request: EnhancementRequest):
    """Enhance a prompt using AI"""
    
    try:
        # Validate input
        if not request.prompt.strip():
            raise ValidationError("Prompt cannot be empty")
        
        if len(request.prompt) > 5000:
            raise ValidationError("Prompt too long (max 5000 characters)")
        
        # Check if prompt is too short for meaningful enhancement
        word_count = len(request.prompt.strip().split())
        if word_count < 3:
            raise ValidationError("Prompt too short (minimum 3 words required for meaningful enhancement)")
        
        # Process enhancement
        result = await enhancement_service.enhance_prompt(request)
        
        return result
        
    except ValidationError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": str(e),
                "code": "VALIDATION_ERROR"
            }
        )
    
    except NVIDIAAPIError as e:
        # Check if it's a rate limit error
        if "rate limit" in str(e).lower() or "429" in str(e):
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "code": "RATE_LIMIT_ERROR",
                    "details": {"message": str(e)}
                }
            )
        
        # Check if it's an authentication error
        elif "auth" in str(e).lower() or "401" in str(e) or "403" in str(e):
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "API authentication failed",
                    "code": "AUTH_ERROR",
                    "details": {"message": str(e)}
                }
            )
        
        # Other API errors
        else:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "AI service temporarily unavailable",
                    "code": "SERVICE_UNAVAILABLE",
                    "details": {"message": str(e)}
                }
            )
    
    except Exception as e:
        # Unexpected errors
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "code": "INTERNAL_ERROR",
                "details": {"message": str(e)}
            }
        )

@router.get("/enhance/status")
async def get_enhancement_status():
    """Get enhancement service status"""
    try:
        status = await enhancement_service.get_service_status()
        return {
            "status": status["overall"],
            "components": {
                "nvidia_api": status["nvidia_api"],
                "cache": status["cache"]
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to get service status",
                "code": "STATUS_ERROR",
                "details": {"message": str(e)}
            }
        )