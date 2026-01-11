import { RequirementParser } from '../src/agents/requirement-parser';

describe('RequirementParser', () => {
  const parser = new RequirementParser();

  test('should parse budget constraint', () => {
    const result = parser.parse('low budget');
    expect(result.constraints.length).toBeGreaterThan(0);
    expect(result.constraints.some((c) => c.category === 'budget')).toBe(true);
  });

  test('should parse performance constraint', () => {
    const result = parser.parse('high performance, low latency');
    expect(result.constraints.some((c) => c.category === 'performance')).toBe(true);
  });

  test('should parse scalability constraint', () => {
    const result = parser.parse('need to scale to 10k users');
    expect(result.constraints.some((c) => c.category === 'scalability')).toBe(true);
  });

  test('should parse team constraint', () => {
    const result = parser.parse('5 person startup');
    expect(result.constraints.some((c) => c.category === 'team')).toBe(true);
  });

  test('should normalize weights', () => {
    const result = parser.parse('budget performance scalability');
    const totalWeight = result.constraints.reduce((sum, c) => sum + c.weight, 0);
    expect(Math.abs(totalWeight - 1)).toBeLessThan(0.01);
  });

  test('should generate clarifications for missing constraints', () => {
    const result = parser.parse('budget');
    expect(result.clarifications && result.clarifications.length).toBeGreaterThan(0);
  });

  test('should handle complex input', () => {
    const result = parser.parse('startup with low budget, high performance needs, 5 people');
    expect(result.constraints.length).toBeGreaterThanOrEqual(3);
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
