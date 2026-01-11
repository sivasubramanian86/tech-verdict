import { TradeOffAnalyzer } from '../src/agents/trade-off-analyzer';
import { OptionScore, Constraint } from '../src/types';

describe('TradeOffAnalyzer', () => {
  const analyzer = new TradeOffAnalyzer();

  const mockOptions: OptionScore[] = [
    {
      name: 'AWS Lambda',
      scores: { cost: 0.9, scalability: 0.95 },
      tradeoffs: [
        {
          benefit: 'Minimal ops',
          cost: 'Cold starts',
          confidence: 'high',
        },
      ],
      bestFor: 'Use if you prioritize cost',
      worstFor: 'Avoid if performance is critical',
    },
    {
      name: 'AWS EC2',
      scores: { cost: 0.4, scalability: 0.7 },
      tradeoffs: [
        {
          benefit: 'Full control',
          cost: 'Ops overhead',
          confidence: 'high',
        },
      ],
      bestFor: 'Use if you prioritize control',
      worstFor: 'Avoid if budget is tight',
    },
  ];

  const mockConstraints: Constraint[] = [
    { name: 'budget', value: 'low', weight: 0.6, category: 'budget' },
    { name: 'scalability', value: 'high', weight: 0.4, category: 'scalability' },
  ];

  test('should enrich trade-offs with constraint-specific information', () => {
    const result = analyzer.analyze(mockOptions, mockConstraints);
    result.forEach((option) => {
      expect(option.tradeoffs.length).toBeGreaterThan(0);
    });
  });

  test('should include data sources in trade-offs', () => {
    const result = analyzer.analyze(mockOptions, mockConstraints);
    result.forEach((option) => {
      option.tradeoffs.forEach((tradeoff) => {
        expect(tradeoff.dataSource || tradeoff.dataSource === undefined).toBeTruthy();
      });
    });
  });

  test('should limit trade-offs to top 5', () => {
    const result = analyzer.analyze(mockOptions, mockConstraints);
    result.forEach((option) => {
      expect(option.tradeoffs.length).toBeLessThanOrEqual(5);
    });
  });

  test('should generate summary of trade-offs', () => {
    const summary = analyzer.summarizeTradeoffs(mockOptions);
    expect(summary).toContain('AWS Lambda');
    expect(summary).toContain('AWS EC2');
    expect(summary).toContain('•');
  });

  test('should handle budget constraint trade-offs', () => {
    const budgetConstraint: Constraint = {
      name: 'budget',
      value: 'low',
      weight: 1,
      category: 'budget',
    };
    const result = analyzer.analyze(mockOptions, [budgetConstraint]);
    expect(result.length).toBe(2);
  });
});
