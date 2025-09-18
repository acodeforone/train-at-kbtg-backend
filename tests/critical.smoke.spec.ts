import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * @fileoverview Smoke Tests for KBTG Flask Backend
 * Critical functionality tests for production readiness
 * @tags @smoke
 */

test.describe('Smoke Tests - Critical Functionality', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: 'http://localhost:5000',
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('Server is running and healthy @smoke', async () => {
    const response = await request.get('/health');
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('Hello World endpoint is accessible @smoke', async () => {
    const response = await request.get('/v1/helloworld');
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.message).toBe('Hello, world.');
  });

  test('User registration works @smoke', async () => {
    const timestamp = Date.now();
    const user = {
      firstname: 'Smoke',
      lastname: 'Test',
      username: `smoke_${timestamp}`,
      password: 'smoketest123'
    };

    const response = await request.post('/v1/register', {
      data: user
    });
    
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.message).toBe('User registered successfully');
    expect(data.user.username).toBe(user.username);
  });

  test('User login and session management works @smoke', async () => {
    const timestamp = Date.now();
    const user = {
      firstname: 'Login',
      lastname: 'Test',
      username: `login_${timestamp}`,
      password: 'logintest123'
    };

    // Register user
    await request.post('/v1/register', { data: user });

    // Login user
    const loginResponse = await request.post('/v1/login', {
      data: {
        username: user.username,
        password: user.password
      }
    });
    
    expect(loginResponse.status()).toBe(200);
    expect(loginResponse.ok()).toBeTruthy();
    
    const sessionId = loginResponse.headers()['sessionid'];
    expect(sessionId).toBeTruthy();

    // Validate session
    const validateResponse = await request.get('/v1/validate-session', {
      headers: { 'sessionid': sessionId }
    });
    
    expect(validateResponse.status()).toBe(200);
    expect(validateResponse.ok()).toBeTruthy();
  });

  test('API documentation is accessible @smoke', async () => {
    // Test Swagger UI
    const swaggerResponse = await request.get('/swagger/');
    expect(swaggerResponse.status()).toBe(200);
    expect(swaggerResponse.ok()).toBeTruthy();

    // Test OpenAPI spec
    const specResponse = await request.get('/apispec_1.json');
    expect(specResponse.status()).toBe(200);
    expect(specResponse.ok()).toBeTruthy();
    
    const spec = await specResponse.json();
    expect(spec).toHaveProperty('openapi');
    expect(spec).toHaveProperty('info');
  });

  test('Error handling works correctly @smoke', async () => {
    // Test 404 for non-existent endpoint
    const notFoundResponse = await request.get('/nonexistent');
    expect(notFoundResponse.status()).toBe(404);

    // Test validation error
    const validationResponse = await request.post('/v1/register', {
      data: { firstname: 'Test' } // Missing required fields
    });
    expect(validationResponse.status()).toBe(400);
    
    const data = await validationResponse.json();
    expect(data).toHaveProperty('error');
  });

  test('Response times are reasonable @smoke', async () => {
    const startTime = Date.now();
    
    const response = await request.get('/v1/helloworld');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // Response should be under 2 seconds
  });

  test('Content-Type headers are correct @smoke', async () => {
    const jsonEndpoints = [
      '/v1/helloworld',
      '/health',
      '/apispec_1.json'
    ];

    for (const endpoint of jsonEndpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    }

    // Test HTML endpoint
    const htmlResponse = await request.get('/swagger/');
    expect(htmlResponse.status()).toBe(200);
    expect(htmlResponse.headers()['content-type']).toContain('text/html');
  });
});
