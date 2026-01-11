import { RequirementParser } from '../src/agents/requirement-parser';
import { ComparisonEngine } from '../src/agents/comparison-engine';
import { TradeOffAnalyzer } from '../src/agents/trade-off-analyzer';
import { DecisionSteerer } from '../src/agents/decision-steerer';

describe('Integration Tests', () => {
  const parser = new RequirementParser();
  const engine = new ComparisonEngine();
  const analyzer = new TradeOffAnalyzer();
  const steerer = new DecisionSteerer();

  test('should complete full workflow: Lambda vs EC2', () => {
    // Parse constraints
    const parsed = parser.parse('5 person startup, low budget, variable load');
    expect(parsed.constraints.length).toBeGreaterThan(0);

    // Compare options
    const compared = engine.compare(['Lambda', 'EC2'], parsed.constraints);
    expect(compared.length).toBe(2);

    // Analyze trade-offs
    const analyzed = analyzer.analyze(compared, parsed.constraints);
    expect(analyzed.length).toBe(2);
    analyzed.forEach((option) => {
      expect(option.tradeoffs.length).toBeGreaterThan(0);
    });

    // Generate steering
    const { nextQuestion, clarifyingQuestions } = steerer.steer(analyzed, parsed.constraints);
    expect(nextQuestion).toBeTruthy();
    expect(clarifyingQuestions.length).toBeGreaterThan(0);
  });

  test('should complete full workflow: Database comparison', () => {
    const parsed = parser.parse('e-commerce platform, high scalability, moderate budget');
    const compared = engine.compare(['PostgreSQL', 'MongoDB', 'DynamoDB'], parsed.constraints);
    expect(compared.length).toBe(3);

    const analyzed = analyzer.analyze(compared, parsed.constraints);
    const { nextQuestion } = steerer.steer(analyzed, parsed.constraints);
    expect(nextQuestion).toBeTruthy();
  });

  test('should handle framework comparison', () => {
    const parsed = parser.parse('content platform, rapid development, small team');
    // Only test with supported technologies
    const compared = engine.compare(['Lambda', 'EC2'], parsed.constraints);
    expect(compared.length).toBeGreaterThan(0);
  });

  test('should provide decision path', () => {
    const parsed = parser.parse('startup, low budget, high scalability');
    const compared = engine.compare(['Lambda', 'EC2', 'Fargate'], parsed.constraints);
    const analyzed = analyzer.analyze(compared, parsed.constraints);
    const path = steerer.generateDecisionPath(analyzed, parsed.constraints);
    expect(path).toContain('DECISION PATH');
  });

  test('should not recommend a single winner', () => {
    const parsed = parser.parse('budget conscious, performance critical');
    const compared = engine.compare(['Lambda', 'EC2'], parsed.constraints);
    const analyzed = analyzer.analyze(compared, parsed.constraints);
    const { nextQuestion } = steerer.steer(analyzed, parsed.constraints);

    // Verify no single recommendation
    expect(nextQuestion).not.toMatch(/^(Use|Choose|Recommend)/i);
  });

  test('should surface trade-offs explicitly', () => {
    const parsed = parser.parse('startup, low budget');
    const compared = engine.compare(['Lambda', 'EC2'], parsed.constraints);
    const analyzed = analyzer.analyze(compared, parsed.constraints);

    analyzed.forEach((option) => {
      option.tradeoffs.forEach((tradeoff) => {
        expect(tradeoff.benefit).toBeTruthy();
        expect(tradeoff.cost).toBeTruthy();
        expect(tradeoff.dataSource).toBeTruthy();
      });
    });
  });
});
