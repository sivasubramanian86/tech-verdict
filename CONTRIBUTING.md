# Contributing to Tech Verdict

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/tech-verdict.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Install dependencies: `npm install`

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
```

### Make Changes
- Follow TypeScript best practices
- Keep code concise and readable
- Add tests for new features
- Update documentation

### Test
```bash
npm test
npm run lint
npm run type-check
```

### Commit
```bash
git add .
git commit -m "feat: add new comparison dimension"
git push origin feature/your-feature
```

### Pull Request
1. Push to your fork
2. Create a pull request to main
3. Describe changes and link related issues
4. Ensure CI passes

## Code Style

- Use TypeScript for all code
- Follow ESLint configuration
- Format with Prettier: `npm run format`
- Use meaningful variable names
- Add comments for complex logic

## Adding New Technologies

### 1. Update Comparison Engine
Edit `src/agents/comparison-engine.ts`:

```typescript
const TECH_DATABASE: Record<string, TechOption> = {
  // ... existing entries
  newtechnology: {
    name: 'New Technology',
    attributes: {
      cost: 0.8,
      scalability: 0.9,
      // ... other dimensions
    },
  },
};
```

### 2. Add Trade-offs
In the `generateTradeoffs` method:

```typescript
'New Technology': [
  {
    benefit: 'Benefit description',
    cost: 'Cost description',
    confidence: 'high',
    dataSource: 'Source URL or documentation',
  },
  // ... more trade-offs
],
```

### 3. Add Tests
Create test cases in `tests/comparison-engine.test.ts`:

```typescript
test('should compare New Technology', () => {
  const result = engine.compare(['New Technology', 'Existing'], mockConstraints);
  expect(result.length).toBe(2);
  expect(result[0].tradeoffs.length).toBeGreaterThan(0);
});
```

## Adding New Constraint Categories

### 1. Update Type
Edit `src/types/constraint.ts`:

```typescript
category: 'budget' | 'performance' | 'scalability' | 'team' | 'operational' | 'new_category' | 'other';
```

### 2. Update Parser
Edit `src/agents/requirement-parser.ts`:

```typescript
const CONSTRAINT_KEYWORDS: Record<string, { category: Constraint['category']; weight: number }> = {
  // ... existing keywords
  'new_keyword': { category: 'new_category', weight: 0.8 },
};
```

### 3. Update Steerer
Edit `src/agents/decision-steerer.ts` to generate clarifying questions for the new category.

## Testing Requirements

- Unit tests for each agent
- Integration tests for workflows
- Minimum 80% code coverage
- All tests must pass before PR merge

### Run Tests
```bash
npm test
npm run test:watch
npm test -- --coverage
```

## Documentation

- Update README.md for user-facing changes
- Update docs/ for architectural changes
- Update KIRO specs for requirement changes
- Add examples for new features

## KIRO Specifications

If adding new requirements:

1. Create EARS spec in `.kiro/specs/`
2. Follow EARS format (WHEN/THEN/AND)
3. Include acceptance criteria
4. Add corresponding tests

## Security

- Never commit credentials or secrets
- Use environment variables for configuration
- Validate all user input
- Report security issues to SECURITY.md

## Performance

- Minimize bundle size
- Optimize agent logic
- Cache comparison results
- Profile before optimizing

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Test additions
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `chore:` Maintenance

Example:
```
feat: add new comparison dimension for reliability

- Add reliability scoring to comparison engine
- Update trade-off analyzer with reliability trade-offs
- Add tests for reliability dimension
```

## Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages are clear
- [ ] No hardcoded secrets

## Questions?

- 📖 Check [documentation](docs/)
- 💬 Open a discussion
- 🐛 Search existing issues

Thank you for contributing! 🙏
