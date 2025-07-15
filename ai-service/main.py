import asyncio
import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import os

from services.federated_learning import FederatedLearningService
from services.code_analysis import CodeAnalysisService
from services.pattern_extraction import PatternExtractionService
from services.model_training import ModelTrainingService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ZenithCode AI Service",
    description="AI-powered code analysis and federated learning service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
federated_service = FederatedLearningService()
code_analysis_service = CodeAnalysisService()
pattern_service = PatternExtractionService()
model_training_service = ModelTrainingService()

# Pydantic models
class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    context: str = ""

class PatternExtractionRequest(BaseModel):
    code: str
    language: str
    domain: str = "general"

class TrainingRequest(BaseModel):
    model_type: str
    parameters: dict
    dataset_id: str

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Starting ZenithCode AI Service...")
    
    # Initialize federated learning
    await federated_service.initialize()
    
    # Initialize code analysis
    await code_analysis_service.initialize()
    
    # Initialize pattern extraction
    await pattern_service.initialize()
    
    logger.info("✅ AI Service initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down AI Service...")
    await federated_service.cleanup()
    await code_analysis_service.cleanup()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ZenithCode AI Service",
        "status": "running",
        "version": "1.0.0",
        "features": [
            "Federated Learning",
            "Code Analysis",
            "Pattern Extraction",
            "Model Training"
        ]
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "federated_learning": federated_service.is_healthy(),
            "code_analysis": code_analysis_service.is_healthy(),
            "pattern_extraction": pattern_service.is_healthy(),
            "model_training": model_training_service.is_healthy()
        }
    }

@app.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    """Analyze code and provide suggestions"""
    try:
        analysis = await code_analysis_service.analyze(
            code=request.code,
            language=request.language,
            context=request.context
        )
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"Code analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-patterns")
async def extract_patterns(request: PatternExtractionRequest):
    """Extract patterns from code"""
    try:
        patterns = await pattern_service.extract_patterns(
            code=request.code,
            language=request.language,
            domain=request.domain
        )
        return {
            "success": True,
            "patterns": patterns
        }
    except Exception as e:
        logger.error(f"Pattern extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train-model")
async def train_model(request: TrainingRequest, background_tasks: BackgroundTasks):
    """Start model training in background"""
    try:
        job_id = await model_training_service.start_training(
            model_type=request.model_type,
            parameters=request.parameters,
            dataset_id=request.dataset_id
        )
        
        # Add background task for training
        background_tasks.add_task(
            model_training_service.run_training,
            job_id
        )
        
        return {
            "success": True,
            "job_id": job_id,
            "status": "started"
        }
    except Exception as e:
        logger.error(f"Model training error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/training-status/{job_id}")
async def get_training_status(job_id: str):
    """Get training job status"""
    try:
        status = await model_training_service.get_status(job_id)
        return {
            "success": True,
            "job_id": job_id,
            "status": status
        }
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/federated/join")
async def join_federated_learning():
    """Join federated learning network"""
    try:
        client_id = await federated_service.join_network()
        return {
            "success": True,
            "client_id": client_id,
            "message": "Successfully joined federated learning network"
        }
    except Exception as e:
        logger.error(f"Federated learning join error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/federated/contribute")
async def contribute_to_federated_learning():
    """Contribute local model to federated learning"""
    try:
        contribution = await federated_service.contribute_model()
        return {
            "success": True,
            "contribution": contribution
        }
    except Exception as e:
        logger.error(f"Federated learning contribution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/insights")
async def get_insights():
    """Get AI insights and trends"""
    try:
        insights = await code_analysis_service.get_insights()
        return {
            "success": True,
            "insights": insights
        }
    except Exception as e:
        logger.error(f"Insights error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8080))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 