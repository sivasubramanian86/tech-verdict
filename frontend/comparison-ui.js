export class ComparisonUI {
    constructor() {
        this.options = [];
        this.setupEventListeners();
    }
    setupEventListeners() {
        const optionInput = document.getElementById('optionInput');
        if (optionInput) {
            optionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter')
                    this.addOption();
            });
        }
    }
    addOption() {
        const input = document.getElementById('optionInput');
        const value = input.value.trim();
        if (value && !this.options.includes(value)) {
            this.options.push(value);
            this.renderOptions();
            input.value = '';
        }
    }
    removeOption(option) {
        this.options = this.options.filter(o => o !== option);
        this.renderOptions();
    }
    renderOptions() {
        const container = document.getElementById('optionsContainer');
        if (!container)
            return;
        container.innerHTML = this.options.map(opt => `
      <div class="option-tag">
        ${opt}
        <button onclick="ui.removeOption('${opt}')">×</button>
      </div>
    `).join('');
    }
    async compare() {
        const constraints = document.getElementById('constraints').value.trim();
        const resultsDiv = document.getElementById('results');
        if (!constraints) {
            resultsDiv.innerHTML = '<div class="error">Please enter your constraints</div>';
            return;
        }
        if (this.options.length < 2) {
            resultsDiv.innerHTML = '<div class="error">Please add at least 2 technologies to compare</div>';
            return;
        }
        resultsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing options...</p></div>';
        try {
            const response = await fetch('/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ constraints, options: this.options })
            });
            if (!response.ok)
                throw new Error('Comparison failed');
            const data = await response.json();
            this.renderResults(data);
        }
        catch (error) {
            resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }
    renderResults(data) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv)
            return;
        let html = `
      <div class="decision-section">
        <div class="decision-title">📊 Decision Guidance</div>
        <div class="next-question">${data.nextQuestion}</div>
        ${data.clarifyingQuestions.length > 0 ? `
          <div class="clarifying-questions">
            <strong style="color: #333;">Consider these questions:</strong>
            ${data.clarifyingQuestions.map((q) => `<div class="question">• ${q}</div>`).join('')}
          </div>
        ` : ''}
      </div>
      <div class="results">
    `;
        data.options.forEach((option) => {
            html += `
        <div class="option-card">
          <div class="option-name">${option.name}</div>
          <div class="scores">
            ${Object.entries(option.scores).slice(0, 5).map(([key, value]) => `
              <div class="score-item">
                <span class="score-label">${key.replace(/_/g, ' ')}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${value * 100}%"></div>
                </div>
                <span class="score-value">${(value * 100).toFixed(0)}%</span>
              </div>
            `).join('')}
          </div>
          <div class="tradeoffs">
            <strong style="color: #333; display: block; margin-bottom: 10px;">Trade-offs:</strong>
            ${option.tradeoffs.map((t) => `
              <div class="tradeoff">
                <div class="benefit">✓ ${t.benefit}</div>
                <div class="cost">✗ ${t.cost}</div>
                <div class="confidence">Confidence: ${t.confidence}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
        });
        html += '</div>';
        resultsDiv.innerHTML = html;
    }
}
// Initialize UI
const ui = new ComparisonUI();
//# sourceMappingURL=comparison-ui.js.map