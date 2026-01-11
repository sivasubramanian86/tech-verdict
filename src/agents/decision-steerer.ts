import { Constraint, OptionScore } from '../types';

export class DecisionSteerer {
  steer(options: OptionScore[], constraints: Constraint[]): { nextQuestion: string; clarifyingQuestions: string[] } {
    const nextQuestion = this.generateNextQuestion(options, constraints);
    const clarifyingQuestions = this.generateClarifyingQuestions(options, constraints);

    return { nextQuestion, clarifyingQuestions };
  }

  private generateNextQuestion(options: OptionScore[], constraints: Constraint[]): string {
    if (options.length === 0) {
      return 'Please provide at least one technology option to compare.';
    }

    if (options.length === 1) {
      return `You've selected ${options[0].name}. What specific concerns do you have about this choice?`;
    }

    // Find the most differentiating constraint
    const constraintsByVariance = this.rankConstraintsByVariance(options, constraints);

    if (constraintsByVariance.length > 0) {
      const topConstraint = constraintsByVariance[0];
      const scores = options.map((o) => o.scores[topConstraint] || 0);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      if (maxScore - minScore > 0.3) {
        const topOptions = options
          .filter((o) => (o.scores[topConstraint] || 0) > maxScore - 0.1)
          .map((o) => o.name)
          .join(' and ');

        return `For ${topConstraint}, ${topOptions} excel. Between these, which matters more to you - cost or performance?`;
      }
    }

    return `Between ${options.map((o) => o.name).join(' and ')}, which aligns best with your team's expertise?`;
  }

  private rankConstraintsByVariance(options: OptionScore[], constraints: Constraint[]): string[] {
    const variances: Array<{ constraint: string; variance: number }> = [];

    for (const constraint of constraints) {
      const scores = options.map((o) => o.scores[constraint.name] || 0);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
      variances.push({ constraint: constraint.name, variance });
    }

    return variances.sort((a, b) => b.variance - a.variance).map((v) => v.constraint);
  }

  private generateClarifyingQuestions(options: OptionScore[], constraints: Constraint[]): string[] {
    const questions: string[] = [];

    // Budget clarification
    const hasBudgetConstraint = constraints.some((c) => c.category === 'budget');
    if (!hasBudgetConstraint) {
      questions.push('What is your budget range? (affects cost-benefit analysis)');
    }

    // Team size clarification
    const hasTeamConstraint = constraints.some((c) => c.category === 'team');
    if (!hasTeamConstraint) {
      questions.push('How many engineers will maintain this? (affects operational overhead)');
    }

    // Performance clarification
    const hasPerformanceConstraint = constraints.some((c) => c.category === 'performance');
    if (!hasPerformanceConstraint) {
      questions.push('What are your latency requirements? (affects technology choice)');
    }

    // Scalability clarification
    const hasScalabilityConstraint = constraints.some((c) => c.category === 'scalability');
    if (!hasScalabilityConstraint) {
      questions.push('What is your expected user growth? (affects scalability needs)');
    }

    // Operational clarification
    const hasOperationalConstraint = constraints.some((c) => c.category === 'operational');
    if (!hasOperationalConstraint) {
      questions.push('How much operational overhead can your team handle? (affects managed vs self-hosted)');
    }

    return questions.slice(0, 3); // Return top 3
  }

  generateDecisionPath(options: OptionScore[], constraints: Constraint[]): string {
    const lines: string[] = [];

    lines.push('DECISION PATH:');
    lines.push('');

    // Filter by hard constraints
    const filtered = this.filterByHardConstraints(options, constraints);
    if (filtered.length < options.length) {
      lines.push(
        `✓ Based on your constraints, ${filtered.map((o) => o.name).join(' and ')} are viable.`
      );
      lines.push(`✗ ${options.filter((o) => !filtered.includes(o)).map((o) => o.name).join(', ')} don't meet your requirements.`);
      lines.push('');
    }

    // Highlight trade-offs
    lines.push('KEY TRADE-OFFS:');
    for (const option of filtered) {
      lines.push(`\n${option.name}:`);
      option.tradeoffs.slice(0, 2).forEach((t) => {
        lines.push(`  ✓ ${t.benefit}`);
        lines.push(`  ✗ ${t.cost}`);
      });
    }

    return lines.join('\n');
  }

  private filterByHardConstraints(options: OptionScore[], constraints: Constraint[]): OptionScore[] {
    // Filter options that don't meet critical constraints
    return options.filter((option) => {
      const criticalConstraints = constraints.filter((c) => c.weight > 0.7);
      return criticalConstraints.every((c) => {
        const score = option.scores[c.name] || 0;
        return score > 0.3; // Minimum threshold
      });
    });
  }
}
