import { Constraint, OptionScore, TradeOff } from '../types';

export class TradeOffAnalyzer {
  analyze(options: OptionScore[], constraints: Constraint[]): OptionScore[] {
    return options.map((option) => {
      const enhancedTradeoffs = this.enrichTradeoffs(option, constraints);
      return {
        ...option,
        tradeoffs: enhancedTradeoffs,
      };
    });
  }

  private enrichTradeoffs(option: OptionScore, constraints: Constraint[]): TradeOff[] {
    const baseTradeoffs = option.tradeoffs;

    // Add constraint-specific trade-offs
    const constraintTradeoffs = this.generateConstraintTradeoffs(option.name, constraints);

    // Combine and deduplicate
    const combined = [...baseTradeoffs, ...constraintTradeoffs];
    const unique = Array.from(
      new Map(combined.map((t) => [t.benefit + t.cost, t])).values()
    );

    return unique.slice(0, 5); // Limit to top 5
  }

  private generateConstraintTradeoffs(techName: string, constraints: Constraint[]): TradeOff[] {
    const tradeoffs: TradeOff[] = [];

    for (const constraint of constraints) {
      const tradeoff = this.mapConstraintToTradeoff(techName, constraint);
      if (tradeoff) {
        tradeoffs.push(tradeoff);
      }
    }

    return tradeoffs;
  }

  private mapConstraintToTradeoff(techName: string, constraint: Constraint): TradeOff | null {
    const key = `${techName}:${constraint.category}`;

    const tradeoffMap: Record<string, TradeOff> = {
      'AWS Lambda:budget': {
        benefit: 'No upfront infrastructure costs',
        cost: 'Costs scale with request volume (can exceed EC2 at high scale)',
        confidence: 'high',
        dataSource: 'AWS pricing calculator',
      },
      'AWS Lambda:team': {
        benefit: 'Minimal DevOps overhead for small teams',
        cost: 'Debugging and monitoring require specialized tools',
        confidence: 'medium',
        dataSource: 'Developer experience reports',
      },
      'AWS EC2:budget': {
        benefit: 'Predictable monthly costs',
        cost: 'High baseline cost even with low utilization',
        confidence: 'high',
        dataSource: 'AWS pricing',
      },
      'AWS EC2:team': {
        benefit: 'Full control for experienced teams',
        cost: 'Requires dedicated DevOps expertise',
        confidence: 'high',
        dataSource: 'Industry standards',
      },
      'AWS Fargate:budget': {
        benefit: 'Pay-per-container-second model',
        cost: 'More expensive than EC2 per unit, less than Lambda',
        confidence: 'high',
        dataSource: 'AWS pricing comparison',
      },
      'AWS Fargate:team': {
        benefit: 'Reduced infrastructure management',
        cost: 'Requires Docker and container orchestration knowledge',
        confidence: 'high',
        dataSource: 'AWS best practices',
      },
      'PostgreSQL:budget': {
        benefit: 'Open-source, no licensing fees',
        cost: 'Hosting and backup infrastructure costs',
        confidence: 'high',
        dataSource: 'PostgreSQL documentation',
      },
      'PostgreSQL:scalability': {
        benefit: 'Excellent for structured data',
        cost: 'Horizontal scaling requires sharding (complex)',
        confidence: 'high',
        dataSource: 'Database architecture',
      },
      'MongoDB:scalability': {
        benefit: 'Built-in horizontal scaling via sharding',
        cost: 'Increased operational complexity',
        confidence: 'high',
        dataSource: 'MongoDB documentation',
      },
      'MongoDB:budget': {
        benefit: 'Open-source option available',
        cost: 'Atlas managed service can be expensive at scale',
        confidence: 'medium',
        dataSource: 'MongoDB pricing',
      },
      'DynamoDB:budget': {
        benefit: 'Fully managed, no infrastructure costs',
        cost: 'Pay-per-request can be expensive for unpredictable workloads',
        confidence: 'high',
        dataSource: 'AWS pricing calculator',
      },
      'DynamoDB:scalability': {
        benefit: 'Unlimited automatic scaling',
        cost: 'Limited query patterns (no complex joins)',
        confidence: 'high',
        dataSource: 'DynamoDB limits',
      },
    };

    return tradeoffMap[key] || null;
  }

  summarizeTradeoffs(options: OptionScore[]): string {
    return options
      .map((option) => {
        const tradeoffSummary = option.tradeoffs
          .map((t) => `  • ${t.benefit} vs ${t.cost} (${t.confidence})`)
          .join('\n');

        return `${option.name}:\n${tradeoffSummary}`;
      })
      .join('\n\n');
  }
}
