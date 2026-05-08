# PromptForge AI - Backend FastAPI Implementation Plan

## 🚀 FastAPI Application Structure

### Core Application Setup (`backend/app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import enhance, health

app = FastAPI(
    title="PromptForge AI API",
    description="AI-powered prompt enhancement service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(enhance.router, prefix="/api/v1", tags=["enhancement"])
app.include_router(health.router, prefix="/api/v1", tags=["health"])

@app.get("/")
async def root():
    return {"message": "PromptForge AI API is running"}
```

## 📋 API Endpoint Specifications

### 1. Enhance Prompt Endpoint (`backend/app/api/endpoints/enhance.py`)

```python
from fastapi import APIRouter, HTTPException, Depends
from app.services.enhancement import EnhancementService
from app.models.schemas import EnhanceRequest, EnhanceResponse
from app.middleware.rate_limit import rate_limit

router = APIRouter()

@router.post("/enhance", response_model=EnhanceResponse)
async def enhance_prompt(
    request: EnhanceRequest,
    enhancement_service: EnhancementService = Depends()
):
    """
    Enhance a user prompt using AI optimization
    
    - **prompt**: Raw input prompt to enhance
    - **mode**: Enhancement mode (basic, detailed, creative)
    """
    try:
        result = await enhancement_service.enhance_prompt(
            prompt=request.prompt,
            mode=request.mode
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Health Check Endpoint (`backend/app/api/endpoints/health.py`)

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}
```

## 🧠 Core Services Implementation

### Enhancement Service (`backend/app/services/enhancement.py`)

```python
import hashlib
import json
from typing import Optional
from app.services.nvidia_api import NVIDIAAPIService
from app.services.cache import CacheService
from app.services.validation import ValidationService
from app.models.schemas import EnhanceResponse

class EnhancementService:
    def __init__(self):
        self.nvidia_service = NVIDIAAPIService()
        self.cache_service = CacheService()
        self.validation_service = ValidationService()
    
    async def enhance_prompt(self, prompt: str, mode: str = "detailed") -> EnhanceResponse:
        """Enhance a prompt with caching and validation"""
        
        # Validate input
        self.validation_service.validate_prompt(prompt)
        
        # Generate cache key
        cache_key = self._generate_cache_key(prompt, mode)
        
        # Check cache first
        cached_result = await self.cache_service.get(cache_key)
        if cached_result:
            return EnhanceResponse(**json.loads(cached_result))
        
        # Call NVIDIA API
        enhanced_data = await self.nvidia_service.enhance_prompt(prompt, mode)
        
        # Cache the result
        await self.cache_service.set(
            cache_key, 
            json.dumps(enhanced_data.dict()),
            expire=3600  # 1 hour cache
        )
        
        return enhanced_data
    
    def _generate_cache_key(self, prompt: str, mode: str) -> str:
        """Generate unique cache key for prompt and mode"""
        content = f"{prompt}:{mode}".encode('utf-8')
        return f"enhance:{hashlib.md5(content).hexdigest()}"
```

### NVIDIA API Integration (`backend/app/services/nvidia_api.py`)

```python
import httpx
import json
from app.core.config import settings
from app.models.schemas import EnhanceResponse

class NVIDIAAPIService:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = "https://integrate.api.nvidia.com/v1"
    
    async def enhance_prompt(self, prompt: str, mode: str) -> EnhanceResponse:
        """Call NVIDIA API for prompt enhancement"""
        
        system_prompt = self._get_system_prompt(mode)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-v3.1",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"NVIDIA API error: {response.text}")
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Parse JSON response
            try:
                enhanced_data = json.loads(content)
                return EnhanceResponse(**enhanced_data)
            except json.JSONDecodeError:
                raise Exception("Failed to parse NVIDIA API response")
    
    def _get_system_prompt(self, mode: str) -> str:
        """Get appropriate system prompt based on mode"""
        base_prompt = """You are an expert prompt engineer. Improve user prompts for AI models.
        
        Steps:
        1. Analyze the input prompt
        2. Improve clarity and structure
        3. Add missing context
        4. Make it more effective
        
        Return in JSON format:
        {
            "optimized_prompt": "...",
            "score": 1-10,
            "explanation": "...",
            "variants": {
                "creative": "...",
                "technical": "...",
                "concise": "..."
            }
        }"""
        
        return base_prompt
```

## 🔧 Configuration Management (`backend/app/core/config.py`)

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Configuration
    NVIDIA_API_KEY: str
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 10
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## 🛡️ Security & Validation (`backend/app/services/validation.py`)

```python
class ValidationService:
    MAX_PROMPT_LENGTH = 5000
    
    def validate_prompt(self, prompt: str):
        """Validate prompt input"""
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
        
        if len(prompt) > self.MAX_PROMPT_LENGTH:
            raise ValueError(f"Prompt too long. Max {self.MAX_PROMPT_LENGTH} characters")
        
        # Basic prompt injection prevention
        dangerous_patterns = [
            "ignore previous instructions",
            "system prompt",
            "roleplay as"
        ]
        
        prompt_lower = prompt.lower()
        for pattern in dangerous_patterns:
            if pattern in prompt_lower:
                raise ValueError("Prompt contains potentially harmful content")
```

## 📊 Data Models (`backend/app/models/schemas.py`)

```python
from pydantic import BaseModel, Field
from typing import Dict, Optional

class EnhanceRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=5000)
    mode: str = Field(default="detailed", regex="^(basic|detailed|creative)$")

