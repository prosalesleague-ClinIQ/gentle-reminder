"""
Decline Predictor Model

Predicts cognitive decline risk from feature vectors built by the
CognitiveAnalyzer. Scaffolded for PyTorch/sklearn model loading
with a threshold-based fallback for development.
"""

import logging
import os
from typing import Any, Optional

logger = logging.getLogger("gentle-reminder.ai.models.decline_predictor")

# Risk level thresholds
RISK_LEVELS = {
    "low": (0.0, 0.3),
    "moderate": (0.3, 0.6),
    "high": (0.6, 0.8),
    "critical": (0.8, 1.0),
}

# Feature names matching the CognitiveAnalyzer output
FEATURE_NAMES = [
    "mean_score",
    "latest_score",
    "slope_per_day",
    "std_dev",
    "coefficient_of_variation",
    "session_frequency",
    "score_range",
    "recent_trend",
]

# Weights for the threshold-based fallback model
# These approximate what a trained model might learn
FEATURE_WEIGHTS = {
    "mean_score": -0.008,        # Lower mean -> higher risk
    "latest_score": -0.006,       # Lower latest -> higher risk
    "slope_per_day": -15.0,       # Negative slope -> higher risk
    "std_dev": 0.012,             # Higher variability -> higher risk
    "coefficient_of_variation": 0.005,  # Higher CV -> higher risk
    "session_frequency": -0.02,   # Less frequent sessions -> higher risk
    "score_range": 0.008,         # Wider range -> higher risk
    "recent_trend": -8.0,         # Negative recent trend -> higher risk
}

# Baseline risk centered at 0.3
BASELINE_RISK = 0.3


