import { test as setup, expect } from '@playwright/test';

async function globalSetup() {
  console.log('🚀 Global setup started...');
  
  // Wait for the server to be ready
  const maxRetries = 30;
  const retryDelay = 1000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        console.log('✅ Flask server is ready');
        break;
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error('❌ Flask server failed to start within timeout');
      }
      console.log(`⏳ Waiting for server... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  console.log('🎯 Global setup completed');
}

export default globalSetup;
