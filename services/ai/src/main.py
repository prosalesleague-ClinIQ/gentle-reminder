"""
Gentle Reminder AI Services - FastAPI Application

Provides endpoints for speech transcription, emotion detection,
cognitive analysis, story summarization, and decline prediction
for dementia care.
"""

import logging
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.transcription import TranscriptionService
from services.emotion_detection import EmotionDetector
from services.cognitive_analysis import CognitiveAnalyzer
from services.summarization import StorySummarizer
from services.batch_processor import BatchProcessor
from models.cognitive_state import CognitiveStateModel
from models.decline_predictor import DeclinePredictor

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("gentle-reminder.ai")

# ---------------------------------------------------------------------------
# Service singletons (initialized on startup)
# ---------------------------------------------------------------------------
transcription_service: Optional[TranscriptionService] = None
emotion_detector: Optional[EmotionDetector] = None
cognitive_analyzer: Optional[CognitiveAnalyzer] = None
story_summarizer: Optional[StorySummarizer] = None
cognitive_state_model: Optional[CognitiveStateModel] = None
decline_predictor: Optional[DeclinePredictor] = None
batch_processor: Optional[BatchProcessor] = None


def _batch_transcribe(audio_bytes: bytes, options: dict) -> dict:
    """Wrapper used by the batch processor to call the transcription service."""
    if transcription_service is None:
        raise RuntimeError("Transcription service not initialized")
    if options.get("timestamps"):
        return transcription_service.transcribe_with_timestamps(audio_bytes)
    return transcription_service.transcribe(audio_bytes)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and tear down services."""
    global transcription_service, emotion_detector, cognitive_analyzer
    global story_summarizer, cognitive_state_model, decline_predictor
    global batch_processor

    logger.info("Initializing AI services...")
    transcription_service = TranscriptionService()
    emotion_detector = EmotionDetector()
    cognitive_analyzer = CognitiveAnalyzer()
    story_summarizer = StorySummarizer()
    cognitive_state_model = CognitiveStateModel()
    decline_predictor = DeclinePredictor()
    batch_processor = BatchProcessor(
        transcription_fn=_batch_transcribe,
        concurrency=3,
    )
    logger.info("All AI services initialized.")

    yield

    logger.info("Shutting down AI services.")


app = FastAPI(
    title="Gentle Reminder AI Services",
    description="AI-powered speech, emotion, and cognitive analysis for dementia care",
    version="0.3.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19006",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------
class SpeechAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Transcript text to analyze")
    session_id: Optional[str] = None


class AudioFeaturesRequest(BaseModel):
    text: str = Field(..., min_length=1)
    speech_rate: Optional[float] = None
    pitch_variance: Optional[float] = None
    pause_durations: Optional[list[float]] = None


class EmotionDetectionRequest(BaseModel):
    text: str = Field(..., min_length=1)
    audio_features: Optional[dict] = None


class SummarizationRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Story text to summarize")
    max_sentences: int = Field(default=5, ge=1, le=20)


class SessionScore(BaseModel):
    session_id: str
    date: str
    score: float = Field(..., ge=0, le=100)
    domain: str = Field(default="general")


class DeclinePredictionRequest(BaseModel):
    patient_id: str
    session_scores: list[SessionScore]
    timeframe_days: int = Field(default=90, ge=7, le=365)


class CognitiveClassificationRequest(BaseModel):
    speech_rate: Optional[float] = None
    hesitation_count: Optional[int] = None
    pause_duration_ms: Optional[float] = None
    pitch_variance: Optional[float] = None
    repeated_questions: Optional[int] = None
    activity_level: Optional[float] = None
    routine_adherence: Optional[float] = None
    social_interaction: Optional[float] = None
    wandering_flag: Optional[bool] = None


class BatchTranscribeRequest(BaseModel):
    timestamps: bool = Field(default=False, description="Include word-level timestamps")


# ---------------------------------------------------------------------------
# Middleware - Request timing
# ---------------------------------------------------------------------------
@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start) * 1000
    logger.info(
        "%s %s -> %d (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers and orchestration."""
    cache_stats = None
    if transcription_service is not None and transcription_service.cache is not None:
        cache_stats = transcription_service.cache.stats()

    return {
        "status": "healthy",
        "service": "gentle-reminder-ai",
        "version": "0.3.0",
        "services": {
            "transcription": transcription_service is not None,
            "emotion_detection": emotion_detector is not None,
            "cognitive_analysis": cognitive_analyzer is not None,
            "summarization": story_summarizer is not None,
            "cognitive_state": cognitive_state_model is not None,
            "decline_predictor": decline_predictor is not None,
            "batch_processor": batch_processor is not None,
        },
        "transcription_cache": cache_stats,
    }


@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    timestamps: bool = Query(False, description="Include word-level timestamps"),
):
    """
    Transcribe audio to text with hesitation marker detection.

    Accepts audio file uploads (WAV, MP3, M4A, AAC, OGG, WebM) and returns
    the transcription along with detected speech biomarkers.

    Use ?timestamps=true to include word-level timing information.
    """
    if transcription_service is None:
        raise HTTPException(status_code=503, detail="Transcription service not ready")

    try:
        audio_bytes = await audio.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        if timestamps:
            result = transcription_service.transcribe_with_timestamps(audio_bytes)
        else:
            result = transcription_service.transcribe(audio_bytes)

        response = {
            "text": result["text"],
            "confidence": result["confidence"],
            "hesitation_markers": result["hesitation_markers"],
            "duration_seconds": result.get("duration_seconds"),
        }
        if timestamps and "words" in result:
            response["words"] = result["words"]

        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Transcription failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Transcription failed")


