import {
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  fontSize,
  fontWeight,
  lineHeight,
  enforceFontFloor,
} from '../src/theme/typography';

describe('Typography System', () => {
  describe('font size constraints', () => {
    it('should enforce minimum font size of 24pt', () => {
      expect(MIN_FONT_SIZE).toBe(24);
    });

    it('should have max font size of 48pt', () => {
      expect(MAX_FONT_SIZE).toBe(48);
    });

    it('should have all font sizes >= MIN_FONT_SIZE', () => {
      for (const [name, size] of Object.entries(fontSize)) {
        expect(size).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
      }
    });

    it('should have all font sizes <= MAX_FONT_SIZE', () => {
      for (const [name, size] of Object.entries(fontSize)) {
        expect(size).toBeLessThanOrEqual(MAX_FONT_SIZE);
      }
    });

    it('should have ascending size hierarchy', () => {
      expect(fontSize.body).toBeLessThanOrEqual(fontSize.bodyLarge);
      expect(fontSize.bodyLarge).toBeLessThanOrEqual(fontSize.subheading);
      expect(fontSize.subheading).toBeLessThanOrEqual(fontSize.h3);
      expect(fontSize.h3).toBeLessThanOrEqual(fontSize.h2);
      expect(fontSize.h2).toBeLessThanOrEqual(fontSize.h1);
      expect(fontSize.h1).toBeLessThanOrEqual(fontSize.display);
    });
  });

  describe('enforceFontFloor', () => {
    it('should return MIN_FONT_SIZE when requested size is smaller', () => {
      expect(enforceFontFloor(12)).toBe(MIN_FONT_SIZE);
      expect(enforceFontFloor(16)).toBe(MIN_FONT_SIZE);
      expect(enforceFontFloor(20)).toBe(MIN_FONT_SIZE);
    });

    it('should return requested size when >= MIN_FONT_SIZE', () => {
      expect(enforceFontFloor(24)).toBe(24);
      expect(enforceFontFloor(30)).toBe(30);
      expect(enforceFontFloor(48)).toBe(48);
    });

    it('should return MIN_FONT_SIZE for zero', () => {
      expect(enforceFontFloor(0)).toBe(MIN_FONT_SIZE);
    });

    it('should return MIN_FONT_SIZE for negative values', () => {
      expect(enforceFontFloor(-10)).toBe(MIN_FONT_SIZE);
    });
  });

  describe('font weights', () => {
    it('should have standard weight values', () => {
      expect(fontWeight.regular).toBe('400');
      expect(fontWeight.medium).toBe('500');
      expect(fontWeight.semibold).toBe('600');
      expect(fontWeight.bold).toBe('700');
    });
  });

  describe('line heights', () => {
    it('should have ascending line heights', () => {
      expect(lineHeight.tight).toBeLessThan(lineHeight.normal);
      expect(lineHeight.normal).toBeLessThan(lineHeight.relaxed);
      expect(lineHeight.relaxed).toBeLessThan(lineHeight.loose);
    });
  });
});
