import { Constraint, OptionScore, TradeOff } from '../types';

interface TechOption {
  name: string;
  attributes: Record<string, number>; // 0-1 scale
}

const TECH_DATABASE: Record<string, TechOption> = {
  lambda: {
    name: 'AWS Lambda',
    attributes: {
      cost: 0.9,
      scalability: 0.95,
      performance: 0.6,
      learning_curve: 0.7,
      operational_overhead: 0.95,
      customization: 0.3,
      cold_start: 0.4,
      team_size_friendly: 0.9,
    },
  },
  ec2: {
    name: 'AWS EC2',
    attributes: {
      cost: 0.4,
      scalability: 0.7,
      performance: 0.95,
      learning_curve: 0.4,
      operational_overhead: 0.2,
      customization: 0.95,
      cold_start: 1.0,
      team_size_friendly: 0.3,
    },
  },
  fargate: {
    name: 'AWS Fargate',
    attributes: {
      cost: 0.6,
      scalability: 0.9,
      performance: 0.85,
      learning_curve: 0.5,
      operational_overhead: 0.8,
      customization: 0.7,
      cold_start: 0.7,
      team_size_friendly: 0.7,
    },
  },
  postgresql: {
    name: 'PostgreSQL',
    attributes: {
      cost: 0.95,
      scalability: 0.7,
      performance: 0.85,
      learning_curve: 0.6,
      operational_overhead: 0.3,
      customization: 0.95,
      reliability: 0.95,
      team_size_friendly: 0.7,
    },
  },
  mongodb: {
    name: 'MongoDB',
    attributes: {
      cost: 0.7,
      scalability: 0.95,
      performance: 0.8,
      learning_curve: 0.8,
      operational_overhead: 0.6,
      customization: 0.8,
      reliability: 0.7,
      team_size_friendly: 0.8,
    },
  },
  dynamodb: {
    name: 'DynamoDB',
    attributes: {
      cost: 0.5,
      scalability: 0.99,
      performance: 0.95,
      learning_curve: 0.5,
      operational_overhead: 0.95,
      customization: 0.4,
      reliability: 0.99,
      team_size_friendly: 0.9,
    },
  },
};

export class ComparisonEngine {
  compare(options: string[], constraints: Constraint[]): OptionScore[] {
    return options.map((optionName) => {
      const tech = this.findTech(optionName);
      if (!tech) {
        throw new Error(`Unknown technology: ${optionName}`);
      }

      const scores = this.calculateScores(tech, constraints);
      const tradeoffs = this.generateTradeoffs(tech.name);
      const { bestFor, worstFor } = this.determineFit(tech);

      return {
        name: tech.name,
        scores,
        tradeoffs,
        bestFor,
        worstFor,
      };
    });
  }

  private findTech(name: string): TechOption | null {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return TECH_DATABASE[key] || null;
  }

  private calculateScores(tech: TechOption, constraints: Constraint[]): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const [attr, value] of Object.entries(tech.attributes)) {
      const relevantConstraints = constraints.filter(
        (c) => c.category === attr || attr.includes(c.name.toLowerCase())
      );

      if (relevantConstraints.length > 0) {
        const avgWeight = relevantConstraints.reduce((sum, c) => sum + c.weight, 0) / relevantConstraints.length;
        scores[attr] = value * avgWeight;
      } else {
        scores[attr] = value;
      }
    }

    return scores;
  }

  private generateTradeoffs(techName: string): TradeOff[] {
    const tradeoffMap: Record<string, TradeOff[]> = {
      'AWS Lambda': [
        {
          benefit: 'Minimal operational overhead',
          cost: 'Cold starts ~500ms on first invocation',
          confidence: 'high',
          dataSource: 'AWS documentation',
        },
        {
          benefit: 'Pay-per-use pricing',
          cost: 'Unpredictable costs at scale (>1M requests/month)',
          confidence: 'high',
          dataSource: 'AWS pricing calculator',
        },
        {
          benefit: 'Automatic scaling',
          cost: 'Limited customization of runtime environment',
          confidence: 'high',
          dataSource: 'AWS Lambda limits',
        },
      ],
      'AWS EC2': [
        {
          benefit: 'Full control and customization',
          cost: 'Requires manual scaling and ops management',
          confidence: 'high',
          dataSource: 'AWS best practices',
        },
        {
          benefit: 'Predictable, always-on performance',
          cost: 'Higher baseline costs even at low utilization',
          confidence: 'high',
          dataSource: 'AWS pricing',
        },
        {
          benefit: 'Stateful applications supported',
          cost: 'Requires team expertise in DevOps',
          confidence: 'high',
          dataSource: 'Industry standards',
        },
      ],
      'AWS Fargate': [
        {
          benefit: 'Container abstraction without server management',
          cost: 'Higher per-container costs than EC2',
          confidence: 'high',
          dataSource: 'AWS pricing comparison',
        },
        {
          benefit: 'Automatic scaling with containers',
          cost: 'Less control than EC2, more than Lambda',
          confidence: 'medium',
          dataSource: 'AWS documentation',
        },
        {
          benefit: 'Good for microservices',
          cost: 'Requires Docker/container knowledge',
          confidence: 'high',
          dataSource: 'Industry best practices',
        },
      ],
      PostgreSQL: [
        {
          benefit: 'Open-source, zero licensing costs',
          cost: 'Requires self-hosting or managed service costs',
          confidence: 'high',
          dataSource: 'PostgreSQL documentation',
        },
        {
          benefit: 'ACID compliance and reliability',
          cost: 'Vertical scaling limits, horizontal scaling complex',
          confidence: 'high',
          dataSource: 'Database theory',
        },
        {
          benefit: 'Rich query language and features',
          cost: 'Steeper learning curve than NoSQL',
          confidence: 'medium',
          dataSource: 'Developer surveys',
        },
      ],
      MongoDB: [
        {
          benefit: 'Flexible schema and horizontal scaling',
          cost: 'Eventual consistency by default',
          confidence: 'high',
          dataSource: 'MongoDB documentation',
        },
        {
          benefit: 'Easy to learn for developers',
          cost: 'Higher memory footprint than relational DBs',
          confidence: 'medium',
          dataSource: 'Performance benchmarks',
        },
        {
          benefit: 'Great for rapid prototyping',
          cost: 'Data duplication and storage overhead',
          confidence: 'high',
          dataSource: 'MongoDB best practices',
        },
      ],
      DynamoDB: [
        {
          benefit: 'Fully managed, automatic scaling',
          cost: 'Vendor lock-in to AWS',
          confidence: 'high',
          dataSource: 'AWS documentation',
        },
        {
          benefit: 'Predictable performance at any scale',
          cost: 'Limited query flexibility (no complex joins)',
          confidence: 'high',
          dataSource: 'DynamoDB limits',
        },
        {
          benefit: 'Pay-per-request pricing option',
          cost: 'Expensive for unpredictable workloads',
          confidence: 'medium',
          dataSource: 'AWS pricing',
        },
      ],
    };

    return tradeoffMap[techName] || [];
  }

  private determineFit(tech: TechOption): { bestFor: string; worstFor: string } {
    const bestAttr = Object.entries(tech.attributes).sort(([, a], [, b]) => b - a)[0];
    const worstAttr = Object.entries(tech.attributes).sort(([, a], [, b]) => a - b)[0];

    return {
      bestFor: `Use if you prioritize ${bestAttr[0].replace(/_/g, ' ')}`,
      worstFor: `Avoid if ${worstAttr[0].replace(/_/g, ' ')} is critical`,
    };
  }
}
