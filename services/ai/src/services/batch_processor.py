"""
Batch Processor

Async job queue for processing multiple transcription requests
concurrently with configurable parallelism.
"""

import asyncio
import logging
import uuid
from enum import Enum
from typing import Any, Optional

logger = logging.getLogger("gentle-reminder.ai.batch-processor")


class JobState(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class BatchProcessor:
    """Async batch transcription processor with job queue."""

    def __init__(
        self,
        transcription_fn,
        concurrency: int = 3,
    ) -> None:
        """
        Parameters
        ----------
        transcription_fn : callable
            A callable(audio_bytes, options) -> dict that performs
            the actual transcription. May be sync or async.
        concurrency : int
            Maximum number of concurrent transcription jobs.
        """
        self._transcription_fn = transcription_fn
        self._concurrency = concurrency
        self._queue: asyncio.Queue = asyncio.Queue()
        self._jobs: dict[str, dict[str, Any]] = {}
        self._processing_task: Optional[asyncio.Task] = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def submit_job(
        self,
        audio_bytes: bytes,
        options: Optional[dict[str, Any]] = None,
    ) -> str:
        """
        Submit a transcription job to the queue.

        Returns a job_id that can be used to poll status.
        """
        job_id = str(uuid.uuid4())
        self._jobs[job_id] = {
            "job_id": job_id,
            "state": JobState.PENDING,
            "result": None,
            "error": None,
            "options": options or {},
        }
        await self._queue.put((job_id, audio_bytes, options or {}))

        logger.info("Job %s submitted (queue size: %d)", job_id, self._queue.qsize())

        # Ensure the background processor is running
        self._ensure_processor()

        return job_id

    def get_job_status(self, job_id: str) -> dict[str, Any]:
        """
        Get the current status of a job.

        Returns a dict with job_id, state, result (if completed),
        and error (if failed).
        """
        job = self._jobs.get(job_id)
        if job is None:
            return {
                "job_id": job_id,
                "state": "not_found",
                "result": None,
                "error": "Job not found",
            }
        return {
            "job_id": job["job_id"],
            "state": job["state"].value if isinstance(job["state"], JobState) else job["state"],
            "result": job["result"],
            "error": job["error"],
        }

    async def process_queue(self) -> None:
        """
        Process jobs from the queue with bounded concurrency.

        This runs as a long-lived background task.
        """
        semaphore = asyncio.Semaphore(self._concurrency)

        async def _worker(job_id: str, audio_bytes: bytes, options: dict):
            async with semaphore:
                self._jobs[job_id]["state"] = JobState.PROCESSING
                logger.info("Processing job %s", job_id)
                try:
                    # Support both sync and async transcription functions
                    if asyncio.iscoroutinefunction(self._transcription_fn):
                        result = await self._transcription_fn(audio_bytes, options)
                    else:
                        loop = asyncio.get_event_loop()
                        result = await loop.run_in_executor(
                            None, self._transcription_fn, audio_bytes, options
                        )
                    self._jobs[job_id]["state"] = JobState.COMPLETED
                    self._jobs[job_id]["result"] = result
                    logger.info("Job %s completed", job_id)
                except Exception as e:
                    self._jobs[job_id]["state"] = JobState.FAILED
                    self._jobs[job_id]["error"] = str(e)
                    logger.error("Job %s failed: %s", job_id, e)

        tasks: list[asyncio.Task] = []
        while True:
            try:
                job_id, audio_bytes, options = await asyncio.wait_for(
                    self._queue.get(), timeout=1.0
                )
                task = asyncio.create_task(_worker(job_id, audio_bytes, options))
                tasks.append(task)
                # Clean up finished tasks
                tasks = [t for t in tasks if not t.done()]
            except asyncio.TimeoutError:
                # No items in queue; keep looping
                continue
            except asyncio.CancelledError:
                # Shutdown: wait for in-flight tasks
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
                break

    def queue_size(self) -> int:
        """Return the number of pending items in the queue."""
        return self._queue.qsize()

    def active_jobs(self) -> dict[str, int]:
        """Return counts of jobs by state."""
        counts: dict[str, int] = {s.value: 0 for s in JobState}
        for job in self._jobs.values():
            state = job["state"].value if isinstance(job["state"], JobState) else job["state"]
            counts[state] = counts.get(state, 0) + 1
        return counts

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _ensure_processor(self) -> None:
        """Start the background queue processor if not already running."""
        if self._processing_task is None or self._processing_task.done():
            try:
                loop = asyncio.get_event_loop()
                self._processing_task = loop.create_task(self.process_queue())
            except RuntimeError:
                # No running event loop; caller must start process_queue manually
                pass
