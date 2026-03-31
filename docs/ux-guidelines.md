# UX Guidelines for Dementia Patients

## Hard Constraints (Enforced by Components)

These are not suggestions. They are enforced at the component level.

| Rule | Value | Component |
|------|-------|-----------|
| Minimum font size | 24pt | `Text` primitive |
| Minimum button height | 80px | `Button` primitive |
| Minimum button width | 80px | `Button` primitive |
| Maximum choices per screen | 3 | `ExerciseCard` |
| Contrast ratio | 7:1 minimum (WCAG AAA) | Color palette |
| Negative feedback | NONE | `GentleFeedback` |

## Design Principles

### 1. Reduce Cognitive Load
- Maximum 3 options per screen
- One clear action per screen
- Linear progression (no branching choices)
- Persistent HOME button for safety

### 2. Warm and Supportive Tone
- Never use words: wrong, incorrect, failed, error, bad
- Always acknowledge effort
- Provide the correct answer warmly when needed
- Use first names and familiar language

### 3. Visual Clarity
- High contrast (dark text on light backgrounds)
- Large, clear icons
- Generous whitespace
- No decorative elements that could confuse

### 4. Touch Accessibility
- All interactive elements minimum 80x80px
- Generous spacing between touch targets
- Haptic feedback on button press
- No swipe gestures (tap only)

### 5. Voice Guidance
- All sessions are voice-guided
- Text-to-speech reads prompts aloud
- Slow, clear speech rate (0.85x)
- Pause between prompts

### 6. Session Safety
- Sessions limited to 5-7 minutes
- Fatigue detection via response time monitoring
- HOME button always available
- Confirmation before abandoning session

## Color Palette

- Primary: Warm blue (#1A7BC4) - calming, trustworthy
- Secondary: Sage green (#3D8158) - nature, peace
- Accent: Amber (#E5A300) - gentle energy
- Background: White/warm white
- No red for errors (uses blue for "supported" state)

## Feedback States

| State | Color | Icon | Message Tone |
|-------|-------|------|-------------|
| Celebrated | Green | Checkmark | "That's exactly right!" |
| Guided | Amber | Gentle arrow | "You're very close!" |
| Supported | Blue | Heart | "That's okay, the answer is..." |
