import redis.asyncio as redis
import json
import hashlib
from typing import Optional, Any
from app.core.config import settings
from app.core.exceptions import CacheError

class CacheService:
    """Redis caching service for prompt enhancement results"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.ttl = settings.REDIS_CACHE_TTL
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            # Test connection
            await self.redis_client.ping()
        except Exception as e:
            raise CacheError(f"Failed to connect to Redis: {str(e)}")
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
    
    def _generate_cache_key(self, prompt: str, mode: str) -> str:
        """Generate a cache key from prompt and mode"""
        key_string = f"{prompt}:{mode}".encode('utf-8')
        return f"prompt:{hashlib.md5(key_string).hexdigest()}"
    
    async def get_cached_result(self, prompt: str, mode: str) -> Optional[dict]:
        """Get cached enhancement result"""
        if not self.redis_client:
            return None
        
        try:
            cache_key = self._generate_cache_key(prompt, mode)
            cached_data = await self.redis_client.get(cache_key)
            
            if cached_data:
                return json.loads(cached_data)
            return None
            
        except Exception as e:
            raise CacheError(f"Failed to get cached result: {str(e)}")
    
    async def set_cached_result(self, prompt: str, mode: str, result: dict) -> bool:
        """Cache enhancement result"""
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._generate_cache_key(prompt, mode)
            await self.redis_client.setex(
                cache_key,
                self.ttl,
                json.dumps(result)
            )
            return True
            
        except Exception as e:
            raise CacheError(f"Failed to cache result: {str(e)}")
    
    async def clear_cache(self) -> bool:
        """Clear all cached results"""
        if not self.redis_client:
            return False
        
        try:
            keys = await self.redis_client.keys("prompt:*")
            if keys:
                await self.redis_client.delete(*keys)
            return True
            
        except Exception as e:
            raise CacheError(f"Failed to clear cache: {str(e)}")
    
    async def get_cache_stats(self) -> dict:
        """Get cache statistics"""
        if not self.redis_client:
            return {"connected": False}
        
        try:
            keys = await self.redis_client.keys("prompt:*")
            return {
                "connected": True,
                "total_cached": len(keys),
                "ttl": self.ttl
            }
            
        except Exception as e:
            raise CacheError(f"Failed to get cache stats: {str(e)}")

# Create singleton instance
cache_service = CacheService()