import os
import yaml
from flask import Flask, jsonify, request, redirect, make_response
from flasgger import Swagger, swag_from
from config import config
from models import db, UserTbl, Session
from auth_utils import AuthUtils, validate_registration_data

app = Flask(__name__)

# Load configuration
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['default']))

# Load Swagger configuration from YAML file
def load_swagger_config():
    with open('swagger.yaml', 'r') as file:
        return yaml.safe_load(file)

# Initialize Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/swagger/"
}

# Load the swagger template
swagger_template = load_swagger_config()
swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Initialize database
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/v1/helloworld', methods=['GET'])
def hello_world():
    """
    Returns a simple "Hello, world." message
    """
    return jsonify({"message": "Hello, world."})

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({"status": "healthy"})

@app.route('/api/docs', methods=['GET'])
def api_docs():
    """
    API Documentation endpoint - redirects to Swagger UI
    """
    return redirect('/swagger/')

@app.route('/v1/register', methods=['POST'])
def register():
    """
    Register a new user
    Expected JSON payload:
    {
        "firstname": "John",
        "lastname": "Doe",
        "title": "Mr.",  // Optional
        "username": "johndoe",
        "password": "securepassword"
    }
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Invalid JSON payload",
                "message": "Request must contain JSON data"
            }), 400
        
        # Validate input data
        validation_errors = validate_registration_data(data)
        if validation_errors:
            return jsonify({
                "error": "Validation failed",
                "details": validation_errors
            }), 400
        
        # Extract and clean data
        firstname = data.get('firstname').strip()
        lastname = data.get('lastname').strip()
        title = data.get('title', '').strip() or None  # Convert empty string to None
        username = data.get('username').strip().lower()  # Normalize username
        password = data.get('password')
        
        # Create user
        try:
            new_user = AuthUtils.create_user(
                firstname=firstname,
                lastname=lastname,
                title=title,
                username=username,
                password=password
            )
            
            return jsonify({
                "message": "User registered successfully",
                "user": new_user.to_dict()
            }), 201
            
        except ValueError as e:
            return jsonify({
                "error": "Registration failed",
                "message": str(e)
            }), 409  # Conflict
        
    except Exception as e:
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred during registration"
        }), 500

@app.route('/v1/login', methods=['POST'])
def login():
    """
    Login user with username and password
    Expected JSON payload:
    {
        "username": "johndoe",
        "password": "securepassword"
    }
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "Invalid JSON payload",
                "message": "Request must contain JSON data"
            }), 400
        
        username = data.get('username', '').strip().lower()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({
                "error": "Missing credentials",
                "message": "Username and password are required"
            }), 400
        
        # Authenticate user
        user = AuthUtils.authenticate_user(username, password)
        
        if not user:
            return jsonify({
                "error": "Authentication failed",
                "message": "Invalid username or password"
            }), 401
        
        # Create session
        session = AuthUtils.create_session(user.id)
        
        # Create response with redirect
        redirect_url = app.config.get('LOGIN_REDIRECT_URL', 'http://localhost:3000/dashboard')
        
        response = make_response(jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "redirect_url": redirect_url
        }))
        
        # Set session ID in header
        response.headers['sessionid'] = session.session_id
        
        return response, 200
        
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred during login"
        }), 500

@app.route('/v1/logout', methods=['POST'])
def logout():
    """
    Logout user by invalidating session
    Expects sessionid in headers
    """
    try:
        session_id = request.headers.get('sessionid')
        
        if not session_id:
            return jsonify({
                "error": "No session found",
                "message": "sessionid header is required"
            }), 400
        
        # Invalidate session
        success = AuthUtils.invalidate_session(session_id)
        
        if success:
            return jsonify({
                "message": "Logout successful"
            }), 200
        else:
            return jsonify({
                "error": "Invalid session",
                "message": "Session not found or already expired"
            }), 404
        
    except Exception as e:
        app.logger.error(f"Logout error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred during logout"
        }), 500

@app.route('/v1/validate-session', methods=['GET'])
def validate_session():
    """
    Validate current session
    Expects sessionid in headers
    """
    try:
        session_id = request.headers.get('sessionid')
        
        if not session_id:
            return jsonify({
                "error": "No session found",
                "message": "sessionid header is required"
            }), 400
        
        # Validate session
        session = AuthUtils.validate_session(session_id)
        
        if session:
            return jsonify({
                "message": "Session is valid",
                "user": session.user.to_dict(),
                "session_id": session.session_id
            }), 200
        else:
            return jsonify({
                "error": "Invalid session",
                "message": "Session not found or expired"
            }), 401
        
    except Exception as e:
        app.logger.error(f"Session validation error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred during session validation"
        }), 500

if __name__ == '__main__':
    config_obj = config.get(env, config['default'])
    app.run(
        debug=config_obj.DEBUG,
        host=config_obj.HOST,
        port=config_obj.PORT
    )
