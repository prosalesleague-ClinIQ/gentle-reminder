import { colors } from '../src/theme/colors';

describe('Color Palette', () => {
  describe('WCAG AAA compliance', () => {
    // Helper: approximate relative luminance from hex
    function hexToRGB(hex: string): { r: number; g: number; b: number } {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 0, b: 0 };
    }

    function relativeLuminance(hex: string): number {
      const { r, g, b } = hexToRGB(hex);
      const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
      );
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function contrastRatio(hex1: string, hex2: string): number {
      const l1 = relativeLuminance(hex1);
      const l2 = relativeLuminance(hex2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    it('should have primary text with 7:1+ contrast against white background', () => {
      const ratio = contrastRatio(colors.text.primary, colors.background.primary);
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('should have secondary text with adequate contrast against white', () => {
      const ratio = contrastRatio(colors.text.secondary, colors.background.primary);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('palette structure', () => {
    it('should have primary color scale from 50-900', () => {
      expect(colors.primary[50]).toBeTruthy();
      expect(colors.primary[500]).toBeTruthy();
      expect(colors.primary[900]).toBeTruthy();
    });

    it('should have no red feedback colors (dementia-safe)', () => {
      // Feedback colors should not use aggressive red
      const feedbackColors = Object.values(colors.feedback);
      for (const color of feedbackColors) {
        // Check that feedback colors aren't pure red (#FF0000 or similar)
        expect(color.toLowerCase()).not.toMatch(/^#ff[0-4]/);
      }
    });

    it('should have three feedback states: celebrated, guided, supported', () => {
      expect(colors.feedback.celebrated).toBeTruthy();
      expect(colors.feedback.guided).toBeTruthy();
      expect(colors.feedback.supported).toBeTruthy();
    });
  });
});
