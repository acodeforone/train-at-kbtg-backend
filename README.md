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
- [Contributing](#contributing)

## 🎯 Overview

This is a simple Flask-based RESTful API that demonstrates basic REST API concepts. The primary endpoint returns a "Hello, world." message, making it perfect for learning and testing API development fundamentals.

### 🌟 Key Learning Objectives
- Understanding RESTful API principles
- Flask web framework basics
- API endpoint design
- JSON response handling
- Environment-based configuration
- Unit testing for APIs

## ✨ Features

- 🔗 **RESTful Endpoints**: Clean, well-defined API routes
- 🏥 **Health Check**: Built-in health monitoring endpoint
- 🧪 **Unit Testing**: Comprehensive test coverage
- ⚙️ **Environment Config**: Flexible configuration management
- 📝 **Documentation**: Well-documented code and API
- 🐍 **Python Best Practices**: Following PEP 8 and Flask conventions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** - [Download here](https://www.python.org/downloads/)
- **pip** - Python package installer (usually comes with Python)
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

### 4. Run the Application
```bash
python app.py
```

🎉 **Success!** Your API is now running at `http://localhost:5000`

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

## 🧪 Testing

### Running Tests
```bash
# Run all tests
python -m unittest test_app.py

# Run tests with verbose output
python -m unittest test_app.py -v

# Run specific test
python -m unittest test_app.TestHelloWorldAPI.test_hello_world_endpoint

# Using pytest (if installed with dev dependencies)
pytest

# Run tests with coverage
pytest --cov=app --cov-report=term-missing

# Using Make
make test      # Basic tests
make test-cov  # Tests with coverage
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
The test suite covers:
- ✅ Hello World endpoint functionality
- ✅ Health check endpoint
- ✅ Error handling for non-existent routes
- ✅ JSON response format validation

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Configuration Classes

- **DevelopmentConfig**: Debug mode enabled, detailed error messages
- **ProductionConfig**: Debug mode disabled, optimized for production

## 📁 Project Structure

```
backend/train-at-kbtg-backend/
├── 📄 app.py                 # Main Flask application
├── ⚙️ config.py              # Configuration management
├── 📦 requirements.txt       # Production dependencies
├── 🧰 requirements-dev.txt   # Development dependencies
├── 🚀 requirements-prod.txt  # Minimal production dependencies
├── 🧪 test_app.py           # Unit tests
├── 🔧 .env                  # Environment variables
├── 🏃 run.sh                # Setup and run script
├── 📚 README.md             # This documentation
├── 🙈 .gitignore            # Git ignore rules
├── 🛠️ Makefile              # Development automation
├── 📋 pyproject.toml        # Tool configuration
├── 🐳 Dockerfile            # Container configuration
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

## 🚀 Deployment

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
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [RESTful API Design](https://restfulapi.net/)
- [Python Testing with unittest](https://docs.python.org/3/library/unittest.html)
- [HTTP Status Codes](https://httpstatuses.com/)

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

---

**Happy Coding! 🚀**

Made with ❤️ for KBTG AI Training Workshop
