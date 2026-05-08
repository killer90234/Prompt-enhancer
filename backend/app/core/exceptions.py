class PromptForgeError(Exception):
    """Base exception for PromptForge AI"""
    pass

class NVIDIAAPIError(PromptForgeError):
    """Exception for NVIDIA API errors"""
    pass

class ValidationError(PromptForgeError):
    """Exception for input validation errors"""
    pass

class CacheError(PromptForgeError):
    """Exception for caching errors"""
    pass

class RateLimitError(PromptForgeError):
    """Exception for rate limiting"""
    pass