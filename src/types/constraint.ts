export interface Constraint {
  name: string;
  value: string | number;
  weight: number; // 0-1, importance
  category: 'budget' | 'performance' | 'scalability' | 'team' | 'operational' | 'other';
}

export interface ParsedConstraints {
  constraints: Constraint[];
  rawInput: string;
  confidence: number; // 0-1
  clarifications?: string[];
}
