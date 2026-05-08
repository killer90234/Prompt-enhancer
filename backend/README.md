# PromptForge AI - Backend

FastAPI backend service for AI-powered prompt enhancement.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI App   │◄──►│   NVIDIA API     │◄──►│     Redis       │
│                 │    │                 │    │    (Cache)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└─────────────────┘
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   └── endpoints/          # API route handlers
│   ├── core/
│   │   ├── config.py           # Configuration management
│   │   └── exceptions.py       # Custom exceptions
│   ├── models/
│   │   └── schemas.py          # Pydantic schemas
│   └── services/
│       ├── enhancement.py      # Core enhancement logic
│       ├── nvidia_api.py       # NVIDIA API integration
│       └── cache.py            # Redis caching
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
└── Dockerfile                 # Container configuration
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- NVIDIA API Key
- Redis server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptforge-ai/backend
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your NVIDIA API key
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

5. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📚 API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Enhance Prompt
```http
POST /api/v1/enhance
Content-Type: application/json

{
  "prompt": "Write a story about a robot",
  "mode": "creative"
}
```

**Response:**
```json
{
  "original_prompt": "Write a story about a robot",
  "optimized_prompt": "Write a compelling science fiction story...",
  "score": 8.5,
  "explanation": "Added specificity and emotional depth...",
  "variants": [
    {
      "text": "Alternative prompt...",
      "score": 8.2,
      "explanation": "Different approach..."
    }
  ],
  "mode": "creative"
}
```

#### Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NVIDIA_API_KEY` | NVIDIA API key | Required |
| `NVIDIA_API_BASE_URL` | NVIDIA API base URL | `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_MODEL` | AI model to use | `mistralai/mistral-7b-instruct-v0.3` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `REDIS_CACHE_TTL` | Cache TTL in seconds | `3600` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

## 🧪 Testing

```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## 📊 Monitoring

### Health Checks

- `/api/v1/health` - Basic health check
- `/api/v1/health/detailed` - Detailed component status

### Metrics

- API response times
- Cache hit rates
- Error rates
- NVIDIA API usage

## 🔒 Security

- Input validation with Pydantic
- Rate limiting
- CORS protection
- Environment variable security

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
2. **Build Docker image**
   ```bash
   docker build -t promptforge-backend .
   ```
3. **Deploy to platform** (Railway, Render, etc.)

### Environment Setup

```bash
# Production environment variables
NVIDIA_API_KEY=your_production_key
REDIS_URL=redis://your-redis-host:6379
CORS_ORIGINS=https://your-frontend-domain.com
ENVIRONMENT=production
DEBUG=false
```

## 🤝 Contributing

1. Follow the code style
2. Write tests for new features
3. Update documentation
4. Submit pull requests

## 📄 License

MIT License