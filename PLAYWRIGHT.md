# Playwright MCP Testing Guide

This project now includes comprehensive end-to-end API testing using Playwright MCP (Model Context Protocol).

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your test configuration
```

### 3. Start the Flask Server
```bash
# In a separate terminal
python app.py
```

### 4. Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:smoke    # Critical functionality
npm run test:api      # API endpoint tests
npm run test:auth     # Authentication flows
npm run test:integration  # User workflows

# Run with UI mode for debugging
npm run test:ui
```

## Test Structure

### Test Suites
- **Smoke Tests** (`@smoke`): Critical functionality validation
- **API Tests** (`@api`): Comprehensive endpoint testing
- **Authentication Tests** (`@auth`): Login, registration, token management
- **Integration Tests** (`@integration`): End-to-end user workflows

### Test Organization
```
tests/
├── basic.api.spec.ts         # Basic API functionality
├── authentication.auth.spec.ts   # Auth flows
├── workflows.integration.spec.ts # User workflows
├── critical.smoke.spec.ts    # Production readiness
├── utils/
│   ├── api-helpers.ts       # API utility functions
│   ├── test-data.ts         # Test data management
│   └── auth-helpers.ts      # Authentication utilities
├── setup/
│   ├── global-setup.ts      # Test environment setup
│   └── global-teardown.ts   # Cleanup operations
└── fixtures/
    └── test-users.json      # Test user data
```

## Configuration

### Playwright Configuration
The `playwright.config.ts` includes:
- Multi-project setup for different test types
- Web server integration with Flask backend
- CI/CD optimizations
- Retry and timeout configurations
- Reporter configuration for HTML and JUnit output

### Environment Variables
```env
# Flask Configuration
FLASK_ENV=testing
FLASK_DEBUG=false
DATABASE_URL=sqlite:///test.db

# Test Configuration
BASE_URL=http://localhost:5000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpass123
API_TIMEOUT=30000
```

## CI/CD Integration

The project includes GitHub Actions workflow for automated testing:
- Tests run on multiple Python and Node.js versions
- Automatic Playwright browser installation
- Test artifacts and reports uploaded
- Matrix testing for compatibility validation

## Best Practices

### Writing Tests
1. Use descriptive test names and group related tests
2. Implement proper setup and teardown
3. Use page object model for complex interactions
4. Tag tests appropriately (@smoke, @api, @auth, @integration)

### Test Data Management
- Use `test-data.ts` utilities for consistent test data
- Implement data cleanup in teardown hooks
- Use unique identifiers to avoid conflicts

### API Testing
- Test both success and error scenarios
- Validate response structure and data types
- Test authentication and authorization
- Include edge cases and boundary conditions

### Debugging
- Use `npm run test:ui` for interactive debugging
- Check test artifacts in `test-results/`
- Review HTML reports in `playwright-report/`
- Use `await page.pause()` for debugging breakpoints

## Troubleshooting

### Common Issues
1. **Server not starting**: Ensure Flask dependencies are installed
2. **Test timeouts**: Check server startup time and adjust timeouts
3. **Authentication failures**: Verify test user credentials
4. **Database errors**: Ensure test database is properly initialized

### Debug Commands
```bash
# View test results
npx playwright show-report

# Run specific test file
npx playwright test tests/basic.api.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests with debug mode
npx playwright test --debug
```

## Integration with Development Workflow

The Playwright MCP testing framework integrates seamlessly with your development process:

1. **Local Development**: Run tests during development to catch issues early
2. **Pre-commit Hooks**: Add smoke tests to pre-commit workflows
3. **CI/CD Pipeline**: Automated testing on all pull requests
4. **Production Monitoring**: Use smoke tests for production health checks

This comprehensive testing setup ensures your Flask API maintains high quality and reliability throughout the development lifecycle.
