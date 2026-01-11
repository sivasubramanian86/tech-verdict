# Tech Verdict 🏛️

A multi-agent decision-making comparison tool that helps teams evaluate technology options fairly by surfacing trade-offs instead of recommending a single answer.

## Why Tech Verdict?

Making technology decisions is hard. Most tools either:
- ❌ Recommend a single "best" option (ignoring your unique constraints)
- ❌ Present feature matrices without context (overwhelming and unhelpful)
- ❌ Hide trade-offs (pretending there are no downsides)

Tech Verdict does something different:
- ✅ Compares options fairly across multiple dimensions
- ✅ Surfaces explicit trade-offs (benefit X costs Y)
- ✅ Guides you through decision logic without deciding for you
- ✅ Cites data sources and confidence levels
- ✅ Asks clarifying questions to help you articulate priorities

## Quick Start

### Installation
```bash
git clone https://github.com/your-org/tech-verdict.git
cd tech-verdict
npm install
```

### Local Development
```bash
cp .env.example .env.local
npm run dev
```

Server runs on http://localhost:3000

### Example Request
```bash
curl -X POST http://localhost:3000/compare \
  -H "Content-Type: application/json" \
  -d '{
    "constraints": "5 person startup, low budget, variable load",
    "options": ["AWS Lambda", "AWS EC2"]
  }'
```

### Example Response
```json
{
  "requirements": [
    { "name": "budget", "value": "low", "weight": 0.5, "category": "budget" },
    { "name": "scalability", "value": "variable", "weight": 0.5, "category": "scalability" }
  ],
  "options": [
    {
      "name": "AWS Lambda",
      "scores": { "cost": 0.9, "scalability": 0.95, "performance": 0.6, ... },
      "tradeoffs": [
        {
          "benefit": "Minimal operational overhead",
          "cost": "Cold starts ~500ms on first invocation",
          "confidence": "high",
          "dataSource": "AWS documentation"
        }
      ],
      "bestFor": "Use if you prioritize operational_overhead",
      "worstFor": "Avoid if customization is critical"
    }
  ],
  "nextQuestion": "Between Lambda and EC2, which matters more - cost or performance?",
  "clarifyingQuestions": [
    "How often will your 5 people deploy changes?",
    "What is your expected request volume?"
  ]
}
```

## Core Agents

### 1. Requirement Parser
Extracts and weights constraints from natural language.

**Input**: "5 person startup, low budget, variable load"
**Output**: Structured constraints with normalized weights

### 2. Comparison Engine
Evaluates options fairly across multiple dimensions.

**Input**: Options + constraints
**Output**: Normalized scores (0-1) with data sources

### 3. Trade-off Analyzer
Articulates explicit costs and benefits for each option.

**Input**: Comparison results + constraints
**Output**: Enhanced trade-offs specific to user's needs

### 4. Decision Steerer
Guides users through decision logic without recommending.

**Input**: Comparison results + constraints
**Output**: Clarifying questions + decision framework

## Supported Technologies

### Compute
- AWS Lambda
- AWS EC2
- AWS Fargate

### Databases
- PostgreSQL
- MongoDB
- DynamoDB

### Frameworks
- Next.js
- Remix
- SvelteKit

## Key Principles

### 1. No Single Recommendation
We never say "Use X" or "Choose Y". Instead, we ask clarifying questions and provide a decision framework.

### 2. Explicit Trade-offs
Every option has benefits AND costs. We surface both.

### 3. Fair Comparison
All options evaluated on same dimensions with normalized scores.

### 4. Data Source Attribution
Every claim cites a source (AWS docs, benchmarks, surveys).

### 5. Confidence Levels
We distinguish high/medium/low confidence claims.

## Use Cases

### "Compare AWS Lambda vs Google Cloud Functions vs AWS Fargate for a startup"
```bash
curl -X POST http://localhost:3000/compare \
  -H "Content-Type: application/json" \
  -d '{
    "constraints": "startup, low budget, variable load, AWS preference",
    "options": ["AWS Lambda", "AWS Fargate"]
  }'
```

### "Which database: PostgreSQL, MongoDB, or DynamoDB for our e-commerce platform?"
```bash
curl -X POST http://localhost:3000/compare \
  -H "Content-Type: application/json" \
  -d '{
    "constraints": "e-commerce, high scalability, ACID compliance important",
    "options": ["PostgreSQL", "MongoDB", "DynamoDB"]
  }'
```

### "Serverless vs containers for our ML pipeline with variable load"
```bash
curl -X POST http://localhost:3000/compare \
  -H "Content-Type: application/json" \
  -d '{
    "constraints": "ML pipeline, variable load, cost sensitive",
    "options": ["AWS Lambda", "AWS Fargate"]
  }'
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

## Documentation

- [API Documentation](docs/API.md) - Endpoint reference and examples
- [Architecture](docs/ARCHITECTURE.md) - System design and data flow
- [Deployment Guide](docs/DEPLOYMENT.md) - Local, Docker, Lambda, Terraform

## KIRO Specifications

Tech Verdict is built on EARS (Easy Approach to Requirements Syntax) specifications:

- [Requirement Parser Spec](.kiro/specs/requirement-parser.ears.md)
- [Comparison Engine Spec](.kiro/specs/comparison-engine.ears.md)
- [Trade-off Analyzer Spec](.kiro/specs/trade-off-analyzer.ears.md)
- [Decision Steerer Spec](.kiro/specs/decision-steerer.ears.md)

Steering constraints:
- [Comparison Fairness](.kiro/steering/comparison-fairness.md)
- [No Single Recommendation](.kiro/steering/no-single-recommendation.md)

## Development

### Project Structure
```
tech-verdict/
├── src/
│   ├── agents/              # Core agents
│   ├── types/               # TypeScript types
│   ├── api.ts               # Express API
│   └── index.ts             # Entry point
├── tests/                   # Test suite
├── .kiro/                   # KIRO specs & steering
├── docs/                    # Documentation
├── examples/                # Example requests/responses
└── infrastructure/          # Deployment configs
```

### Build
```bash
npm run build
npm run type-check
npm run lint
```

### Deploy
```bash
# Local
npm start

# Docker
docker build -t tech-verdict .
docker run -p 3000:3000 tech-verdict

# AWS Lambda
sam deploy --guided
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Apache 2.0 - See [LICENSE](LICENSE)

## Security

See [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-org/tech-verdict/issues)
- 💬 [Discussions](https://github.com/your-org/tech-verdict/discussions)

---

**Built for the Kiro Heroes Challenge #6** 🚀
