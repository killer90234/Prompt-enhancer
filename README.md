# PromptForge AI

AI-powered prompt enhancement tool that optimizes your prompts for better AI model performance using NVIDIA AI APIs.

## 🚀 Features

- **Smart Prompt Enhancement**: Automatically improves prompts for clarity, specificity, and effectiveness
- **Multiple Enhancement Modes**: Standard, Creative, Technical, and Concise modes
- **Real-time Optimization**: Fast response times with Redis caching
- **Variant Generation**: Multiple optimized prompt variations
- **Quality Scoring**: AI-powered quality assessment for each enhancement
- **Copy-to-Clipboard**: Easy copying of enhanced prompts

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   NVIDIA AI     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│     API        │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│     Browser      │    │     Redis        │
│                 │    │    (Cache)       │
└─────────────────┘    └─────────────────┘
```

## 📦 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **NVIDIA AI API** - AI-powered prompt enhancement
- **Redis** - Caching layer for performance
- **Pydantic** - Data validation and serialization

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

## 🛠️ Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- NVIDIA API Key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptforge-ai
   ```

2. **Set up environment variables**
   ```bash
   # Backend (.env)
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your NVIDIA API key
   
   # Frontend (.env.local)
   cp frontend/.env.local.example frontend/.env.local
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

### Endpoints

- `POST /api/v1/enhance` - Enhance a prompt
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/detailed` - Detailed health status

### Enhancement Request
```json
{
  "prompt": "Write a story about a robot",
  "mode": "creative"
}
```

### Enhancement Response
```json
{
  "original_prompt": "Write a story about a robot",
  "optimized_prompt": "Write a compelling science fiction story...",
  "score": 8.5,
  "explanation": "Added specificity and emotional depth...",
  "variants": [...],
  "mode": "creative"
}
```

## 🚀 Deployment

### Production Deployment

1. **Set up environment variables** for production
2. **Build and deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Platform Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway/Render
- **Redis**: Use Redis Cloud or similar service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NVIDIA for providing the AI API
- FastAPI and Next.js communities
- All contributors and testers