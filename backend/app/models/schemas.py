from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class EnhancementMode(str, Enum):
    STANDARD = "standard"
    CREATIVE = "creative"
    TECHNICAL = "technical"
    CONCISE = "concise"

class EnhancementRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000, description="The prompt to enhance")
    mode: EnhancementMode = Field(default=EnhancementMode.STANDARD, description="Enhancement mode")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "prompt": "Write a story about a robot",
                "mode": "creative"
            }
        }
    }

class Variant(BaseModel):
    text: str = Field(..., description="Enhanced prompt variant")
    score: float = Field(..., ge=0, le=10, description="Quality score (0-10)")
    explanation: str = Field(..., description="Why this variant is effective")

class EnhancementResponse(BaseModel):
    original_prompt: str = Field(..., description="Original input prompt")
    optimized_prompt: str = Field(..., description="Primary optimized prompt")
    score: float = Field(..., ge=0, le=10, description="Overall quality score (0-10)")
    explanation: str = Field(..., description="Explanation of improvements")
    variants: List[Variant] = Field(..., description="Alternative prompt variants")
    mode: EnhancementMode = Field(..., description="Enhancement mode used")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "original_prompt": "Write a story about a robot",
                "optimized_prompt": "Write a compelling science fiction story about an advanced AI robot that gains consciousness and explores themes of humanity, ethics, and the nature of existence",
                "score": 8.5,
                "explanation": "Added specificity, emotional depth, and thematic elements to create a more engaging prompt",
                "variants": [
                    {
                        "text": "Craft a narrative about a sentient robot navigating human society while questioning its own identity",
                        "score": 8.2,
                        "explanation": "Focuses on identity and social integration themes"
                    }
                ],
                "mode": "creative"
            }
        }
    }

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "Invalid API key",
                "code": "AUTH_ERROR",
                "details": {"field": "api_key"}
            }
        }
    }

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "healthy",
                "version": "1.0.0",
                "timestamp": "2024-01-01T00:00:00Z"
            }
        }
    }