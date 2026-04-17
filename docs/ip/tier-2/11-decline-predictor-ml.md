# Provisional Patent Application: 8-Feature Cognitive Decline Predictor

**Docket No.:** GR-11-PROV | **Tier:** 2

## 1. TITLE
Eight-Feature Cognitive Decline Prediction Pipeline with Interpretable Fallback Model

## 4. FIELD
Machine learning prediction of cognitive decline from session performance time series.

## 5. BACKGROUND
Machine learning prediction of dementia progression from digital data is active research (Biogen BioPrint, academic work). Prior art generally relies on large feature vectors (hundreds of features) that are not interpretable.

## 6. SUMMARY
An 8-dimensional feature vector — mean_score, latest_score, slope_per_day, std_dev, coefficient_of_variation, session_frequency, score_range, recent_trend — feeds a ML model with a threshold-based interpretable fallback when ML is unavailable. Includes an explainability component identifying top contributing factors.

## 8. DETAILED DESCRIPTION

### 8.1 Feature Vector
```python
FEATURE_NAMES = [
    "mean_score",              # average session score over history
    "latest_score",            # most recent session score
    "slope_per_day",           # daily trend (regression slope)
    "std_dev",                 # score variability
    "coefficient_of_variation",
    "session_frequency",       # sessions per 30 days
    "score_range",             # max - min
    "recent_trend",            # slope over last 3 sessions
]
```

### 8.2 Interpretable Fallback Model
```python
def _predict_threshold(features):
    risk_score = 0.0
    if features[0] < 0.5: risk_score += 0.3       # low mean score
    if features[1] < features[0] - 0.1: risk_score += 0.25  # decline from mean
    if features[2] < -0.002: risk_score += 0.2    # negative slope
    if features[4] > 0.3: risk_score += 0.15      # high variability
    if features[7] < -0.005: risk_score += 0.1    # negative recent trend
    return min(risk_score, 1.0)
```

### 8.3 Contributing Factor Identification
```python
def _identify_contributing_factors(features, prediction):
    contributions = []
    if features[2] < -0.002:
        contributions.append(("declining_trend", abs(features[2])))
    if features[1] < features[0] - 0.1:
        contributions.append(("recent_drop", features[0] - features[1]))
    if features[4] > 0.3:
        contributions.append(("high_variability", features[4]))
    return sorted(contributions, key=lambda x: x[1], reverse=True)
```

### 8.4 Reference Implementation
`services/ai/src/models/decline_predictor.py`

## 9. CLAIMS

**Claim 1:** A method for predicting cognitive decline in a patient, comprising:
(a) receiving a time series of session scores;
(b) extracting a feature vector comprising exactly: mean score, latest score, slope per day, standard deviation, coefficient of variation, session frequency per 30 days, score range, and recent trend over last 3 sessions;
(c) passing the feature vector to a trained machine learning model, or falling back to a threshold-based interpretable model when the machine learning model is unavailable;
(d) producing a decline risk prediction in [0, 1]; and
(e) identifying contributing factors by computing the contribution of each feature to the prediction.

**Claims 2-5:** Dependent, system, CRM claims.

## 10. ABSTRACT

An 8-feature cognitive decline prediction pipeline extracts mean score, latest score, slope per day, standard deviation, coefficient of variation, session frequency per 30 days, score range, and recent trend from a session time series. Features are input to a trained ML model or an interpretable threshold-based fallback. The system identifies contributing factors explaining the prediction, supporting clinical decision-making and FDA SaMD algorithm transparency requirements.

Codebase: `services/ai/src/models/decline_predictor.py`