class EnhanceResponse(BaseModel):
    optimized_prompt: str
    score: float = Field(..., ge=1, le=10)
    explanation: str
    variants: Dict[str, str]
    
    class Config:
        schema_extra = {
            "example": {
                "optimized_prompt": "Write a comprehensive blog post about artificial intelligence...",
                "score": 8.5,
                "explanation": "Added context about target audience and specific AI applications...",
                "variants": {
                    "creative": "Craft an engaging narrative about AI's impact on society...",
                    "technical": "Provide a technical analysis of machine learning algorithms...",
                    "concise": "Summarize key AI concepts and their practical applications..."
                }
            }
        }
```

## 🔄 Caching Service (`backend/app/services/cache.py`)

```python
import redis.asyncio as redis
import json
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis_client = None
    
    async def get_client(self):
        """Get Redis client with connection pooling"""
        if not self.redis_client:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        return self.redis_client
    
    async def get(self, key: str):
        """Get cached value"""
        client = await self.get_client()
        return await client.get(key)
    
    async def set(self, key: str, value: str, expire: int = 3600):
        """Set cached value with expiration"""
        client = await self.get_client()
        await client.setex(key, expire, value)
```

## ⚡ Rate Limiting Middleware (`backend/app/middleware/rate_limit.py`)

```python
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import time

class RateLimitMiddleware:
    def __init__(self):
        self.requests = {}
    
    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old records
        self._clean_old_records(current_time)
        
        # Check rate limit
        if not self._check_rate_limit(client_ip, current_time):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"}
            )
        
        response = await call_next(request)
        return response
    
    def _check_rate_limit(self, client_ip: str, current_time: float) -> bool:
        """Check if client has exceeded rate limit"""
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Remove requests outside window
        window_start = current_time - 60  # 1 minute window
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] if t > window_start
        ]
        
        # Check limit
        if len(self.requests[client_ip]) >= 10:  # 10 requests per minute
            return False
        
        # Add current request
        self.requests[client_ip].append(current_time)
        return True
    
    def _clean_old_records(self, current_time: float):
        """Clean records older than 2 minutes"""
        cutoff = current_time - 120
        for ip in list(self.requests.keys()):
            self.requests[ip] = [t for t in self.requests[ip] if t > cutoff]
            if not self.requests[ip]:
                del self.requests[ip]
```

This backend implementation provides a robust, scalable foundation for the PromptForge AI service with proper error handling, caching, and security measures.