import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * @fileoverview Authentication Tests for KBTG Flask Backend
 * Tests user registration, login, session management, and logout
 * @tags @auth
 */

test.describe('Authentication Flow Tests', () => {
  let request: APIRequestContext;
  let testUser = {
    firstname: 'Test',
    lastname: 'User',
    title: 'Mr.',
    username: `testuser_${Date.now()}`,
    password: 'testpassword123'
  };
  let sessionId: string;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: 'http://localhost:5000',
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test.describe.serial('Complete Authentication Flow', () => {
    
    test('POST /v1/register should create a new user @auth', async () => {
      const response = await request.post('/v1/register', {
        data: testUser
      });
      
      expect(response.status()).toBe(201);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const data = await response.json();
      expect(data).toHaveProperty('message', 'User registered successfully');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('firstname', testUser.firstname);
      expect(data.user).toHaveProperty('lastname', testUser.lastname);
      expect(data.user).toHaveProperty('title', testUser.title);
      expect(data.user).toHaveProperty('username', testUser.username);
      expect(data.user).toHaveProperty('created_at');
      expect(data.user).toHaveProperty('updated_at');
      expect(data.user).not.toHaveProperty('passwordhash');
    });

    test('POST /v1/register with duplicate username should fail @auth', async () => {
      const response = await request.post('/v1/register', {
        data: testUser
      });
      
      expect(response.status()).toBe(409);
      
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Registration failed');
    });

    test('POST /v1/login should authenticate user and return session @auth', async () => {
      const response = await request.post('/v1/login', {
        data: {
          username: testUser.username,
          password: testUser.password
        }
      });
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      // Check session header
      sessionId = response.headers()['sessionid'];
      expect(sessionId).toBeTruthy();
      expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      
      const data = await response.json();
      expect(data).toHaveProperty('message', 'Login successful');
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('redirect_url');
      expect(data.user).toHaveProperty('username', testUser.username);
    });

    test('GET /v1/validate-session should validate active session @auth', async () => {
      expect(sessionId).toBeTruthy();
      
      const response = await request.get('/v1/validate-session', {
        headers: {
          'sessionid': sessionId
        }
      });
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const data = await response.json();
      expect(data).toHaveProperty('message', 'Session is valid');
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('session_id', sessionId);
      expect(data.user).toHaveProperty('username', testUser.username);
    });

    test('POST /v1/logout should invalidate session @auth', async () => {
      expect(sessionId).toBeTruthy();
      
      const response = await request.post('/v1/logout', {
        headers: {
          'sessionid': sessionId
        }
      });
      
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
      
      const data = await response.json();
      expect(data).toHaveProperty('message', 'Logout successful');
    });

    test('GET /v1/validate-session should fail after logout @auth', async () => {
      const response = await request.get('/v1/validate-session', {
        headers: {
          'sessionid': sessionId
        }
      });
      
      expect(response.status()).toBe(401);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Invalid session');
    });
  });

  test.describe('Authentication Error Cases', () => {
    
    test('POST /v1/register with missing fields should fail @auth', async () => {
      const response = await request.post('/v1/register', {
        data: {
          firstname: 'Test'
          // Missing required fields
        }
      });
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Validation failed');
      expect(data).toHaveProperty('details');
      expect(Array.isArray(data.details)).toBe(true);
    });

    test('POST /v1/login with invalid credentials should fail @auth', async () => {
      const response = await request.post('/v1/login', {
        data: {
          username: 'nonexistentuser',
          password: 'wrongpassword'
        }
      });
      
      expect(response.status()).toBe(401);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Authentication failed');
    });

    test('POST /v1/login with missing credentials should fail @auth', async () => {
      const response = await request.post('/v1/login', {
        data: {
          username: 'testuser'
          // Missing password
        }
      });
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Missing credentials');
    });

    test('GET /v1/validate-session without sessionid should fail @auth', async () => {
      const response = await request.get('/v1/validate-session');
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'No session found');
    });

    test('GET /v1/validate-session with invalid sessionid should fail @auth', async () => {
      const response = await request.get('/v1/validate-session', {
        headers: {
          'sessionid': 'invalid-session-id'
        }
      });
      
      expect(response.status()).toBe(401);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Invalid session');
    });

    test('POST /v1/logout without sessionid should fail @auth', async () => {
      const response = await request.post('/v1/logout');
      
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('error', 'No session found');
    });
  });
});
