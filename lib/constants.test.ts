import { describe, it, expect } from 'vitest';
import * as constants from './constants';
import * as constant from './constant';

describe('lib/constants.ts', () => {
  it('should re-export all exports from constant.ts', () => {
    const constantKeys = Object.keys(constant);
    const constantsKeys = Object.keys(constants);

    expect(constantsKeys.length).toBe(constantKeys.length);
    constantKeys.forEach((key) => {
      expect(constantsKeys).toContain(key);
    });
  });

  it('should have the same STORAGE_PATHS as constant.ts', () => {
    expect(constants.STORAGE_PATHS).toEqual(constant.STORAGE_PATHS);
  });

  it('should have the same PROGRESS_INCREMENT as constant.ts', () => {
    expect(constants.PROGRESS_INCREMENT).toBe(constant.PROGRESS_INCREMENT);
  });

  it('should have the same REDIRECT_DELAY_MS as constant.ts', () => {
    expect(constants.REDIRECT_DELAY_MS).toBe(constant.REDIRECT_DELAY_MS);
  });

  it('should have the same PROGRESS_INTERVAL_MS as constant.ts', () => {
    expect(constants.PROGRESS_INTERVAL_MS).toBe(constant.PROGRESS_INTERVAL_MS);
  });

  it('should have the same UNAUTHORIZED_STATUSES as constant.ts', () => {
    expect(constants.UNAUTHORIZED_STATUSES).toEqual(constant.UNAUTHORIZED_STATUSES);
  });

  it('should have the same IMAGE_RENDER_DIMENSION as constant.ts', () => {
    expect(constants.IMAGE_RENDER_DIMENSION).toBe(constant.IMAGE_RENDER_DIMENSION);
  });

  it('should have the same ROOMIFY_RENDER_PROMPT as constant.ts', () => {
    expect(constants.ROOMIFY_RENDER_PROMPT).toBe(constant.ROOMIFY_RENDER_PROMPT);
  });
});