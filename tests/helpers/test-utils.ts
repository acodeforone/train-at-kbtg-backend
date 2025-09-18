/**
 * Test Helper Utilities for Playwright Tests
 */

export interface TestUser {
  firstname: string;
  lastname: string;
  title?: string;
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

/**
 * Generate a unique test user
 */
export function generateTestUser(prefix: string = 'test'): TestUser {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
  return {
    firstname: 'Test',
    lastname: 'User',
    title: 'Mr.',
    username: `${prefix}_${timestamp}_${random}`,
    password: `password_${random}`
  };
}

/**
 * Generate multiple unique test users
 */
export function generateTestUsers(count: number, prefix: string = 'test'): TestUser[] {
  return Array.from({ length: count }, (_, i) => 
    generateTestUser(`${prefix}_${i}`)
  );
}

/**
 * Wait for a specific condition with timeout
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeoutMs: number = 10000,
  intervalMs: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error(`Condition not met within ${timeoutMs}ms`);
}

/**
 * Create a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Test data cleanup utility
 */
export class TestDataManager {
  private createdUsers: string[] = [];
  private createdSessions: string[] = [];

  addUser(username: string): void {
    this.createdUsers.push(username);
  }

  addSession(sessionId: string): void {
    this.createdSessions.push(sessionId);
  }

  getCreatedUsers(): string[] {
    return [...this.createdUsers];
  }

  getCreatedSessions(): string[] {
    return [...this.createdSessions];
  }

  clear(): void {
    this.createdUsers = [];
    this.createdSessions = [];
  }
}

/**
 * Common test assertions
 */
export class TestAssertions {
  static isValidUserObject(user: any): boolean {
    return (
      typeof user === 'object' &&
      user !== null &&
      typeof user.id === 'number' &&
      typeof user.firstname === 'string' &&
      typeof user.lastname === 'string' &&
      typeof user.username === 'string' &&
      typeof user.created_at === 'string' &&
      typeof user.updated_at === 'string' &&
      !user.hasOwnProperty('passwordhash')
    );
  }

  static isValidSessionResponse(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.message === 'string' &&
      typeof data.user === 'object' &&
      this.isValidUserObject(data.user)
    );
  }

  static isValidErrorResponse(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.error === 'string' &&
      typeof data.message === 'string'
    );
  }
}
