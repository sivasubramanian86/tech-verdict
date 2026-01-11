import { Constraint } from './constraint';

export interface TradeOff {
  benefit: string;
  cost: string;
  confidence: 'high' | 'medium' | 'low';
  dataSource?: string;
}

export interface OptionScore {
  name: string;
  scores: Record<string, number>; // 0-1 scale
  tradeoffs: TradeOff[];
  bestFor: string;
  worstFor: string;
}

export interface ComparisonResult {
  requirements: Constraint[];
  options: OptionScore[];
  nextQuestion: string;
  clarifyingQuestions: string[];
}
