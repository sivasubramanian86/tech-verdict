import { ComparisonEngine } from '../src/agents/comparison-engine';
import { Constraint } from '../src/types';

describe('ComparisonEngine', () => {
  const engine = new ComparisonEngine();

  const mockConstraints: Constraint[] = [
    { name: 'budget', value: 'low', weight: 0.5, category: 'budget' },
    { name: 'scalability', value: 'high', weight: 0.5, category: 'scalability' },
  ];

  test('should compare Lambda vs EC2', () => {
    const result = engine.compare(['Lambda', 'EC2'], mockConstraints);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('AWS Lambda');
    expect(result[1].name).toBe('AWS EC2');
  });

  test('should generate scores for each option', () => {
    const result = engine.compare(['Lambda', 'EC2'], mockConstraints);
    result.forEach((option) => {
      expect(Object.keys(option.scores).length).toBeGreaterThan(0);
      Object.values(option.scores).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });
  });

  test('should generate trade-offs for each option', () => {
    const result = engine.compare(['Lambda', 'EC2'], mockConstraints);
    result.forEach((option) => {
      expect(option.tradeoffs.length).toBeGreaterThan(0);
      option.tradeoffs.forEach((tradeoff) => {
        expect(tradeoff.benefit).toBeTruthy();
        expect(tradeoff.cost).toBeTruthy();
        expect(['high', 'medium', 'low']).toContain(tradeoff.confidence);
      });
    });
  });

  test('should determine best and worst fit', () => {
    const result = engine.compare(['Lambda', 'EC2'], mockConstraints);
    result.forEach((option) => {
      expect(option.bestFor).toContain('prioritize');
      expect(option.worstFor).toContain('Avoid');
    });
  });

  test('should handle database comparison', () => {
    const result = engine.compare(['PostgreSQL', 'MongoDB', 'DynamoDB'], mockConstraints);
    expect(result.length).toBe(3);
    result.forEach((option) => {
      expect(option.tradeoffs.length).toBeGreaterThan(0);
    });
  });

  test('should throw error for unknown technology', () => {
    expect(() => {
      engine.compare(['UnknownTech'], mockConstraints);
    }).toThrow();
  });
});
