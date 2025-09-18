import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * @fileoverview Integration Tests for KBTG Flask Backend
 * Tests complete user workflows and cross-endpoint interactions
 * @tags @integration
 */

test.describe('User Workflow Integration Tests', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: 'http://localhost:5000',
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('Complete user lifecycle: register → login → validate → logout @integration', async () => {
    const timestamp = Date.now();
    const user = {
      firstname: 'Integration',
      lastname: 'Test',
      title: 'Ms.',
      username: `integration_user_${timestamp}`,
      password: 'integration123'
    };

    // Step 1: Register user
    const registerResponse = await request.post('/v1/register', {
      data: user
    });
    expect(registerResponse.status()).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData.user.username).toBe(user.username);

    // Step 2: Login user
    const loginResponse = await request.post('/v1/login', {
      data: {
        username: user.username,
        password: user.password
      }
    });
    expect(loginResponse.status()).toBe(200);
    const sessionId = loginResponse.headers()['sessionid'];
    expect(sessionId).toBeTruthy();

    // Step 3: Validate session multiple times
    for (let i = 0; i < 3; i++) {
      const validateResponse = await request.get('/v1/validate-session', {
        headers: { 'sessionid': sessionId }
      });
      expect(validateResponse.status()).toBe(200);
      const validateData = await validateResponse.json();
      expect(validateData.user.username).toBe(user.username);
    }

    // Step 4: Logout
    const logoutResponse = await request.post('/v1/logout', {
      headers: { 'sessionid': sessionId }
    });
    expect(logoutResponse.status()).toBe(200);

    // Step 5: Verify session is invalid after logout
    const validateAfterLogout = await request.get('/v1/validate-session', {
      headers: { 'sessionid': sessionId }
    });
    expect(validateAfterLogout.status()).toBe(401);
  });

  test('Multiple concurrent users workflow @integration', async () => {
    const timestamp = Date.now();
    const users = [
      {
        firstname: 'User',
        lastname: 'One',
        username: `user1_${timestamp}`,
        password: 'password123'
      },
      {
        firstname: 'User',
        lastname: 'Two',
        username: `user2_${timestamp}`,
        password: 'password456'
      },
      {
        firstname: 'User',
        lastname: 'Three',
        username: `user3_${timestamp}`,
        password: 'password789'
      }
    ];

    // Register all users concurrently
    const registrations = await Promise.all(
      users.map(user => request.post('/v1/register', { data: user }))
    );
    registrations.forEach(response => {
      expect(response.status()).toBe(201);
    });

    // Login all users concurrently
    const logins = await Promise.all(
      users.map(user => request.post('/v1/login', {
        data: { username: user.username, password: user.password }
      }))
    );

    const sessionIds = logins.map(response => {
      expect(response.status()).toBe(200);
      return response.headers()['sessionid'];
    });

    // Validate all sessions concurrently
    const validations = await Promise.all(
      sessionIds.map(sessionId => 
        request.get('/v1/validate-session', {
          headers: { 'sessionid': sessionId }
        })
      )
    );

    validations.forEach((response, index) => {
      expect(response.status()).toBe(200);
    });

    // Logout all users concurrently
    const logouts = await Promise.all(
      sessionIds.map(sessionId =>
        request.post('/v1/logout', {
          headers: { 'sessionid': sessionId }
        })
      )
    );

    logouts.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('API health check throughout user operations @integration', async () => {
    const timestamp = Date.now();
    const user = {
      firstname: 'Health',
      lastname: 'Check',
      username: `healthcheck_${timestamp}`,
      password: 'healthcheck123'
    };

    // Health check before operations
    let healthResponse = await request.get('/health');
    expect(healthResponse.status()).toBe(200);
    let healthData = await healthResponse.json();
    expect(healthData.status).toBe('healthy');

    // Register user
    await request.post('/v1/register', { data: user });

    // Health check after registration
    healthResponse = await request.get('/health');
    expect(healthResponse.status()).toBe(200);
    healthData = await healthResponse.json();
    expect(healthData.status).toBe('healthy');

    // Login user
    const loginResponse = await request.post('/v1/login', {
      data: { username: user.username, password: user.password }
    });
    const sessionId = loginResponse.headers()['sessionid'];

    // Health check after login
    healthResponse = await request.get('/health');
    expect(healthResponse.status()).toBe(200);
    healthData = await healthResponse.json();
    expect(healthData.status).toBe('healthy');

    // Logout user
    await request.post('/v1/logout', {
      headers: { 'sessionid': sessionId }
    });

    // Final health check
    healthResponse = await request.get('/health');
    expect(healthResponse.status()).toBe(200);
    healthData = await healthResponse.json();
    expect(healthData.status).toBe('healthy');
  });

  test('Error handling consistency across endpoints @integration', async () => {
    // Test consistent error format for invalid JSON
    const endpoints = ['/v1/register', '/v1/login'];
    
    for (const endpoint of endpoints) {
      const response = await request.post(endpoint, {
        data: 'invalid json',
        headers: { 'content-type': 'application/json' }
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
    }

    // Test consistent error format for missing session
    const sessionEndpoints = ['/v1/validate-session', '/v1/logout'];
    
    for (const endpoint of sessionEndpoints) {
      const method = endpoint === '/v1/validate-session' ? 'get' : 'post';
      const response = await request[method](endpoint);
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'No session found');
      expect(data).toHaveProperty('message');
    }
  });

  test('API documentation availability throughout operations @integration', async () => {
    // Test Swagger UI accessibility
    let swaggerResponse = await request.get('/swagger/');
    expect(swaggerResponse.status()).toBe(200);

    // Test OpenAPI spec accessibility
    let specResponse = await request.get('/apispec_1.json');
    expect(specResponse.status()).toBe(200);
    
    const spec = await specResponse.json();
    expect(spec).toHaveProperty('openapi');
    expect(spec.paths).toHaveProperty('/v1/helloworld');
    expect(spec.paths).toHaveProperty('/v1/register');
    expect(spec.paths).toHaveProperty('/v1/login');
    expect(spec.paths).toHaveProperty('/v1/validate-session');
    expect(spec.paths).toHaveProperty('/v1/logout');
    expect(spec.paths).toHaveProperty('/health');

    // Perform some operations and verify docs are still accessible
    const user = {
      firstname: 'Docs',
      lastname: 'Test',
      username: `docstest_${Date.now()}`,
      password: 'docstest123'
    };

    await request.post('/v1/register', { data: user });

    // Swagger UI should still be accessible
    swaggerResponse = await request.get('/swagger/');
    expect(swaggerResponse.status()).toBe(200);

    // OpenAPI spec should still be accessible
    specResponse = await request.get('/apispec_1.json');
    expect(specResponse.status()).toBe(200);
  });
});
