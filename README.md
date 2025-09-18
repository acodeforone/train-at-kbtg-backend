# 🚀 Train at KBTG Backend

> A RESTful API training project built with Python Flask for KBTG AI Workshop

[![Python](https://img.shields.io/badge/python-v3.7+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-v3.0.3-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [📚 Additional Documentation](#-additional-documentation)

## 🎯 Overview

This is a simple Flask-based RESTful API that demonstrates basic REST API concepts. The primary endpoint returns a "Hello, world." message, making it perfect for learning and testing API development fundamentals.

### 🌟 Key Learning Objectives
- Understanding RESTful API principles
- Flask web framework basics
- API endpoint design and HTTP methods
- JSON response handling and validation
- User authentication and authorization
- Password hashing and security best practices
- Session management with UUID tokens
- SQLite database integration with SQLAlchemy
- Environment-based configuration
- Unit testing for APIs with database interactions
- End-to-end API testing with Playwright MCP framework
- Error handling and status codes
- Security headers and CORS handling

## ✨ Features

- 🔗 **RESTful Endpoints**: Clean, well-defined API routes
- 🏥 **Health Check**: Built-in health monitoring endpoint
- 👤 **User Authentication**: Complete registration and login system
- 🔐 **Session Management**: UUID-based session handling with expiration
- 💾 **SQLite Database**: Lightweight database with proper schema
- 🔒 **Password Security**: Bcrypt password hashing with salt
- 📚 **API Documentation**: Interactive Swagger UI with OpenAPI 3.0 spec
- 🧪 **Comprehensive Testing**: Unit tests with pytest and E2E testing with Playwright MCP
- ⚙️ **Environment Config**: Flexible configuration management
- 📝 **Documentation**: Well-documented code and API
- 🐍 **Python Best Practices**: Following PEP 8 and Flask conventions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/) (required for Playwright E2E testing)
- **pip** - Python package installer (usually comes with Python)
- **npm** - Node.js package manager (comes with Node.js)
- **curl** - For API testing (optional, can use browser or Postman)

## 🛠️ Installation

### 1. Clone or Navigate to the Project
```bash
cd backend/train-at-kbtg-backend
```

### 2. Set up Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

**For Development:**
```bash
# Install all dependencies (recommended for development)
pip install -r requirements.txt

# Or install with development tools
pip install -r requirements.txt -r requirements-dev.txt
```

**For Production:**
```bash
# Install minimal production dependencies
pip install -r requirements-prod.txt
```

**Using Make (if available):**
```bash
# Setup complete development environment
make setup

# Or install dependencies only
make install-dev  # Development
make install-prod # Production
```

### 4. Install Node.js Dependencies (for E2E Testing)
```bash
# Install Playwright and testing dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 5. Set up Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration (optional for basic usage)
```

### 6. Run the Application
```bash
python app.py
```

🎉 **Success!** Your API is now running at `http://localhost:5000`

### 📚 Access API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: [http://localhost:5000/swagger/](http://localhost:5000/swagger/)
- **API Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs) (redirects to Swagger UI)
- **OpenAPI JSON Spec**: [http://localhost:5000/apispec_1.json](http://localhost:5000/apispec_1.json)

The Swagger UI provides an interactive interface where you can:
- Explore all available endpoints
- View request/response schemas
- Test API endpoints directly in the browser
- Download the OpenAPI specification

## 🚀 Usage

### Quick Start
```bash
# Start the server
python app.py

# In another terminal, test the API
curl http://localhost:5000/v1/helloworld
```

### Using the Run Script
For convenience, you can use the provided run script:
```bash
./run.sh
```

## 📖 API Documentation

### Base URL
```
http://localhost:5000
```

### Interactive API Documentation

🚀 **Recommended**: Use the interactive Swagger UI for exploring and testing the API:
- **Swagger UI**: [http://localhost:5000/swagger/](http://localhost:5000/swagger/)

The Swagger interface provides:
- Complete API documentation with examples
- Interactive "Try it out" functionality
- Request/response schema validation
- Authentication testing with session management

### Endpoints

#### 🌍 Hello World Endpoint
```http
GET /v1/helloworld
```

**Description**: Returns a greeting message in JSON format.

**Response**:
```json
{
  "message": "Hello, world."
}
```

**Status Codes**:
- `200 OK` - Success

**Example**:
```bash
curl -X GET http://localhost:5000/v1/helloworld
```

#### 📝 User Registration Endpoint
```http
POST /v1/register
```

**Description**: Register a new user with the system.

**Request Body**:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "title": "Mr.",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response** (Success):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "title": "Mr.",
    "username": "johndoe",
    "created_at": "2025-09-18T07:15:57.031652",
    "updated_at": "2025-09-18T07:15:57.031659"
  }
}
```

**Status Codes**:
- `201 Created` - User registered successfully
- `400 Bad Request` - Validation failed
- `409 Conflict` - Username already exists

**Example**:
```bash
curl -X POST http://localhost:5000/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "title": "Mr.",
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