@app.post("/transcribe/batch")
async def submit_batch_transcription(
    audio: UploadFile = File(...),
    timestamps: bool = Query(False, description="Include word-level timestamps"),
):
    """
    Submit an audio file for asynchronous batch transcription.

    Returns a job_id that can be polled via GET /transcribe/batch/{job_id}.
    """
    if batch_processor is None:
        raise HTTPException(status_code=503, detail="Batch processor not ready")

    try:
        audio_bytes = await audio.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        job_id = await batch_processor.submit_job(
            audio_bytes, {"timestamps": timestamps}
        )
        return {
            "job_id": job_id,
            "state": "pending",
            "message": "Job submitted. Poll GET /transcribe/batch/{job_id} for status.",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Batch submission failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Batch submission failed")


@app.get("/transcribe/batch/{job_id}")
async def get_batch_job_status(job_id: str):
    """
    Get the status and result of a batch transcription job.
    """
    if batch_processor is None:
        raise HTTPException(status_code=503, detail="Batch processor not ready")

    status = batch_processor.get_job_status(job_id)
    if status["state"] == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")

    return status


@app.post("/analyze-speech")
async def analyze_speech(request: SpeechAnalysisRequest):
    """
    Extract speech biomarkers from transcript text.

    Analyzes hesitation patterns, speech rate indicators,
    and question repetition for cognitive assessment.
    """
    if transcription_service is None:
        raise HTTPException(status_code=503, detail="Service not ready")

    try:
        hesitations = transcription_service.detect_hesitations(request.text)
        return {
            "text": request.text,
            "hesitation_markers": hesitations,
            "hesitation_count": len(hesitations),
            "session_id": request.session_id,
        }
    except Exception as e:
        logger.error("Speech analysis failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Speech analysis failed")


@app.post("/detect-emotion")
async def detect_emotion(request: EmotionDetectionRequest):
    """
    Detect emotional tone from text and optional audio features.

    Returns a classified emotion with confidence score and
    contributing indicators.
    """
    if emotion_detector is None:
        raise HTTPException(status_code=503, detail="Emotion detector not ready")

    try:
        result = emotion_detector.detect_emotion(
            request.text, request.audio_features
        )
        return {
            "emotion": result["emotion"],
            "confidence": result["confidence"],
            "scores": result["scores"],
            "indicators": result["indicators"],
        }
    except Exception as e:
        logger.error("Emotion detection failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Emotion detection failed")


@app.post("/summarize-story")
async def summarize_story(request: SummarizationRequest):
    """
    Summarize a patient's story or conversation, extracting
    key people, places, events, and emotional tone.
    """
    if story_summarizer is None:
        raise HTTPException(status_code=503, detail="Summarizer not ready")

    try:
        result = story_summarizer.summarize(
            request.text, max_sentences=request.max_sentences
        )
        return {
            "summary": result["summary"],
            "key_people": result["key_people"],
            "key_places": result["key_places"],
            "key_events": result["key_events"],
            "emotional_tone": result["emotional_tone"],
            "word_count": result["word_count"],
        }
    except Exception as e:
        logger.error("Summarization failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Summarization failed")


@app.post("/predict-decline")
async def predict_decline(request: DeclinePredictionRequest):
    """
    Predict cognitive decline risk based on session score trends.

    Analyzes longitudinal session data to identify concerning
    patterns and predict near-term cognitive trajectory.
    """
    if cognitive_analyzer is None or decline_predictor is None:
        raise HTTPException(status_code=503, detail="Analysis services not ready")

    try:
        scores_data = [s.model_dump() for s in request.session_scores]

        trend_result = cognitive_analyzer.analyze_trends(
            scores_data, request.timeframe_days
        )
        risk_prediction = decline_predictor.predict(
            trend_result.get("feature_vector", [])
        )

        return {
            "patient_id": request.patient_id,
            "trend": trend_result,
            "risk_prediction": risk_prediction,
            "timeframe_days": request.timeframe_days,
        }
    except Exception as e:
        logger.error("Decline prediction failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Decline prediction failed")


@app.post("/classify-state")
async def classify_cognitive_state(request: CognitiveClassificationRequest):
    """
    Classify the patient's current cognitive state from
    speech and behavior features.
    """
    if cognitive_state_model is None:
        raise HTTPException(status_code=503, detail="State model not ready")

    try:
        speech_features = None
        if any(
            v is not None
            for v in [
                request.speech_rate,
                request.hesitation_count,
                request.pitch_variance,
            ]
        ):
            speech_features = {
                "speech_rate": request.speech_rate or 0,
                "hesitation_count": request.hesitation_count or 0,
                "pause_duration_ms": request.pause_duration_ms or 0,
                "pitch_variance": request.pitch_variance or 0,
                "repeated_questions": request.repeated_questions or 0,
            }

        behavior_features = None
        if any(
            v is not None
            for v in [
                request.activity_level,
                request.routine_adherence,
                request.wandering_flag,
            ]
        ):
            behavior_features = {
                "activity_level": request.activity_level or 0,
                "routine_adherence": request.routine_adherence or 0,
                "social_interaction": request.social_interaction or 0,
                "wandering_flag": request.wandering_flag or False,
            }

        result = cognitive_state_model.classify(speech_features, behavior_features)
        return result
    except Exception as e:
        logger.error("State classification failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Classification failed")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
