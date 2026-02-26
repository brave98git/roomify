import { describe, it, expect } from 'vitest';
import routes from './routes';

describe('app/routes.ts', () => {
  it('should export an array of routes', () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have 2 routes', () => {
    expect(routes).toHaveLength(2);
  });

  it('should have an index route as the first route', () => {
    const indexRoute = routes[0];
    expect(indexRoute).toBeDefined();
    expect(indexRoute.index).toBe(true);
  });

  it('should have index route pointing to home.tsx', () => {
    const indexRoute = routes[0];
    expect(indexRoute.file).toBe('routes/home.tsx');
  });

  it('should have a visualizer route as the second route', () => {
    const visualizerRoute = routes[1];
    expect(visualizerRoute).toBeDefined();
    expect(visualizerRoute.path).toBe('visualizer/:id');
  });

  it('should have visualizer route pointing to visualizer.$id.tsx', () => {
    const visualizerRoute = routes[1];
    expect(visualizerRoute.file).toBe('./routes/visualizer.$id.tsx');
  });

  it('should have visualizer route with dynamic id parameter', () => {
    const visualizerRoute = routes[1];
    expect(visualizerRoute.path).toContain(':id');
  });

  it('should satisfy RouteConfig type', () => {
    routes.forEach((route) => {
      expect(route).toHaveProperty('file');
      if ('index' in route) {
        expect(typeof route.index).toBe('boolean');
      }
      if ('path' in route) {
        expect(typeof route.path).toBe('string');
      }
    });
  });

  it('should have unique route paths', () => {
    const paths = routes.map((r) => ('path' in r ? r.path : '/'));
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it('should not have trailing slashes in paths', () => {
    routes.forEach((route) => {
      if ('path' in route && route.path) {
        expect(route.path.endsWith('/')).toBe(false);
      }
    });
  });
});