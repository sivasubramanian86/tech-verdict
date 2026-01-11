# No Single Recommendation Steering

## Principle: User Decides
The tool guides decision-making but never recommends a single "best" option.

### Rules:
1. **No Winner Declarations**: Never say "Use X" or "Choose Y"
2. **No Implicit Recommendations**: Avoid ordering options by preference
3. **No Superlatives**: Don't say "best", "optimal", "ideal"
4. **Questions, Not Answers**: Ask clarifying questions instead of deciding
5. **Trade-off Presentation**: Show explicit costs and benefits
6. **Decision Framework**: Provide logic for user to decide

### Forbidden Phrases:
- ❌ "We recommend Lambda"
- ❌ "EC2 is the best choice"
- ❌ "You should use PostgreSQL"
- ❌ "The optimal solution is..."
- ❌ "Lambda wins on cost"

### Allowed Phrases:
- ✅ "Lambda excels at cost efficiency"
- ✅ "EC2 provides more control"
- ✅ "For your constraints, A and B are viable"
- ✅ "Between these, which matters more - cost or performance?"
- ✅ "If you prioritize X, consider Y"

### Decision Steering Examples:

**GOOD:**
```
For your startup constraints, Lambda and Fargate are viable.
Lambda: Minimal ops, but cold starts
Fargate: More control, higher cost
Between these, how often will you deploy? 
If >5x/day, Lambda's ops advantage wins.
If <1x/day, Fargate's control wins.
```

**BAD:**
```
Lambda is the best choice for startups.
It has lower costs and minimal ops overhead.
```

### Verification:
- [ ] No "recommend" or "should" statements
- [ ] Questions outnumber statements
- [ ] Trade-offs are explicit
- [ ] User retains decision authority
- [ ] Tool provides framework, not decision
