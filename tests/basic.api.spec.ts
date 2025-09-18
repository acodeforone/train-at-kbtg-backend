import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * @fileoverview API Tests for KBTG Flask Backend
 * Tests basic API functionality without authentication
 * @tags @api @smoke
 */

test.describe('Basic API Tests', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: 'http://localhost:5000',
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('GET /v1/helloworld should return hello world message @api @smoke', async () => {
    const response = await request.get('/v1/helloworld');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Hello, world.');
  });

  test('GET /health should return healthy status @api @smoke', async () => {
    const response = await request.get('/health');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('healthy');
  });

  test('GET /swagger/ should return Swagger UI @api', async () => {
    const response = await request.get('/swagger/');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('GET /apispec_1.json should return OpenAPI spec @api', async () => {
    const response = await request.get('/apispec_1.json');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    
    const spec = await response.json();
    expect(spec).toHaveProperty('openapi');
    expect(spec).toHaveProperty('info');
    expect(spec.info).toHaveProperty('title');
  });

  test('GET /api/docs should redirect to Swagger UI @api', async () => {
    const response = await request.get('/api/docs', {
      maxRedirects: 0
    });
    
    expect(response.status()).toBe(302);
    expect(response.headers()['location']).toBe('/swagger/');
  });

  test('GET /nonexistent should return 404 @api', async () => {
    const response = await request.get('/nonexistent');
    
    expect(response.status()).toBe(404);
  });

  test('POST /v1/helloworld should return 405 Method Not Allowed @api', async () => {
    const response = await request.post('/v1/helloworld');
    
    expect(response.status()).toBe(405);
  });
});
