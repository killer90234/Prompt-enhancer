# PromptForge AI - Project Directory Structure

## 📁 Complete Project Layout

```
promptforge-ai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── endpoints/
│   │   │       ├── __init__.py
│   │   │       ├── enhance.py  # /enhance endpoint
│   │   │       └── health.py   # Health check endpoint
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py      # Configuration management
│   │   │   ├── security.py    # Security utilities
│   │   │   └── exceptions.py  # Custom exceptions
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── enhancement.py  # Core enhancement logic
│   │   │   ├── nvidia_api.py   # NVIDIA API integration
│   │   │   ├── cache.py       # Redis caching
│   │   │   └── validation.py   # Input validation
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── schemas.py     # Pydantic schemas
│   │   │   └── database.py    # Database models (optional)
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── rate_limit.py   # Rate limiting middleware
│   │       └── cors.py        # CORS middleware
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_api.py
│   │   ├── test_services.py
│   │   └── test_integration.py
│   ├── requirements.txt       # Python dependencies
│   ├── requirements-dev.txt  # Development dependencies
│   ├── .env.example          # Environment variables template
│   ├── Dockerfile
│   └── README.md
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── api/
│   │       └── enhance/
│   │           └── route.ts  # API route (proxy to backend)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx    # Reusable button
│   │   │   ├── input.tsx     # Text input
│   │   │   ├── card.tsx      # Card component
│   │   │   └── tabs.tsx      # Tabs component
│   │   ├── prompt-input.tsx  # Main prompt input
│   │   ├── result-card.tsx   # Result display
│   │   ├── variants-tabs.tsx  # Variants tabs
│   │   ├── loader.tsx        # Loading spinner
│   │   └── copy-button.tsx   # Copy to clipboard
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # Utility functions
│   │   └── constants.ts      # App constants
│   ├── hooks/
│   │   ├── use-enhancement.ts # Enhancement hook
│   │   └── use-copy.ts       # Copy hook
│   ├── types/
│   │   ├── api.ts            # API types
│   │   └── enhancement.ts    # Enhancement types
│   ├── public/
│   │   ├── favicon.ico
│   │   └── images/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── docs/                     # Documentation
│   ├── api.md               # API documentation
│   ├── deployment.md        # Deployment guide
│   └── development.md      # Development setup
├── docker-compose.yml       # Local development
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI pipeline
│       └── cd.yml          # CD pipeline
├── .gitignore
├── README.md               # Project overview
└── package.json           # Root package.json (monorepo)
```

## 🔧 Key File Descriptions

### Backend Core Files
- **`backend/app/main.py`**: FastAPI application setup and routing
- **`backend/app/api/endpoints/enhance.py`**: Main enhancement endpoint
- **`backend/app/services/enhancement.py`**: Core prompt enhancement logic
- **`backend/app/services/nvidia_api.py`**: NVIDIA API integration
- **`backend/app/core/config.py`**: Configuration management

### Frontend Core Files
- **`frontend/app/page.tsx`**: Home page with prompt input
- **`frontend/components/prompt-input.tsx`**: Main textarea component
- **`frontend/components/result-card.tsx`**: Result display component
- **`frontend/lib/api.ts`**: API client for backend communication
- **`frontend/hooks/use-enhancement.ts`**: Custom hook for enhancement logic

### Configuration Files
- **`backend/.env.example`**: Environment variables template
- **`frontend/.env.local`**: Frontend environment variables
- **`docker-compose.yml`**: Local development setup
- **`requirements.txt`**: Python dependencies

## 🗃️ Database Schema (Optional)

```sql
-- prompts table (optional for history feature)
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_text TEXT NOT NULL,
    optimized_prompt TEXT NOT NULL,
    score DECIMAL(3,1) NOT NULL,
    explanation TEXT NOT NULL,
    variants JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id UUID NULL -- for future user accounts
);

-- Create indexes for performance
CREATE INDEX idx_prompts_created_at ON prompts(created_at);
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
```

## 🔄 Development Workflow

### Local Development Setup
1. **Backend**: `cd backend && pip install -r requirements.txt`
2. **Frontend**: `cd frontend && npm install`
3. **Redis**: Docker container for caching
4. **Database**: PostgreSQL container (optional)

### Environment Variables
```bash
# Backend (.env)
NVIDIA_API_KEY=your_nvidia_api_key
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/promptforge
CORS_ORIGINS=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This structure provides a clean separation of concerns and follows best practices for both FastAPI and Next.js applications.