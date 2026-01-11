.PHONY: help install dev build test lint format clean deploy

help:
	@echo "Tech Verdict - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install       Install dependencies"
	@echo "  make dev           Start development server"
	@echo "  make build         Build for production"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test          Run tests"
	@echo "  make test-watch    Run tests in watch mode"
	@echo "  make lint          Run ESLint"
	@echo "  make format        Format code with Prettier"
	@echo "  make type-check    Check TypeScript types"
	@echo ""
	@echo "Deployment:"
	@echo "  make docker-build  Build Docker image"
	@echo "  make docker-run    Run Docker container"
	@echo "  make deploy-sam    Deploy to AWS Lambda"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean         Remove build artifacts"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm test

test-watch:
	npm run test:watch

lint:
	npm run lint

format:
	npm run format

type-check:
	npm run type-check

clean:
	rm -rf dist coverage node_modules

docker-build:
	docker build -t tech-verdict:latest .

docker-run:
	docker run -p 3000:3000 \
		-e AWS_REGION=us-east-1 \
		-e NODE_ENV=production \
		tech-verdict:latest

deploy-sam:
	sam build
	sam deploy

all: clean install build test lint
	@echo "✅ All checks passed!"
