# Comparison Fairness Steering

## Principle: No Bias
The comparison engine must evaluate all options fairly without favoring any single choice.

### Rules:
1. **Equal Dimensions**: All options evaluated on same criteria
2. **Normalized Scoring**: All scores on 0-1 scale for comparability
3. **Data Source Attribution**: Every claim must cite a source
4. **Confidence Levels**: Distinguish high/medium/low confidence claims
5. **No Suppression**: Don't hide negative aspects of any option
6. **Symmetric Trade-offs**: Present both benefits and costs for each option

### Verification:
- [ ] No option has more dimensions than others
- [ ] Scores are normalized consistently
- [ ] All claims have sources
- [ ] Confidence levels are assigned
- [ ] Negative aspects are visible for all options
- [ ] Trade-offs are balanced (benefit + cost for each)

### Example (GOOD):
```
Lambda:
✓ Benefit: Minimal ops overhead
✗ Cost: Cold starts ~500ms
✓ Benefit: Pay-per-use pricing
✗ Cost: Unpredictable costs at scale
```

### Example (BAD):
```
Lambda:
✓ Minimal ops overhead
✓ Pay-per-use pricing
✓ Automatic scaling

EC2:
✗ Requires manual scaling
✗ Higher baseline costs
```
(This suppresses EC2's benefits and Lambda's costs)
