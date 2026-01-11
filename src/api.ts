import express, { Request, Response } from 'express';
import path from 'path';
import { ComparisonOrchestrator } from './orchestrator/comparison-orchestrator';
import { ComparisonResult } from './types';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const orchestrator = new ComparisonOrchestrator();

// Agent 1: Parse Constraints
app.post('/api/parse-constraints', async (req: Request, res: Response) => {
  try {
    const constraints = req.body;
    const result = await orchestrator.parseConstraintsWithAI(constraints);
    res.json(result);
  } catch (error) {
    console.error('Parse constraints error:', error);
    res.status(500).json({ error: 'Failed to parse constraints' });
  }
});

// Agent 2: Compare Options
app.post('/api/compare-options', async (req: Request, res: Response) => {
  try {
    const { options } = req.body;
    const result = await orchestrator.compareOptionsWithAI({}, options);
    res.json(result);
  } catch (error) {
    console.error('Compare options error:', error);
    res.status(500).json({ error: 'Failed to compare options' });
  }
});

// Agent 3: Analyze Trade-offs
app.post('/api/analyze-tradeoffs', async (req: Request, res: Response) => {
  try {
    const { option } = req.body;
    const mockData = await orchestrator.orchestrate('mock', [option]);
    const optionData = mockData.options[0];
    
    const result = {
      option: option,
      fit_score: Math.round(optionData.scores.overall * 100),
      fit_level: optionData.scores.overall > 0.8 ? 'excellent' : 'good',
      gains: optionData.tradeoffs.map(t => ({
        benefit: t.benefit,
        impact: 90,
        explanation: `${t.benefit} - detailed analysis based on your constraints`
      })),
      losses: optionData.tradeoffs.map(t => ({
        trade_off: t.cost,
        severity: 45,
        explanation: `${t.cost} - impact assessment for your use case`
      })),
      when_wins: optionData.bestFor,
      when_loses: optionData.worstFor,
      recommendation_for_your_case: `${option} is a strong fit based on your constraints`
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze trade-offs' });
  }
});

// Agent 4: Decision Guidance
app.post('/api/get-guidance', async (req: Request, res: Response) => {
  try {
    const result = {
      current_status: 'Analyzing your technology options',
      key_question: 'Which factor is most important for your project success?',
      question_options: [
        {
          position: 'left',
          emoji: '💰',
          label: 'Cost Optimization',
          description: 'Minimize operational expenses and infrastructure costs',
          supports_option: 'Cost-effective solutions'
        },
        {
          position: 'right',
          emoji: '⚡',
          label: 'Performance',
          description: 'Maximize speed, reliability, and user experience',
          supports_option: 'High-performance solutions'
        }
      ],
      hints: [
        'Your budget constraints favor serverless solutions',
        'Consider long-term maintenance costs',
        'Evaluate team expertise and learning curve'
      ],
      suggested_next_option_to_compare: 'Consider hybrid approaches',
      decision_path: ['Define constraints', 'Compare options', 'Analyze trades', 'Make decision']
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to provide guidance' });
  }
});

// Legacy endpoint for backward compatibility
app.post('/compare', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.constraints || !body.options || body.options.length < 2) {
      return res.status(400).json({ error: 'Missing constraints or options' });
    }
    const result: ComparisonResult = await orchestrator.orchestrate(body.constraints, body.options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Tech Verdict API', version: '1.0.0', endpoints: ['/api/parse-constraints', '/api/compare-options', '/api/analyze-tradeoffs', '/api/get-guidance'] });
});

export default app;