#### 🔐 User Login Endpoint
```http
POST /v1/login
```

**Description**: Authenticate user and create session.

**Request Body**:
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response** (Success):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "title": "Mr.",
    "username": "johndoe"
  },
  "redirect_url": "http://localhost:3000/dashboard"
}
```

**Response Headers**:
- `sessionid`: UUID session identifier for subsequent requests

**Status Codes**:
- `200 OK` - Login successful
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials

**Example**:
```bash
curl -X POST http://localhost:5000/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }' -i
```

#### ✅ Session Validation Endpoint
```http
GET /v1/validate-session
```

**Description**: Validate current user session.

**Request Headers**:
- `sessionid`: Session UUID from login

**Response**:
```json
{
  "message": "Session is valid",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "title": "Mr.",
    "username": "johndoe"
  },
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Status Codes**:
- `200 OK` - Session is valid
- `400 Bad Request` - Missing sessionid header
- `401 Unauthorized` - Invalid or expired session

**Example**:
```bash
curl -X GET http://localhost:5000/v1/validate-session \
  -H "sessionid: your-session-id-here"
```

#### 🚪 User Logout Endpoint
```http
POST /v1/logout
```

**Description**: Invalidate user session.

**Request Headers**:
- `sessionid`: Session UUID to invalidate

**Response**:
```json
{
  "message": "Logout successful"
}
```

**Status Codes**:
- `200 OK` - Logout successful
- `400 Bad Request` - Missing sessionid header
- `404 Not Found` - Session not found

**Example**:
```bash
curl -X POST http://localhost:5000/v1/logout \
  -H "sessionid: your-session-id-here"
```

#### 🏥 Health Check Endpoint
```http
GET /health
```

**Description**: Returns the service health status.

**Response**:
```json
{
  "status": "healthy"
}
```

**Status Codes**:
- `200 OK` - Service is healthy

**Example**:
```bash
curl -X GET http://localhost:5000/health
```

### Error Responses

For non-existent endpoints:
```json
{
  "error": "Not Found"
}
```

### Authentication Flow

1. **Registration**: User creates account with `/v1/register`
2. **Login**: User authenticates with `/v1/login` and receives `sessionid` header
3. **Authenticated Requests**: Include `sessionid` header in subsequent requests
4. **Session Validation**: Use `/v1/validate-session` to check session status
5. **Logout**: Invalidate session with `/v1/logout`

### Security Features

- **Password Hashing**: Uses bcrypt with automatic salt generation
- **Session Management**: UUID-based tokens with 24-hour expiration
- **Input Validation**: Comprehensive validation for all endpoints
- **SQL Injection Prevention**: Uses SQLAlchemy ORM with parameterized queries
- **CORS Support**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error messages without sensitive data exposure

## 🧪 Testing

This project includes both unit testing and comprehensive end-to-end API testing using Playwright MCP.

### Python Unit Tests

