import { describe, it, expect } from 'vitest';
import {
  PUTER_WORKER_URL,
  STORAGE_PATHS,
  SHARE_STATUS_RESET_DELAY_MS,
  PROGRESS_INCREMENT,
  REDIRECT_DELAY_MS,
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  GRID_OVERLAY_SIZE,
  GRID_COLOR,
  UNAUTHORIZED_STATUSES,
  IMAGE_RENDER_DIMENSION,
  ROOMIFY_RENDER_PROMPT,
} from './constant';

describe('lib/constant.ts', () => {
  describe('PUTER_WORKER_URL', () => {
    it('should be a string', () => {
      expect(typeof PUTER_WORKER_URL).toBe('string');
    });
  });

  describe('STORAGE_PATHS', () => {
    it('should have ROOT path', () => {
      expect(STORAGE_PATHS.ROOT).toBe('roomify');
    });

    it('should have SOURCES path', () => {
      expect(STORAGE_PATHS.SOURCES).toBe('roomify/sources');
    });

    it('should have RENDERS path', () => {
      expect(STORAGE_PATHS.RENDERS).toBe('roomify/renders');
    });

    it('should be an object with const assertion', () => {
      expect(typeof STORAGE_PATHS).toBe('object');
      expect(STORAGE_PATHS).not.toBeNull();
    });
  });

  describe('Timing Constants', () => {
    it('should have SHARE_STATUS_RESET_DELAY_MS set to 1500', () => {
      expect(SHARE_STATUS_RESET_DELAY_MS).toBe(1500);
    });

    it('should have PROGRESS_INCREMENT set to 15', () => {
      expect(PROGRESS_INCREMENT).toBe(15);
    });

    it('should have REDIRECT_DELAY_MS set to 600', () => {
      expect(REDIRECT_DELAY_MS).toBe(600);
    });

    it('should have PROGRESS_INTERVAL_MS set to 100', () => {
      expect(PROGRESS_INTERVAL_MS).toBe(100);
    });

    it('should have PROGRESS_STEP set to 5', () => {
      expect(PROGRESS_STEP).toBe(5);
    });

    it('should have positive timing values', () => {
      expect(SHARE_STATUS_RESET_DELAY_MS).toBeGreaterThan(0);
      expect(PROGRESS_INCREMENT).toBeGreaterThan(0);
      expect(REDIRECT_DELAY_MS).toBeGreaterThan(0);
      expect(PROGRESS_INTERVAL_MS).toBeGreaterThan(0);
      expect(PROGRESS_STEP).toBeGreaterThan(0);
    });
  });

  describe('UI Constants', () => {
    it('should have GRID_OVERLAY_SIZE set to "60px 60px"', () => {
      expect(GRID_OVERLAY_SIZE).toBe('60px 60px');
    });

    it('should have GRID_COLOR set to "#3B82F6"', () => {
      expect(GRID_COLOR).toBe('#3B82F6');
    });

    it('should have valid CSS color format', () => {
      expect(GRID_COLOR).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('HTTP Status Codes', () => {
    it('should include 401 status code', () => {
      expect(UNAUTHORIZED_STATUSES).toContain(401);
    });

    it('should include 403 status code', () => {
      expect(UNAUTHORIZED_STATUSES).toContain(403);
    });

    it('should have exactly 2 status codes', () => {
      expect(UNAUTHORIZED_STATUSES).toHaveLength(2);
    });

    it('should be an array', () => {
      expect(Array.isArray(UNAUTHORIZED_STATUSES)).toBe(true);
    });
  });

  describe('Image Dimensions', () => {
    it('should have IMAGE_RENDER_DIMENSION set to 1024', () => {
      expect(IMAGE_RENDER_DIMENSION).toBe(1024);
    });

    it('should be a power of 2', () => {
      const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;
      expect(isPowerOfTwo(IMAGE_RENDER_DIMENSION)).toBe(true);
    });
  });

  describe('ROOMIFY_RENDER_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(typeof ROOMIFY_RENDER_PROMPT).toBe('string');
      expect(ROOMIFY_RENDER_PROMPT.length).toBeGreaterThan(0);
    });

    it('should contain key instructions about task', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('TASK');
      expect(ROOMIFY_RENDER_PROMPT).toContain('floor plan');
    });

    it('should contain strict requirements section', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('STRICT REQUIREMENTS');
    });

    it('should mention removing text', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('REMOVE ALL TEXT');
    });

    it('should mention geometry matching', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('GEOMETRY MUST MATCH');
    });

    it('should mention top-down view', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('TOP');
    });

    it('should include structure details section', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('STRUCTURE');
    });

    it('should include furniture mapping section', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('FURNITURE');
    });

    it('should include style and lighting section', () => {
      expect(ROOMIFY_RENDER_PROMPT).toContain('STYLE');
      expect(ROOMIFY_RENDER_PROMPT).toContain('LIGHTING');
    });
  });

  describe('Constant relationships', () => {
    it('should have PROGRESS_INCREMENT that fits within 100% (multiple steps)', () => {
      const maxSteps = Math.ceil(100 / PROGRESS_INCREMENT);
      expect(maxSteps).toBeGreaterThan(1);
      expect(maxSteps).toBeLessThanOrEqual(10);
    });

    it('should have REDIRECT_DELAY_MS less than SHARE_STATUS_RESET_DELAY_MS', () => {
      expect(REDIRECT_DELAY_MS).toBeLessThan(SHARE_STATUS_RESET_DELAY_MS);
    });
  });
});