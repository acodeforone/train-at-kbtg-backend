async function globalTeardown() {
  console.log('🧹 Global teardown started...');
  
  // Clean up test data if needed
  try {
    // You can add cleanup logic here
    // For example: clear test database, close connections, etc.
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
  
  console.log('🏁 Global teardown completed');
}

export default globalTeardown;