#### Running Unit Tests
```bash
# Run all Python unit tests
python -m unittest test_app.py

# Run tests with verbose output
python -m unittest test_app.py -v

# Run specific test
python -m unittest test_app.TestHelloWorldAPI.test_hello_world_endpoint

# Test Swagger integration
python test_swagger.py

# Using pytest (if installed with dev dependencies)
pytest

# Run tests with coverage
pytest --cov=app --cov-report=term-missing

# Using Make
make test      # Basic tests
make test-cov  # Tests with coverage
```

### Playwright MCP End-to-End Testing

#### Quick Start with E2E Testing
```bash
# Install dependencies (if not done already)
npm install
npx playwright install

# Run all E2E tests
npm test

# Run specific test suites
npm run test:smoke      # Critical functionality tests
npm run test:api        # API endpoint tests  
npm run test:auth       # Authentication flow tests
npm run test:integration # User workflow tests

# Run tests with UI for debugging
npm run test:ui
```

#### Test Suites Overview
- **🚨 Smoke Tests** (`@smoke`): Critical functionality validation for production readiness
- **🔌 API Tests** (`@api`): Comprehensive endpoint testing including error scenarios
- **🔐 Authentication Tests** (`@auth`): Login, registration, and session management flows
- **🔄 Integration Tests** (`@integration`): End-to-end user workflows and complex scenarios

#### Advanced Testing Options
```bash
# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/basic.api.spec.ts

# Debug mode with breakpoints
npx playwright test --debug

# Generate test report
npx playwright show-report

# Run tests against different environments
PLAYWRIGHT_BASE_URL=http://staging.example.com npm test
```

### Code Quality Tools
```bash
# Format code
make format

# Check formatting
make format-check

# Run linting
make lint

# Clean up build artifacts
make clean
```

### Test Coverage
#### Python Unit Test Coverage
- ✅ Hello World endpoint functionality
- ✅ Health check endpoint
- ✅ User registration with validation
- ✅ User login and authentication
- ✅ Session management and validation

#### Playwright E2E Test Coverage
- ✅ **API Functionality**: All REST endpoints with success/error scenarios
- ✅ **Authentication Flows**: Registration, login, logout, session validation
- ✅ **User Workflows**: Complete user journeys from registration to API usage
- ✅ **Error Handling**: Invalid inputs, unauthorized access, server errors
- ✅ **Production Readiness**: Health checks, performance validation
- ✅ **Security Testing**: Authentication bypass attempts, input validation

### CI/CD Integration

The project includes automated testing in GitHub Actions:
```yaml
# Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

# Test matrix includes:
- Python versions: 3.9, 3.10, 3.11
- Node.js versions: 18, 20
- Comprehensive test suite execution
- Test artifacts and reports upload
```

### Debugging and Troubleshooting

#### For Unit Tests
```bash
# Run tests with detailed output
python -m unittest test_app.py -v

# Debug specific test
python -c "import test_app; test_app.TestHelloWorldAPI().test_hello_world_endpoint()"
```

#### For E2E Tests
```bash
# Interactive debugging
npm run test:ui

# Check test results
ls test-results/
ls playwright-report/

# View HTML report
npx playwright show-report
```

📋 **For detailed E2E testing documentation, see [PLAYWRIGHT.md](PLAYWRIGHT.md)**
- ✅ User logout functionality
- ✅ Password hashing and verification
- ✅ Database operations (CRUD)
- ✅ Error handling for non-existent routes
- ✅ Input validation and sanitization
- ✅ JSON response format validation
- ✅ Duplicate username prevention
- ✅ Session expiration handling

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Database Configuration
DATABASE_URL=sqlite:///app.db
DEV_DATABASE_URL=sqlite:///dev_app.db

# Security Configuration
SECRET_KEY=your-secret-key-change-in-production

