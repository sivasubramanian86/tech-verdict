import { Constraint, ParsedConstraints } from '../types';

const CONSTRAINT_KEYWORDS: Record<string, { category: Constraint['category']; weight: number }> = {
  budget: { category: 'budget', weight: 0.9 },
  cost: { category: 'budget', weight: 0.9 },
  cheap: { category: 'budget', weight: 0.8 },
  expensive: { category: 'budget', weight: 0.8 },
  performance: { category: 'performance', weight: 0.9 },
  latency: { category: 'performance', weight: 0.9 },
  fast: { category: 'performance', weight: 0.8 },
  slow: { category: 'performance', weight: 0.7 },
  scale: { category: 'scalability', weight: 0.9 },
  scalable: { category: 'scalability', weight: 0.9 },
  growth: { category: 'scalability', weight: 0.8 },
  team: { category: 'team', weight: 0.8 },
  people: { category: 'team', weight: 0.8 },
  startup: { category: 'team', weight: 0.7 },
  ops: { category: 'operational', weight: 0.8 },
  operations: { category: 'operational', weight: 0.8 },
  maintenance: { category: 'operational', weight: 0.8 },
};

export class RequirementParser {
  parse(input: string): ParsedConstraints {
    const constraints: Constraint[] = [];
    const lowerInput = input.toLowerCase();
    const words = lowerInput.split(/[\s,;]+/);

    const seen = new Set<string>();

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const keywordMatch = CONSTRAINT_KEYWORDS[word];

      if (keywordMatch && !seen.has(word)) {
        seen.add(word);
        const value = this.extractValue(words, i);

        constraints.push({
          name: word,
          value: value || 'high',
          weight: keywordMatch.weight,
          category: keywordMatch.category,
        });
      }
    }

    // Normalize weights
    if (constraints.length > 0) {
      const totalWeight = constraints.reduce((sum, c) => sum + c.weight, 0);
      constraints.forEach((c) => {
        c.weight = c.weight / totalWeight;
      });
    }

    return {
      constraints,
      rawInput: input,
      confidence: Math.min(constraints.length / 5, 1),
      clarifications: this.generateClarifications(constraints),
    };
  }

  private extractValue(words: string[], index: number): string | null {
    const nextWord = words[index + 1];
    if (nextWord && !CONSTRAINT_KEYWORDS[nextWord]) {
      return nextWord;
    }
    return null;
  }

  private generateClarifications(constraints: Constraint[]): string[] {
    const clarifications: string[] = [];

    if (constraints.length < 2) {
      clarifications.push('Could you provide more constraints to help narrow down options?');
    }

    const hasTeamSize = constraints.some((c) => c.category === 'team');
    if (!hasTeamSize) {
      clarifications.push('What is your team size? (affects operational overhead)');
    }

    const hasBudget = constraints.some((c) => c.category === 'budget');
    if (!hasBudget) {
      clarifications.push('What is your budget range? (affects technology choices)');
    }

    return clarifications;
  }
}
