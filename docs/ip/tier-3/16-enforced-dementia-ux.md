# Provisional Patent Application: Hard-Enforced Dementia-Safe UX Framework

**Docket No.:** GR-16-PROV | **Tier:** 3

## 1. TITLE
Component-Level Enforcement of Accessibility Constraints for Dementia-Specific User Interfaces

## 4. FIELD
User interface accessibility frameworks for elderly and cognitively impaired users.

## 5. BACKGROUND
WCAG AAA provides accessibility guidelines but as recommendations, not enforced constraints. Dementia-specific UX requires stronger guarantees.

## 6. SUMMARY
A UI component library enforcing:
- Font size floor of 24pt at Text primitive level (cannot be overridden)
- Button minimum 80×80px enforced at Button primitive level
- Maximum 3 choices per screen validated at component level
- WCAG AAA contrast (7:1) hard-coded into theme palette
- Voice-first navigation with numbered option selection

## 8. DETAILED DESCRIPTION

### 8.1 Font Floor Enforcement
```typescript
const MIN_FONT_SIZE = 24  // pt
function enforceFontFloor(requestedSize: number): number {
  return Math.max(requestedSize, MIN_FONT_SIZE)
}

// Text primitive:
<Text size={14}> // Rendered at 24pt, not 14
```

### 8.2 Button Minimum Enforcement
```typescript
const MIN_BUTTON_SIZE = 80  // px
// Button primitive hardcodes:
style: { minHeight: MIN_BUTTON_SIZE, minWidth: MIN_BUTTON_SIZE }
```

### 8.3 Cognitive Load Ceiling
```typescript
const MAX_CHOICES_PER_SCREEN = 3
// Component validates:
if (options.length > MAX_CHOICES_PER_SCREEN) {
  throw new Error('Max 3 choices per screen')
}
```

### 8.4 Reference Implementation
`packages/ui-components/src/primitives/`, `packages/ui-components/src/theme/`

## 9. CLAIMS

**Claim 1:** A user interface component library comprising:
(a) a text primitive component that architecturally enforces a minimum font size of 24 points, wherein smaller requested sizes are automatically coerced to the minimum;
(b) a button primitive component that architecturally enforces minimum touch target dimensions of 80 by 80 pixels;
(c) a choice container component that architecturally enforces a maximum of 3 options per screen;
(d) a theme palette guaranteeing WCAG AAA contrast ratio of at least 7:1 between text and background colors; and
(e) a voice navigation module providing numbered option selection for all interactive components.

**Claims 2-5:** Dependent, system, CRM.

## 10. ABSTRACT

A user interface component library for dementia-specific applications architecturally enforces accessibility constraints at the component level (not merely as design guidelines): minimum font size of 24 points in the Text primitive, minimum touch target of 80×80 pixels in the Button primitive, maximum of 3 choices per screen in choice containers, WCAG AAA contrast ratio of 7:1 in the theme palette, and voice-first navigation with numbered option selection. Constraints cannot be overridden by application developers.

Codebase: `packages/ui-components/src/`
