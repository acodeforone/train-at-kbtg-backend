import unittest
import json
import os
from app import app, db
from models import UserTbl, Session
from auth_utils import AuthUtils

class TestHelloWorldAPI(unittest.TestCase):
    
    def setUp(self):
        """Set up test client and test database"""
        # Set testing configuration
        os.environ['FLASK_ENV'] = 'testing'
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        # Create tables
        db.create_all()

    def tearDown(self):
        """Clean up after tests"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

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

    def test_register_endpoint_success(self):
        """Test successful user registration"""
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'title': 'Mr.',
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        response = self.app.post('/v1/register',
                                data=json.dumps(user_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'User registered successfully')
        self.assertEqual(data['user']['firstname'], 'John')
        self.assertEqual(data['user']['username'], 'johndoe')
        self.assertNotIn('passwordhash', data['user'])  # Should not include password hash

    def test_register_endpoint_duplicate_username(self):
        """Test registration with duplicate username"""
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        # First registration
        self.app.post('/v1/register',
                     data=json.dumps(user_data),
                     content_type='application/json')
        
        # Second registration with same username
        response = self.app.post('/v1/register',
                                data=json.dumps(user_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 409)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['error'], 'Registration failed')

    def test_register_endpoint_missing_fields(self):
        """Test registration with missing required fields"""
        user_data = {
            'firstname': 'John',
            # Missing lastname, username, password
        }
        
        response = self.app.post('/v1/register',
                                data=json.dumps(user_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['error'], 'Validation failed')
        self.assertIn('details', data)

    def test_login_endpoint_success(self):
        """Test successful login"""
        # First register a user
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        self.app.post('/v1/register',
                     data=json.dumps(user_data),
                     content_type='application/json')
        
        # Then login
        login_data = {
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        response = self.app.post('/v1/login',
                                data=json.dumps(login_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'Login successful')
        self.assertIn('user', data)
        self.assertIn('sessionid', response.headers)

    def test_login_endpoint_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        
        response = self.app.post('/v1/login',
                                data=json.dumps(login_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 401)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['error'], 'Authentication failed')

    def test_login_endpoint_missing_credentials(self):
        """Test login with missing credentials"""
        login_data = {
            'username': 'johndoe'
            # Missing password
        }
        
        response = self.app.post('/v1/login',
                                data=json.dumps(login_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['error'], 'Missing credentials')

    def test_validate_session_endpoint(self):
        """Test session validation"""
        # Register and login a user
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        self.app.post('/v1/register',
                     data=json.dumps(user_data),
                     content_type='application/json')
        
        login_data = {
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        login_response = self.app.post('/v1/login',
                                     data=json.dumps(login_data),
                                     content_type='application/json')
        
        session_id = login_response.headers.get('sessionid')
        
        # Validate session
        response = self.app.get('/v1/validate-session',
                               headers={'sessionid': session_id})
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'Session is valid')

    def test_logout_endpoint(self):
        """Test logout functionality"""
        # Register and login a user
        user_data = {
            'firstname': 'John',
            'lastname': 'Doe',
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        self.app.post('/v1/register',
                     data=json.dumps(user_data),
                     content_type='application/json')
        
        login_data = {
            'username': 'johndoe',
            'password': 'securepassword123'
        }
        
        login_response = self.app.post('/v1/login',
                                     data=json.dumps(login_data),
                                     content_type='application/json')
        
        session_id = login_response.headers.get('sessionid')
        
        # Logout
        response = self.app.post('/v1/logout',
                               headers={'sessionid': session_id})
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode())
        self.assertEqual(data['message'], 'Logout successful')

    def test_nonexistent_endpoint(self):
        """Test accessing a non-existent endpoint"""
        response = self.app.get('/v1/nonexistent')
        
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
