"""
Cognitive Analysis Service

Analyzes longitudinal session data to detect cognitive trends
and identify early warning signs of decline.
"""

import logging
import statistics
from datetime import datetime, timedelta
from typing import Any

logger = logging.getLogger("gentle-reminder.ai.cognitive_analysis")


class CognitiveAnalyzer:
    """Analyzes cognitive performance trends from session data."""

    def __init__(self):
        self.min_sessions_for_trend = 3
        self.significant_decline_threshold = -5.0  # Points per month
        self.significant_improvement_threshold = 3.0
        logger.info("CognitiveAnalyzer initialized")

    def analyze_trends(
        self,
        session_scores: list[dict[str, Any]],
        timeframe_days: int = 90,
    ) -> dict[str, Any]:
        """
        Analyze cognitive performance trends over a time period.

        Args:
            session_scores: List of dicts with keys: session_id, date, score, domain
            timeframe_days: Number of days to analyze

        Returns:
            dict with trend analysis, statistics, and feature vector
        """
        if not session_scores:
            return self._empty_trend_result()

        # Filter to timeframe
        cutoff = datetime.now() - timedelta(days=timeframe_days)
        filtered = []
        for s in session_scores:
            try:
                date = datetime.fromisoformat(s["date"])
                if date >= cutoff:
                    filtered.append({**s, "_parsed_date": date})
            except (ValueError, KeyError):
                logger.warning(
                    "Skipping invalid session record: %s", s.get("session_id")
                )

        if len(filtered) < self.min_sessions_for_trend:
            return self._insufficient_data_result(len(filtered))

        # Sort by date
        filtered.sort(key=lambda x: x["_parsed_date"])
        scores = [s["score"] for s in filtered]
        dates = [s["_parsed_date"] for s in filtered]

        # Basic statistics
        mean_score = statistics.mean(scores)
        std_dev = statistics.stdev(scores) if len(scores) > 1 else 0.0
        median_score = statistics.median(scores)

        # Trend calculation using linear regression
        slope = self._calculate_slope(dates, scores)
        monthly_change = slope * 30  # Convert daily slope to monthly

        # Determine trend direction
        trend = self._classify_trend(monthly_change)

        # Variability analysis
        variability = self._analyze_variability(scores)

        # Domain-specific breakdown
        domain_trends = self._analyze_by_domain(filtered)

        # Build feature vector for decline predictor
        feature_vector = self._build_feature_vector(
            scores, slope, std_dev, variability, len(filtered), timeframe_days
        )

        return {
            "trend": trend,
            "monthly_change": round(monthly_change, 2),
            "slope_per_day": round(slope, 4),
            "mean_score": round(mean_score, 2),
            "median_score": round(median_score, 2),
            "std_dev": round(std_dev, 2),
            "variability": variability,
            "session_count": len(filtered),
            "timeframe_days": timeframe_days,
            "domain_trends": domain_trends,
            "latest_score": scores[-1],
            "earliest_score": scores[0],
            "feature_vector": feature_vector,
        }

    def _calculate_slope(
        self, dates: list[datetime], scores: list[float]
    ) -> float:
        """
        Simple linear regression to compute the daily slope of scores.
        Uses days since first session as the x-axis.
        """
        if len(dates) < 2:
            return 0.0

        origin = dates[0]
        x_vals = [(d - origin).total_seconds() / 86400 for d in dates]
        y_vals = scores

        n = len(x_vals)
        sum_x = sum(x_vals)
        sum_y = sum(y_vals)
        sum_xy = sum(x * y for x, y in zip(x_vals, y_vals))
        sum_x2 = sum(x * x for x in x_vals)

        denominator = n * sum_x2 - sum_x * sum_x
        if abs(denominator) < 1e-10:
            return 0.0

        return (n * sum_xy - sum_x * sum_y) / denominator

    def _classify_trend(self, monthly_change: float) -> str:
        """Classify the trend based on monthly score change."""
        if monthly_change <= self.significant_decline_threshold:
            return "significant_decline"
        elif monthly_change <= -2.0:
            return "mild_decline"
        elif monthly_change >= self.significant_improvement_threshold:
            return "improvement"
        elif monthly_change >= 1.0:
            return "mild_improvement"
        else:
            return "stable"

    def _analyze_variability(self, scores: list[float]) -> dict[str, Any]:
        """Analyze score variability -- high variability may indicate sundowning."""
        if len(scores) < 3:
            return {"level": "insufficient_data", "coefficient_of_variation": 0}

        mean = statistics.mean(scores)
        std = statistics.stdev(scores)
        cv = (std / mean * 100) if mean > 0 else 0

        # Day-to-day changes
        changes = [abs(scores[i] - scores[i - 1]) for i in range(1, len(scores))]
        avg_change = statistics.mean(changes) if changes else 0

        level = "low"
        if cv > 25:
            level = "high"
        elif cv > 15:
            level = "moderate"

        return {
            "level": level,
            "coefficient_of_variation": round(cv, 2),
            "average_session_change": round(avg_change, 2),
            "max_change": round(max(changes), 2) if changes else 0,
        }

    def _analyze_by_domain(
        self, sessions: list[dict[str, Any]]
    ) -> dict[str, Any]:
        """Break down trends by cognitive domain."""
        domains: dict[str, list[float]] = {}

        for s in sessions:
            domain = s.get("domain", "general")
            if domain not in domains:
                domains[domain] = []
            domains[domain].append(s["score"])

        result = {}
        for domain, scores in domains.items():
            result[domain] = {
                "mean": round(statistics.mean(scores), 2),
                "latest": scores[-1],
                "count": len(scores),
                "change": round(scores[-1] - scores[0], 2) if len(scores) > 1 else 0,
            }

        return result

    def _build_feature_vector(
        self,
        scores: list[float],
        slope: float,
        std_dev: float,
        variability: dict[str, Any],
        session_count: int,
        timeframe_days: int,
    ) -> list[float]:
        """
        Build a feature vector for the decline prediction model.

        Features:
        [0] mean_score
        [1] latest_score
        [2] slope_per_day
        [3] std_dev
        [4] coefficient_of_variation
        [5] session_frequency (sessions per 30 days)
        [6] score_range (max - min)
        [7] recent_trend (last 3 sessions slope)
        """
        mean_score = statistics.mean(scores)
        latest = scores[-1]
        cv = variability.get("coefficient_of_variation", 0)
        session_freq = (session_count / max(timeframe_days, 1)) * 30
        score_range = max(scores) - min(scores)

        # Recent trend from last 3 sessions
        if len(scores) >= 3:
            recent = scores[-3:]
            recent_slope = (recent[-1] - recent[0]) / 2.0
        else:
            recent_slope = 0.0

        return [
            round(mean_score, 3),
            round(latest, 3),
            round(slope, 6),
            round(std_dev, 3),
            round(cv, 3),
            round(session_freq, 3),
            round(score_range, 3),
            round(recent_slope, 3),
        ]

    def _empty_trend_result(self) -> dict[str, Any]:
        return {
            "trend": "no_data",
            "monthly_change": 0,
            "session_count": 0,
            "feature_vector": [],
        }

    def _insufficient_data_result(self, count: int) -> dict[str, Any]:
        return {
            "trend": "insufficient_data",
            "monthly_change": 0,
            "session_count": count,
            "message": f"Need at least {self.min_sessions_for_trend} sessions, got {count}",
            "feature_vector": [],
        }
