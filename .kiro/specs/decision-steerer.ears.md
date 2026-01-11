# Decision Steerer EARS Specification

## Requirement 1: User-Guided Decision Path
**WHEN** user reviews comparisons
**THEN** the tool shall NOT recommend a winner
**AND** shall ask clarifying questions to narrow options
**AND** shall help user articulate their actual priority
**AND** shall guide user through decision logic without deciding for them

### Acceptance Criteria:
- No statements like "Use X" or "Choose Y"
- Questions are open-ended, not leading
- Questions help user clarify priorities
- User retains decision authority
- Tool provides decision framework, not decision

## Requirement 2: Constraint-Based Filtering
**WHEN** narrowing options
**THEN** the tool shall identify hard constraints (must-haves)
**AND** shall filter options that don't meet hard constraints
**AND** shall explain why options are filtered
**AND** shall present remaining options with trade-offs

### Acceptance Criteria:
- Hard constraints identified
- Filtering logic is transparent
- User understands why options are eliminated
- Remaining options are viable

## Requirement 3: Clarifying Questions
**WHEN** constraints are incomplete
**THEN** the tool shall ask targeted questions about:
  - Budget range (if not specified)
  - Team size (if not specified)
  - Performance requirements (if not specified)
  - Scalability needs (if not specified)
  - Operational capacity (if not specified)
**AND** shall limit to 3 most important questions
**AND** shall prioritize questions based on constraint variance

### Acceptance Criteria:
- Questions address missing constraints
- Maximum 3 questions per interaction
- Questions are specific and answerable
- Questions help narrow decision space
