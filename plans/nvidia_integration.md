# PromptForge AI - NVIDIA API Integration Plan

## 🔗 NVIDIA API Integration Overview

### Core Integration Strategy
- Use NVIDIA's `deepseek-v3.1` model via their API
- Implement robust error handling and retry logic
- Add caching to reduce API calls and costs
- Implement rate limiting to respect API quotas

## 🧠 System Prompt Design

### Primary System Prompt
```text
You are an expert prompt engineer specializing in optimizing prompts for AI models.

Your task is to analyze and enhance user prompts by:
1. Improving clarity and structure
2. Adding missing context and specificity
3. Making prompts more effective for AI comprehension
4. Providing multiple optimized variants

Return your response in valid JSON format exactly as specified below:

{
  "optimized_prompt": "The enhanced version of the original prompt",
  "score": 8.5,
  "explanation": "Brief explanation of what was improved and why",
  "variants": {
    "creative": "Creative/engaging version of the prompt",
    "technical": "Technical/detailed version of the prompt", 
    "concise": "Concise/summarized version of the prompt"
  }
}

Guidelines:
- Score should be between 1-10 based on prompt quality improvement
- Explanation should be 2-3 sentences maximum
- Variants should maintain the core intent but approach differently
- Keep optimized prompt under 500 words
- Ensure JSON is valid and properly formatted
```

### Mode-Specific Variations

**Basic Mode**: Simplified system prompt focusing on core improvements
**Detailed Mode**: Comprehensive analysis with extensive context addition
**Creative Mode**: Emphasis on engaging language and storytelling elements

## ⚙️ API Configuration

### NVIDIA API Endpoint
```python
NVIDIA_API_CONFIG = {
    "base_url": "https://integrate.api.nvidia.com/v1",
    "model": "deepseek-v3.1",
    "endpoint": "/chat/completions",
    "timeout": 30.0,
    "max_retries": 3
}
```

### Request Parameters
```python
REQUEST_PARAMS = {
    "temperature": 0.7,
    "max_tokens": 2000,
    "top_p": 0.9,
    "frequency_penalty": 0.1,
    "presence_penalty": 0.1
}
```

## 🔧 Implementation Details

### Core Integration Class
```python
import httpx
import json
import time
from typing import Dict, Optional
from app.core.config import settings
from app.models.schemas import EnhanceResponse

class NVIDIAAPIService:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.timeout = 30.0
        self.max_retries = 3
        self.retry_delay = 1.0
    
    async def enhance_prompt(self, prompt: str, mode: str) -> EnhanceResponse:
        """Enhanced prompt optimization with retry logic"""
        
        system_prompt = self._get_system_prompt(mode)
        
        for attempt in range(self.max_retries):
            try:
                response = await self._make_api_call(prompt, system_prompt)
                return self._parse_response(response)
                
            except httpx.TimeoutException:
                if attempt == self.max_retries - 1:
                    raise Exception("NVIDIA API timeout after multiple attempts")
                await asyncio.sleep(self.retry_delay * (2 ** attempt))
                
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Rate limit
                    if attempt == self.max_retries - 1:
                        raise Exception("Rate limit exceeded")
                    await asyncio.sleep(5)  # Wait longer for rate limits
                else:
                    raise Exception(f"NVIDIA API error: {e.response.text}")
                    
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise Exception(f"Failed after {self.max_retries} attempts: {str(e)}")
                await asyncio.sleep(self.retry_delay)
    
    async def _make_api_call(self, prompt: str, system_prompt: str) -> Dict:
        """Make actual API call to NVIDIA"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "PromptForgeAI/1.0.0"
                },
                json={
                    "model": "deepseek-v3.1",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000,
                    "top_p": 0.9
                },
                timeout=self.timeout
            )
            
            response.raise_for_status()
            return response.json()
    
    def _parse_response(self, response: Dict) -> EnhanceResponse:
        """Parse and validate NVIDIA API response"""
        try:
            content = response["choices"][0]["message"]["content"]
            
            # Clean up response (remove markdown code blocks)
            content = content.replace("```json", "").replace("```", "").strip()
            
            # Parse JSON
            enhanced_data = json.loads(content)
            
            # Validate required fields
            required_fields = ["optimized_prompt", "score", "explanation", "variants"]
            for field in required_fields:
                if field not in enhanced_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Validate variants
            variant_fields = ["creative", "technical", "concise"]
            for field in variant_fields:
                if field not in enhanced_data["variants"]:
                    raise ValueError(f"Missing variant field: {field}")
            
            return EnhanceResponse(**enhanced_data)
            
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            raise Exception(f"Failed to parse NVIDIA API response: {str(e)}")
    
    def _get_system_prompt(self, mode: str) -> str:
        """Get mode-specific system prompt"""
        base_prompt = """You are an expert prompt engineer. Improve user prompts for AI models.
        
        Steps:
        1. Analyze the input prompt
        2. Improve clarity and structure
        3. Add missing context
        4. Make it more effective
        
        Return in JSON:
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
        
        mode_additions = {
            "basic": "Focus on essential improvements only.",
            "detailed": "Provide comprehensive analysis and extensive context.",
            "creative": "Emphasize engaging language and storytelling elements."
        }
        
        addition = mode_additions.get(mode, mode_additions["detailed"])
        return f"{base_prompt}\n\n{addition}"
```

## 🛡️ Error Handling & Resilience

### Error Categories
1. **API Errors**: HTTP status errors, rate limiting
2. **Parsing Errors**: Invalid JSON, missing fields
3. **Network Errors**: Timeouts, connection issues
4. **Content Errors**: Inappropriate content, prompt injection

### Retry Strategy
```python
RETRY_CONFIG = {
    "max_retries": 3,
    "backoff_factor": 1.0,
    "status_forcelist": [429, 500, 502, 503, 504],
    "allowed_methods": ["POST"]
}
```

## 💰 Cost Optimization

### Caching Strategy
- Cache identical prompts for 1 hour
- Use prompt hash as cache key
- Implement cache warming for popular prompts
- Monitor cache hit rates

### Token Usage Optimization
- Set appropriate `max_tokens` limits
- Monitor average response length
- Implement response compression if needed

## 📊 Monitoring & Analytics

### Key Metrics to Track
- API response times
- Error rates by category
- Token usage per request
- Cache hit rates
- Cost per enhancement

### Health Checks
```python
async def check_nvidia_api_health() -> Dict:
    """Check NVIDIA API health status"""
    try:
        start_time = time.time()
        response = await make_test_call()
        response_time = time.time() - start_time
        
        return {
            "status": "healthy",
            "response_time": response_time,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
```

## 🔒 Security Considerations

### Input Validation
- Validate prompt length and content
- Filter potentially harmful content
- Implement prompt injection detection

### API Key Security
- Store API keys in environment variables
- Rotate keys regularly
- Monitor for suspicious usage patterns

## 🚀 Performance Optimization

### Async Processing
- Use async/await for non-blocking API calls
- Implement connection pooling
- Batch processing for future features

### Response Optimization
- Compress large responses
- Implement streaming for real-time updates
- Cache partial responses

## 📈 Scaling Considerations

### Horizontal Scaling
- Multiple API keys for load distribution
- Geographic distribution of API calls
- Load balancing between different endpoints

### Vertical Scaling
- Connection pooling optimization
- Memory usage monitoring
- Database connection management

This NVIDIA API integration plan provides a robust, scalable foundation for the PromptForge AI service with comprehensive error handling, cost optimization, and performance monitoring.