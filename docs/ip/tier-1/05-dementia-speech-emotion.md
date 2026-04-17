# Provisional Patent Application: Dementia-Specific Speech Emotion Detection System

**Docket No.:** GR-05-PROV
**Filing Priority Tier:** 1
**Applicant:** [Gentle Reminder, Inc.]
**Inventors:** [TBD]

## 1. TITLE
Dementia-Adapted Speech Emotion Detection Combining Keyword Dictionaries and Audio Feature Thresholds

## 2-3. CROSS-REFERENCE / FEDERAL
Not applicable.

## 4. FIELD
Speech-based emotion detection for elderly patients with neurodegenerative conditions, combining lexical analysis and acoustic feature extraction.

## 5. BACKGROUND

### 5.1 Problem
General-purpose speech emotion detectors (Beyond Verbal, IBM Watson Tone Analyzer, Affectiva) are trained on healthy adult speech corpora and miss dementia-specific emotional indicators. Dementia patients exhibit unique linguistic markers (confusion phrases, repetitive questioning, temporal disorientation) and acoustic markers (slowed speech, increased pause duration, altered pitch) that require specialized detection.

### 5.2 Prior Art
- US 10,152,988 (Beyond Verbal) — Voice emotion
- US 10,672,396 (Sonde Health) — Voice biomarkers for mental health
- US 8,219,438 (Affectiva) — Multimodal emotion
- IBM Watson Tone Analyzer API
- General sentiment libraries (VADER, TextBlob)

### 5.3 Limitations
No prior art combines dementia-specific keyword dictionaries with elderly-tuned acoustic thresholds. Existing systems miss confused-state linguistic markers ("where am I", "I don't understand", "forgot") and misclassify slow elderly speech as sadness when it reflects normal aging.

## 6. BRIEF SUMMARY

The invention is a speech emotion detection system classifying input into 6 states (calm, anxious, confused, sad, agitated, engaged) using a fusion of: (1) dementia-specific keyword dictionaries; (2) acoustic feature thresholds tuned for elderly speech (speech rate, pitch variance, pause duration); (3) sentiment adjustment layer. Threshold calibration is specific to elderly dementia populations.

## 7. DRAWINGS
- **FIG. 1** — Dual-layer keyword + acoustic fusion architecture
- **FIG. 2** — Emotion score computation flowchart
- **FIG. 3** — Audio feature threshold map

## 8. DETAILED DESCRIPTION

### 8.1 Six Emotion States
CALM, ANXIOUS, CONFUSED, SAD, AGITATED, ENGAGED

### 8.2 Dementia-Specific Keyword Dictionaries
```python
EMOTION_KEYWORDS = {
  "confused": ["don't understand", "what", "where am i", "forgot", "can't remember",
               "who are you", "why am i here"],
  "anxious": ["worried", "scared", "lost", "can't find", "help me", "afraid"],
  "sad": ["miss", "alone", "empty", "tired", "why bother", "gone"],
  "agitated": ["leave me alone", "stop", "no", "don't want", "angry"],
  "engaged": ["yes", "tell me more", "good", "love", "remember when"],
  "calm": ["okay", "fine", "thank you", "nice", "pleasant"],
}
```

### 8.3 Audio Feature Thresholds (Dementia-Tuned)

| Feature | Normal Range | Concerning Trigger | Emotion Adjustment |
|---------|:------------:|:------------------:|:------------------|
| Speech rate | 100-170 wpm | > 170 wpm | +0.3 anxiety |
| Speech rate | 100-170 wpm | < 80 wpm | +0.3 sadness |
| Pitch variance | 10-50 Hz | > 50 Hz | +0.2 anxiety, +0.15 agitation |
| Pause duration | 300-1200 ms | > 1200 ms | +0.25 confusion, +0.15 sadness |

### 8.4 Emotion Computation
```python
def detect_emotion(transcript, audio_features):
    # Base keyword score
    scores = {emotion: 0.0 for emotion in EMOTION_KEYWORDS}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        for kw in keywords:
            if kw in transcript.lower():
                scores[emotion] += 1.0 / len(keywords)

    # Apply acoustic adjustments
    scores = apply_audio_features(scores, audio_features)

    # Sentiment adjustment layer
    sentiment = compute_sentiment(transcript)
    scores = adjust_for_sentiment(scores, sentiment)

    # Normalize and select
    top = argmax(scores)
    confidence = scores[top]
    return (top, confidence, get_audio_indicators(audio_features))
```

### 8.5 Reference Implementation
`services/ai/src/services/emotion_detection.py`
Function: `EmotionDetector.detect_emotion()`

## 9. CLAIMS

**Claim 1:** A method for detecting an emotional state of a patient from speech input, comprising:
(a) receiving a transcript of speech and associated acoustic features;
(b) maintaining a plurality of emotion keyword dictionaries, each corresponding to one of a plurality of emotion states, and each keyword dictionary comprising phrases specific to dementia populations;
(c) computing a base emotion score for each emotion state based on keyword occurrences in the transcript;
(d) applying acoustic feature adjustments to the base emotion scores, wherein the adjustments comprise:
  - increasing anxiety score by at least 0.3 when speech rate exceeds 170 words per minute;
  - increasing sadness score by at least 0.3 when speech rate is below 80 words per minute;
  - increasing anxiety and agitation scores when pitch variance exceeds 50 Hz;
  - increasing confusion and sadness scores when pause duration exceeds 1200 milliseconds;
(e) applying a sentiment adjustment based on overall polarity of the transcript;
(f) selecting the emotion state with the highest adjusted score as the detected emotion; and
(g) outputting the detected emotion, a confidence score, and a set of audio indicators that triggered the classification.

**Claim 2:** The method of Claim 1, wherein the plurality of emotion states comprises: calm, anxious, confused, sad, agitated, and engaged.

**Claim 3:** The method of Claim 1, wherein a "confused" keyword dictionary comprises phrases including "don't understand," "where am I," "forgot," and "can't remember."

**Claim 4:** The method of Claim 1, wherein the patient has been diagnosed with a neurodegenerative condition.

**Claim 5:** The method of Claim 1, further comprising triggering a downstream companion response appropriate to the detected emotion.

**Claim 6:** A system comprising one or more processors configured to perform the method of Claim 1.

**Claim 7:** A non-transitory computer-readable medium with instructions to perform the method of Claim 1.

**Claim 8:** The method of Claim 1, wherein the acoustic features are extracted from audio using an audio preprocessing pipeline that resamples to 16 kHz mono 16-bit PCM.

## 10. ABSTRACT

A speech emotion detection method for dementia patients classifies input into six emotion states (calm, anxious, confused, sad, agitated, engaged) by combining dementia-specific keyword dictionaries with acoustic feature thresholds calibrated for elderly speech. Keyword dictionaries include dementia-indicative phrases such as "don't understand," "where am I," and "forgot." Acoustic adjustments trigger on: speech rate above 170 wpm (anxiety); speech rate below 80 wpm (sadness); pitch variance above 50 Hz (anxiety and agitation); pause duration above 1200 ms (confusion and sadness). The method outputs the detected emotion, a confidence score, and audio indicators explaining the classification, enabling downstream therapeutic responses.

## REFERENCES
- US 10,152,988 (Beyond Verbal)
- US 10,672,396 (Sonde Health)
- US 8,219,438 (Affectiva)

Codebase: `services/ai/src/services/emotion_detection.py`

## APPLICANT NOTES
**Commercial value:** Core AI differentiator; licensable to voice-AI platforms serving elderly.
**Valuation:** $2M-$4M
**Conversion priority:** HIGH
