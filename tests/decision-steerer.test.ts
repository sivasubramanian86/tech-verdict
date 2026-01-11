import { DecisionSteerer } from '../src/agents/decision-steerer';
import { OptionScore, Constraint } from '../src/types';

describe('DecisionSteerer', () => {
  const steerer = new DecisionSteerer();

  const mockOptions: OptionScore[] = [
    {
      name: 'AWS Lambda',
      scores: { cost: 0.9, scalability: 0.95, performance: 0.6 },
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
      scores: { cost: 0.4, scalability: 0.7, performance: 0.95 },
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

  test('should generate next question', () => {
    const { nextQuestion } = steerer.steer(mockOptions, mockConstraints);
    expect(nextQuestion).toBeTruthy();
    expect(nextQuestion.length).toBeGreaterThan(0);
  });

  test('should NOT recommend a single winner', () => {
    const { nextQuestion } = steerer.steer(mockOptions, mockConstraints);
    expect(nextQuestion).not.toMatch(/use|choose|recommend/i);
  });

  test('should ask clarifying questions', () => {
    const { clarifyingQuestions } = steerer.steer(mockOptions, mockConstraints);
    expect(clarifyingQuestions.length).toBeGreaterThan(0);
    expect(clarifyingQuestions.length).toBeLessThanOrEqual(3);
  });

  test('should generate decision path', () => {
    const path = steerer.generateDecisionPath(mockOptions, mockConstraints);
    expect(path).toContain('DECISION PATH');
    expect(path).toContain('KEY TRADE-OFFS');
  });

  test('should handle single option', () => {
    const { nextQuestion } = steerer.steer([mockOptions[0]], mockConstraints);
    expect(nextQuestion).toContain('AWS Lambda');
  });

  test('should ask about missing budget constraint', () => {
    const noConstraints: Constraint[] = [];
    const { clarifyingQuestions } = steerer.steer(mockOptions, noConstraints);
    expect(clarifyingQuestions.some((q) => q.includes('budget'))).toBe(true);
  });

  test('should ask about missing team constraint', () => {
    const noTeamConstraints: Constraint[] = [
      { name: 'budget', value: 'low', weight: 1, category: 'budget' },
    ];
    const { clarifyingQuestions } = steerer.steer(mockOptions, noTeamConstraints);
    expect(clarifyingQuestions.some((q) => q.includes('engineer'))).toBe(true);
  });
});
