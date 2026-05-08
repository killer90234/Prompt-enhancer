# PromptForge AI - Database Schema & API Specifications

## 🗃️ Database Schema (Optional)

### PostgreSQL Schema Design

```sql
-- Core prompts table for history feature
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_text TEXT NOT NULL,
    optimized_prompt TEXT NOT NULL,
    score DECIMAL(3,1) NOT NULL CHECK (score >= 1 AND score <= 10),
    explanation TEXT NOT NULL,
    variants JSONB NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'detailed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NULL, -- For future user accounts
    
    -- Indexes for performance
    CONSTRAINT prompts_score_check CHECK (score >= 1 AND score <= 10)
);

-- Users table (for future authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    requests_today INTEGER DEFAULT 0,
    last_request_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(50) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_prompts_created_at ON prompts(created_at);
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_score ON prompts(score);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);

-- Update trigger for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Database Models (`backend/app/models/database.py`)

```python
from sqlalchemy import Column, String, Text, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid
from datetime import datetime

Base = declarative_base()

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    input_text = Column(Text, nullable=False)
    optimized_prompt = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    variants = Column(JSON, nullable=False)
    mode = Column(String(20), nullable=False, default="detailed")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(UUID(as_uuid=True), nullable=True)
```

## 📡 API Endpoint Specifications

### API Base Information
- **Base URL**: `https://api.promptforge.ai/api/v1`
- **Authentication**: API Key (Bearer Token) - Future implementation
- **Content Type**: `application/json`
- **Rate Limiting**: 10 requests per minute per IP

### 1. Enhance Prompt Endpoint

**Endpoint**: `POST /enhance`

**Description**: Enhance a user prompt using AI optimization

**Request Body**:
```json
{
  "prompt": "write blog about AI",
  "mode": "detailed"
}
```

**Parameters**:
- `prompt` (string, required): Raw input prompt to enhance (1-5000 characters)
- `mode` (string, optional): Enhancement mode - `basic`, `detailed`, `creative` (default: `detailed`)

**Response**:
```json
{
  "optimized_prompt": "Write a comprehensive blog post about artificial intelligence that explores its current applications, future potential, and ethical considerations. Focus on making the content accessible to readers with varying levels of technical knowledge.",
  "score": 8.5,
  "explanation": "Added context about target audience (varying technical knowledge), specified content focus (current applications, future potential, ethics), and improved structure for better readability.",
  "variants": {
    "creative": "Craft an engaging narrative about AI's impact on society, weaving together personal stories, technological breakthroughs, and philosophical questions about the future of intelligence.",
    "technical": "Provide a technical analysis of machine learning algorithms, neural network architectures, and their practical applications in industries like healthcare, finance, and autonomous systems.",
    "concise": "Summarize key AI concepts, major breakthroughs, and practical applications in a clear, accessible format suitable for busy professionals."
  }
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid input)
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

### 2. Health Check Endpoint

**Endpoint**: `GET /health`

**Description**: Check API health and status

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "services": {
    "nvidia_api": "operational",
    "redis": "operational",
    "database": "operational"
  }
}
```

### 3. Get Prompt History Endpoint (Future)

**Endpoint**: `GET /history`

**Description**: Retrieve user's prompt enhancement history

**Query Parameters**:
- `limit` (integer): Number of results (default: 10, max: 50)
- `offset` (integer): Pagination offset (default: 0)

**Response**:
```json
{
  "prompts": [
    {
      "id": "uuid",
      "input_text": "original prompt",
      "optimized_prompt": "enhanced version",
      "score": 8.5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

## 🔐 Authentication & Security

### API Key Authentication (Future)
```http
Authorization: Bearer pf_sk_1234567890abcdef
```

### Rate Limiting Headers
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1640995200
```

## 🧪 Error Responses

### Common Error Patterns

**400 Bad Request**:
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Prompt cannot be empty",
  "details": {
    "field": "prompt",
    "constraint": "required"
  }
}
```

**429 Rate Limit Exceeded**:
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again in 60 seconds.",
  "retry_after": 60
}
```

**500 Internal Server Error**:
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "request_id": "req_123456"
}
```

## 📊 API Usage Examples

### cURL Example
```bash
curl -X POST https://api.promptforge.ai/api/v1/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "help me write a marketing email",
    "mode": "creative"
  }'
```

### JavaScript Example
```javascript
const enhancePrompt = async (prompt, mode = 'detailed') => {
  const response = await fetch('/api/v1/enhance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, mode }),
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return response.json();
};
```

### Python Example
```python
import requests

url = "https://api.promptforge.ai/api/v1/enhance"
data = {
    "prompt": "explain quantum computing",
    "mode": "technical"
}

response = requests.post(url, json=data)
result = response.json()
```

## 🔄 WebSocket Support (Future)

**Endpoint**: `ws://api.promptforge.ai/api/v1/ws`

**Real-time enhancement with progress updates**:
```json
{
  "type": "enhance",
  "prompt": "user prompt",
  "mode": "detailed"
}
```

**Progress updates**:
```json
{
  "type": "progress",
  "stage": "analyzing",
  "progress": 25
}
```

## 📈 Monitoring & Analytics

### Request Metrics
- Response time percentiles
- Error rates by endpoint
- Usage patterns by time of day
- Most common enhancement modes

### Business Metrics
- Daily active users
- Average prompts per user
- Most improved prompt categories
- User retention rates

This comprehensive API specification provides a solid foundation for the PromptForge AI service with proper error handling, rate limiting, and future expansion capabilities.