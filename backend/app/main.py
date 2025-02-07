from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api

app = FastAPI(
    title="Spelling Checker API",
    description="API สำหรับตรวจสอบการแปลคำศัพท์ภาษาอังกฤษเป็นภาษาไทย",
    version="1.0.0"
)

# CORS Settings
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:5173",  # Vite development server
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    api.router,
    prefix="/api/v1",
    tags=["dictionary"]
)

@app.get("/")
async def root():
    """Root endpoint to check if API is running"""
    return {
        "message": "Welcome to Spelling Checker API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Enable auto-reload during development
    )