export interface AIProvider {
  name: string;
  generateInsight(prompt: string): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  async generateInsight(prompt: string): Promise<string> {
    if (!this.apiKey) {
      return `Gemini: ${prompt.substring(0, 50)}... (API key not configured)`;
    }

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    } catch (error) {
      console.error('Gemini API error:', error);
      return `Gemini fallback: ${prompt.substring(0, 50)}...`;
    }
  }
}

export class ClaudeProvider implements AIProvider {
  name = 'Claude';

  async generateInsight(prompt: string): Promise<string> {
    return `Claude: ${prompt.substring(0, 50)}...`;
  }
}

export class LocalLLMProvider implements AIProvider {
  name = 'Local LLM';

  async generateInsight(prompt: string): Promise<string> {
    return `Local: ${prompt.substring(0, 50)}...`;
  }
}

export class AIProviderFactory {
  static getProvider(name: string): AIProvider {
    switch (name.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider();
      case 'claude':
        return new ClaudeProvider();
      case 'local':
        return new LocalLLMProvider();
      default:
        return new GeminiProvider();
    }
  }
}