# Authentication Configuration
LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
SESSION_EXPIRE_HOURS=24
```

### Configuration Classes

- **DevelopmentConfig**: Debug mode enabled, detailed error messages, separate dev database
- **ProductionConfig**: Debug mode disabled, optimized for production, requires SECRET_KEY
- **TestingConfig**: In-memory database for testing, testing mode enabled

### Database Configuration

The application uses SQLite by default with the following setup:
- **Development**: `dev_app.db` file in project root
- **Production**: `app.db` file in project root  
- **Testing**: In-memory SQLite database

You can override the database URL using environment variables:
```bash
export DATABASE_URL="sqlite:///custom_path.db"
# or for PostgreSQL in production:
export DATABASE_URL="postgresql://user:password@localhost/dbname"
```

## 📁 Project Structure

```
backend/train-at-kbtg-backend/
├── 📄 app.py                 # Main Flask application
├── ⚙️ config.py              # Configuration management
├── �️ models.py              # SQLAlchemy database models
├── 🔐 auth_utils.py          # Authentication utilities
├── �📦 requirements.txt       # Production dependencies
├── 🧰 requirements-dev.txt   # Development dependencies
├── 🚀 requirements-prod.txt  # Minimal production dependencies
├── 🧪 test_app.py           # Unit tests
├── � swagger.yaml          # OpenAPI/Swagger specification
├── 🧪 test_swagger.py       # Swagger integration tests
├── �🔧 .env                  # Environment variables
├── 🏃 run.sh                # Setup and run script
├── 📚 README.md             # This documentation
├── 📊 DETAILS.md            # Technical details with UML diagrams
├── 📊 DATABASE_SCHEMA.md    # Database schema documentation
├── 🙈 .gitignore            # Git ignore rules
├── 🛠️ Makefile              # Development automation
├── 📋 pyproject.toml        # Tool configuration
├── 🐳 Dockerfile            # Container configuration
├── 💾 *.db                  # SQLite database files
└── 📁 venv/                 # Virtual environment (auto-generated)
```

## 👨‍💻 Development

### Adding New Endpoints

1. **Define the route** in `app.py`:
```python
@app.route('/v1/new-endpoint', methods=['GET'])
def new_endpoint():
    return jsonify({"message": "New endpoint"})
```

2. **Add tests** in `test_app.py`:
```python
def test_new_endpoint(self):
    response = self.app.get('/v1/new-endpoint')
    self.assertEqual(response.status_code, 200)
```

3. **Update documentation** in this README

### Code Style
- Follow **PEP 8** Python style guidelines
- Use descriptive variable and function names
- Add docstrings to all functions
- Keep functions small and focused

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-endpoint

# Make changes and commit
git add .
git commit -m "Add new endpoint for XYZ"

# Push and create pull request
git push origin feature/new-endpoint
```

## � Technical Details

For comprehensive technical documentation including database schema, UML diagrams, and system architecture, see:

**[📋 DETAILS.md](./DETAILS.md)** - Complete technical specification with:
- 🗄️ **Entity Relationship Diagram** - Database schema visualization
- 📐 **Class Diagram (Mermaid)** - System class structure and relationships
- 🔄 **Sequence Diagrams (PlantUML)** - Authentication and session flows
- 🏗️ **System Architecture** - High-level component architecture
- 🌊 **Data Flow Diagrams** - Request processing and authentication flows

## �🚀 Deployment

### Using Docker
```bash
# Build Docker image
docker build -t kbtg-backend .

# Run container
docker run -p 5000:5000 kbtg-backend

# Using Make
make docker-build
make docker-run
```

### Using Gunicorn (Production)
```bash
# Install production dependencies
pip install -r requirements-prod.txt

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Using Make
make prod
```

### Environment Variables for Production
```env
FLASK_ENV=production
FLASK_DEBUG=0
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
SECRET_KEY=your-super-secret-production-key
DATABASE_URL=postgresql://user:pass@localhost/prod_db
LOGIN_REDIRECT_URL=https://your-frontend.com/dashboard
```

### Performance Monitoring

