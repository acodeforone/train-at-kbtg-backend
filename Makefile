.PHONY: help install install-dev install-prod test test-cov lint format clean run dev setup test-e2e test-all

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@egrep '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Setup development environment
	python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -r requirements.txt
	./venv/bin/pip install -r requirements-dev.txt
	npm install
	npx playwright install

install: ## Install production dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

install-prod: ## Install production dependencies only
	pip install -r requirements-prod.txt

test: ## Run tests
	python -m pytest

test-cov: ## Run tests with coverage
	python -m pytest --cov=app --cov-report=term-missing --cov-report=html

test-e2e: ## Run Playwright E2E tests
	npm test

test-e2e-ui: ## Run Playwright tests with UI
	npm run test:ui

test-all: ## Run all tests (unit + E2E)
	python -m pytest --cov=app --cov-report=term-missing
	npm test

lint: ## Run linting
	flake8 app.py config.py test_app.py
	mypy app.py config.py

format: ## Format code
	black app.py config.py test_app.py
	isort app.py config.py test_app.py

format-check: ## Check code formatting
	black --check app.py config.py test_app.py
	isort --check-only app.py config.py test_app.py

clean: ## Clean up build artifacts
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf *.egg-info/
	rm -rf build/
	rm -rf dist/
	rm -rf test-results/
	rm -rf playwright-report/
	rm -rf node_modules/.cache/

run: ## Run the Flask app
	python app.py

dev: ## Run the Flask app in development mode
	FLASK_ENV=development FLASK_DEBUG=1 python app.py

prod: ## Run the Flask app with gunicorn
	gunicorn -w 4 -b 0.0.0.0:5000 app:app

docker-build: ## Build Docker image
	docker build -t kbtg-backend .

docker-run: ## Run Docker container
	docker run -p 5000:5000 kbtg-backend

freeze: ## Generate requirements.txt from current environment
	pip freeze > requirements-freeze.txt

upgrade: ## Upgrade all packages
	pip install --upgrade -r requirements.txt
	pip install --upgrade -r requirements-dev.txt
