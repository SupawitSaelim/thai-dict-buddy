from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import sys

app = FastAPI(
    title="Spelling Checker API",
    description="API สำหรับตรวจสอบการแปลคำศัพท์ภาษาอังกฤษเป็นภาษาไทย",
    version="1.0.0"
)

# Get the absolute path for static files
if getattr(sys, 'frozen', False):
    # If the application is run as a bundle (PyInstaller)
    base_path = sys._MEIPASS
else:
    # If the application is run from a Python interpreter
    base_path = os.path.dirname(os.path.abspath(__file__))

# Mount static files
static_folder = os.path.join(base_path, "static")
if os.path.exists(static_folder):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_folder, "assets")), name="assets")

# CORS Settings
origins = [
    "http://localhost:*",       # รองรับทุก port บน localhost
    "http://127.0.0.1:*",      # รองรับทุก port บน 127.0.0.1
    "http://0.0.0.0:*"         # รองรับทุก port บน 0.0.0.0
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(
    api.router,
    prefix="/api/v1",
    tags=["dictionary"]
)

# Serve React app's index.html for all non-API routes
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(os.path.join(static_folder, "index.html"))

@app.get("/")
async def root():
    """Serve the React application"""
    return FileResponse(os.path.join(static_folder, "index.html"))

# Start the application
if __name__ == "__main__":
    import uvicorn
    import logging
    
    # สร้าง custom logger
    logger = logging.getLogger("startup")
    logger.setLevel(logging.INFO)

    # สร้าง handler และ formatter
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(message)s')  # แสดงแค่ message อย่างเดียว
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # แสดงข้อความ startup ก่อนรัน server
    logger.info("=" * 60)
    logger.info("🚀 Application is starting up...")
    logger.info("📝 You can access the application through:")
    logger.info("   • Local:            http://localhost:8000")
    logger.info("   • On Your Network:  http://127.0.0.1:8000")
    logger.info("=" * 60)

    # รัน server ตามปกติ
    if getattr(sys, 'frozen', False):
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False
        )
    else:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True
        )