class DeclinePredictor:
    """
    Predicts cognitive decline risk from longitudinal session features.

    Supports loading trained models (PyTorch or sklearn) via config.
    Falls back to interpretable threshold-based scoring when no
    model is available.
    """

    def __init__(self):
        self.model = None
        self.model_type: Optional[str] = None
        self._try_load_model()
        logger.info(
            "DeclinePredictor initialized (model: %s)",
            self.model_type or "threshold_fallback",
        )

    def predict(self, feature_vector: list[float]) -> dict[str, Any]:
        """
        Predict decline risk from a feature vector.

        Args:
            feature_vector: List of 8 floats from CognitiveAnalyzer

        Returns:
            dict with risk_score, risk_level, contributing_factors,
            feature_importance, and recommendation
        """
        if not feature_vector:
            return self._no_data_result()

        if len(feature_vector) != len(FEATURE_NAMES):
            logger.warning(
                "Feature vector length mismatch: expected %d, got %d",
                len(FEATURE_NAMES),
                len(feature_vector),
            )
            return self._no_data_result()

        # Use trained model if available, otherwise threshold fallback
        if self.model is not None:
            risk_score = self._predict_with_model(feature_vector)
        else:
            risk_score = self._predict_threshold(feature_vector)

        risk_score = max(0.0, min(1.0, risk_score))
        risk_level = self._classify_risk(risk_score)
        contributing_factors = self._identify_contributing_factors(feature_vector)
        feature_importance = self._compute_feature_importance(feature_vector)
        recommendation = self._generate_recommendation(risk_level, contributing_factors)

        return {
            "risk_score": round(risk_score, 3),
            "risk_level": risk_level,
            "contributing_factors": contributing_factors,
            "feature_importance": feature_importance,
            "recommendation": recommendation,
            "model_type": self.model_type or "threshold_fallback",
        }

    def _predict_threshold(self, feature_vector: list[float]) -> float:
        """
        Threshold-based risk prediction.

        Applies interpretable weights to each feature and sums
        the contributions around a baseline risk level.
        """
        risk = BASELINE_RISK

        features = dict(zip(FEATURE_NAMES, feature_vector))

        for name, value in features.items():
            weight = FEATURE_WEIGHTS.get(name, 0.0)
            risk += value * weight

        return risk

    def _predict_with_model(self, feature_vector: list[float]) -> float:
        """
        Predict using a loaded ML model.

        Scaffold: Supports both PyTorch and sklearn models.
        """
        try:
            if self.model_type == "pytorch":
                # import torch
                # tensor = torch.tensor([feature_vector], dtype=torch.float32)
                # with torch.no_grad():
                #     output = self.model(tensor)
                # return output.item()
                raise NotImplementedError("PyTorch inference pending")

            elif self.model_type == "sklearn":
                # prediction = self.model.predict_proba([feature_vector])
                # return prediction[0][1]  # Probability of decline class
                raise NotImplementedError("sklearn inference pending")

            else:
                return self._predict_threshold(feature_vector)

        except Exception as e:
            logger.warning("Model prediction failed, using fallback: %s", str(e))
            return self._predict_threshold(feature_vector)

    def _try_load_model(self) -> None:
        """
        Attempt to load a trained model from the configured path.

        Checks for PyTorch (.pt) and sklearn (.pkl) model files.
        """
        model_path = os.getenv("DECLINE_MODEL_PATH", "")

        if not model_path or not os.path.exists(model_path):
            logger.info("No trained model found, using threshold fallback")
            return

        try:
            if model_path.endswith(".pt"):
                # import torch
                # self.model = torch.jit.load(model_path)
                # self.model.eval()
                # self.model_type = "pytorch"
                logger.info("PyTorch model loading scaffolded: %s", model_path)

            elif model_path.endswith(".pkl"):
                # import pickle
                # with open(model_path, "rb") as f:
                #     self.model = pickle.load(f)
                # self.model_type = "sklearn"
                logger.info("sklearn model loading scaffolded: %s", model_path)

        except Exception as e:
            logger.error("Failed to load model from %s: %s", model_path, str(e))
            self.model = None
            self.model_type = None

    def _classify_risk(self, score: float) -> str:
        """Classify a risk score into a named level."""
        for level, (low, high) in RISK_LEVELS.items():
            if low <= score < high:
                return level
        return "critical" if score >= 0.8 else "low"

    def _identify_contributing_factors(
        self, feature_vector: list[float]
    ) -> list[dict[str, Any]]:
        """
        Identify which features are contributing most to the risk score.

        Returns factors sorted by absolute contribution.
        """
        factors: list[dict[str, Any]] = []
        features = dict(zip(FEATURE_NAMES, feature_vector))

        for name, value in features.items():
            weight = FEATURE_WEIGHTS.get(name, 0.0)
            contribution = value * weight
            direction = "increasing" if contribution > 0 else "decreasing"

            # Only include factors with meaningful contribution
            if abs(contribution) > 0.02:
                factors.append({
                    "feature": name,
                    "value": round(value, 3),
                    "contribution": round(contribution, 3),
                    "direction": direction,
                    "description": self._describe_factor(name, value, contribution),
                })

        factors.sort(key=lambda f: abs(f["contribution"]), reverse=True)
        return factors[:5]

    def _compute_feature_importance(
        self, feature_vector: list[float]
    ) -> dict[str, float]:
        """
        Compute relative feature importance for this prediction.

        Returns normalized importance scores for each feature.
        """
        importances: dict[str, float] = {}
        features = dict(zip(FEATURE_NAMES, feature_vector))

        abs_contributions = {}
        for name, value in features.items():
            weight = FEATURE_WEIGHTS.get(name, 0.0)
            abs_contributions[name] = abs(value * weight)

        total = sum(abs_contributions.values())
        if total == 0:
            return {name: 0.0 for name in FEATURE_NAMES}

        for name, contribution in abs_contributions.items():
            importances[name] = round(contribution / total, 3)

        return importances

    def _describe_factor(
        self, feature: str, value: float, contribution: float
    ) -> str:
        """Generate a human-readable description of a contributing factor."""
        descriptions = {
            "mean_score": (
                f"Average session score of {value:.1f} is {'below' if contribution > 0 else 'above'} expected range"
            ),
            "latest_score": (
                f"Most recent score of {value:.1f} indicates {'declining' if contribution > 0 else 'stable'} performance"
            ),
            "slope_per_day": (
                f"Score trajectory of {value:.4f} points/day shows {'declining' if value < 0 else 'improving'} trend"
            ),
            "std_dev": (
                f"Score variability (SD: {value:.1f}) suggests {'inconsistent' if contribution > 0 else 'consistent'} performance"
            ),
            "coefficient_of_variation": (
                f"Variability coefficient of {value:.1f}% indicates {'high' if contribution > 0 else 'normal'} fluctuation"
            ),
            "session_frequency": (
                f"Session frequency of {value:.1f}/month is {'below' if contribution > 0 else 'at'} recommended levels"
            ),
            "score_range": (
                f"Score range of {value:.1f} points indicates {'wide' if contribution > 0 else 'narrow'} performance variation"
            ),
            "recent_trend": (
                f"Recent 3-session trend of {value:.2f} points shows {'decline' if value < 0 else 'improvement'}"
            ),
        }
        return descriptions.get(feature, f"{feature}: {value}")

    def _generate_recommendation(
        self,
        risk_level: str,
        factors: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Generate care recommendations based on risk assessment."""
        recommendations = {
            "low": {
                "action": "continue_monitoring",
                "urgency": "routine",
                "message": "Continue current care plan. Cognitive performance is stable.",
                "suggested_interval_days": 14,
            },
            "moderate": {
                "action": "increase_monitoring",
                "urgency": "attention",
                "message": "Consider increasing session frequency and review recent activities for contributing factors.",
                "suggested_interval_days": 7,
            },
            "high": {
                "action": "clinical_review",
                "urgency": "prompt",
                "message": "Schedule clinical review. Notable cognitive changes detected. Review medication and environmental factors.",
                "suggested_interval_days": 3,
            },
            "critical": {
                "action": "immediate_attention",
                "urgency": "urgent",
                "message": "Immediate clinical attention recommended. Significant cognitive decline detected. Consider comprehensive assessment.",
                "suggested_interval_days": 1,
            },
        }

        rec = recommendations.get(risk_level, recommendations["moderate"])

        # Add factor-specific suggestions
        factor_suggestions: list[str] = []
        for factor in factors[:3]:
            name = factor["feature"]
            if name == "session_frequency" and factor["direction"] == "increasing":
                factor_suggestions.append("Increase session engagement frequency")
            elif name == "std_dev" and factor["direction"] == "increasing":
                factor_suggestions.append("Investigate causes of performance variability")
            elif name == "slope_per_day" and factor["direction"] == "increasing":
                factor_suggestions.append("Monitor daily performance trajectory closely")

        rec["specific_suggestions"] = factor_suggestions
        return rec

    def _no_data_result(self) -> dict[str, Any]:
        return {
            "risk_score": 0.0,
            "risk_level": "insufficient_data",
            "contributing_factors": [],
            "feature_importance": {},
            "recommendation": {
                "action": "collect_data",
                "urgency": "routine",
                "message": "Insufficient data for prediction. Continue regular sessions to build baseline.",
                "suggested_interval_days": 7,
            },
            "model_type": "none",
        }
