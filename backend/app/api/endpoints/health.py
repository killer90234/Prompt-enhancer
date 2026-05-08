from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.schemas import HealthResponse
from app.services.enhancement import enhancement_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Get service status
        service_status = await enhancement_service.get_service_status()
        
        # Determine overall health
        if service_status["overall"] == "healthy":
            status = "healthy"
        elif service_status["overall"] == "degraded":
            status = "degraded"
        else:
            status = "unhealthy"
        
        return HealthResponse(
            status=status,
            version="1.0.0",
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service health check failed: {str(e)}"
        )

@router.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check with component status"""
    try:
        service_status = await enhancement_service.get_service_status()
        
        return {
            "status": service_status["overall"],
            "components": {
                "nvidia_api": service_status["nvidia_api"],
                "cache": service_status["cache"]
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "version": "1.0.0"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Detailed health check failed: {str(e)}"
        )