**Database Performance:**
```bash
# Monitor SQLite database size
du -h *.db

# Check database integrity
sqlite3 app.db "PRAGMA integrity_check;"

# Optimize database
sqlite3 app.db "VACUUM;"
```

**API Performance Testing:**
```bash
# Test registration endpoint
ab -n 100 -c 10 -H "Content-Type: application/json" \
  -p registration_payload.json http://localhost:5000/v1/register

# Test login endpoint  
ab -n 100 -c 10 -H "Content-Type: application/json" \
  -p login_payload.json http://localhost:5000/v1/login
```

### Security Considerations

**Production Checklist:**
- [ ] Change default `SECRET_KEY`
- [ ] Use HTTPS in production
- [ ] Set secure session cookies
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Regular security updates
- [ ] Database backups
- [ ] Log monitoring
- [ ] Session cleanup tasks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Learning Resources

### Flask & Python
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy Guide](https://flask-sqlalchemy.palletsprojects.com/)
- [Python Testing with unittest](https://docs.python.org/3/library/unittest.html)
- [PEP 8 Style Guide](https://pep8.org/)

### UML & Documentation
- [Mermaid Documentation](https://mermaid.js.org/)
- [PlantUML Documentation](https://plantuml.com/)
- [UML Class Diagrams](https://www.uml-diagrams.org/class-diagrams.html)
- [Entity Relationship Diagrams](https://www.lucidchart.com/pages/er-diagrams)

### REST API Design
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)

### Authentication & Security
- [bcrypt Password Hashing](https://github.com/pyca/bcrypt/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [JWT Tokens](https://jwt.io/introduction/)
- [Session vs Token Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)

### Database & SQLAlchemy
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Database Design Principles](https://www.guru99.com/database-design.html)

### Testing & Quality
- [pytest Documentation](https://docs.pytest.org/)
- [Test-Driven Development](https://testdriven.io/)
- [Code Coverage with Coverage.py](https://coverage.readthedocs.io/)

### Deployment & DevOps
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Docker for Python](https://docs.docker.com/language/python/)
- [12-Factor App Methodology](https://12factor.net/)

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

**Virtual environment issues:**
```bash
# Remove and recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Import errors:**
```bash
# Ensure you're in the correct directory and venv is activated
pwd
which python
```

**Database issues:**
```bash
# Reset database (development only)
rm -f dev_app.db app.db
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

**Authentication Issues:**

**Session not working:**
- Ensure `sessionid` header is included in requests
- Check if session has expired (24-hour default)
- Verify session ID format (should be UUID)

**Password hash errors:**
- Ensure bcrypt is installed: `pip install bcrypt`
- Check if password meets minimum requirements (6+ characters)

**Registration fails:**
- Check for duplicate username
- Validate all required fields are provided
- Ensure database is writable

**Login redirect not working:**
- Check `LOGIN_REDIRECT_URL` environment variable
- Verify URL format is complete (with protocol)

**Database connection errors:**
```bash
# Check database file permissions
ls -la *.db
# Recreate database if corrupted
rm -f app.db && python app.py
```

## 📚 Additional Documentation

For comprehensive documentation on specific aspects of this project:

- **[📋 Technical Details & UML Diagrams](DETAILS.md)** - Complete technical documentation including:
  - Entity Relationship Diagrams
  - UML Class Diagrams  
  - Sequence Diagrams
  - Architecture Overview

- **[🎭 Playwright MCP Testing Guide](PLAYWRIGHT.md)** - Comprehensive E2E testing documentation including:
  - Testing Framework Setup
  - Test Suite Organization
  - CI/CD Integration
  - Best Practices & Troubleshooting

- **[🔍 Database Schema](DATABASE_SCHEMA.md)** - Detailed database documentation
- **[🐳 Docker Documentation](Dockerfile)** - Containerization setup
- **[📊 API Specification](swagger.yaml)** - Complete OpenAPI 3.0 specification

---

**Happy Coding! 🚀**

Made with ❤️ for KBTG AI Training Workshop
