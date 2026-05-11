from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import enhance, health
from app.core.config import settings

app = FastAPI(
    title="PromptForge AI API",
    description="AI-powered prompt enhancement service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://promptfrontend-five.vercel.app/", "https://prompt-enhancer-8hdn.onrender.com"],  # Next.js frontend, Vercel frontend, and Render backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(enhance.router, prefix="/api/v1", tags=["enhancement"])
app.include_router(health.router, prefix="/api/v1", tags=["health"])

@app.get("/")
def root():
    return {"message": "PromptForge AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)