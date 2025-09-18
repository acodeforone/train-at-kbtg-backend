import unittest
import json
from app import app

class TestHelloWorldAPI(unittest.TestCase):
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True

    def test_hello_world_endpoint(self):
        """Test the /v1/helloworld GET endpoint"""
        response = self.app.get('/v1/helloworld')
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'Hello, world.')

    def test_health_check_endpoint(self):
        """Test the /health GET endpoint"""
        response = self.app.get('/health')
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['status'], 'healthy')

    def test_nonexistent_endpoint(self):
        """Test accessing a non-existent endpoint"""
        response = self.app.get('/v1/nonexistent')
        
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
