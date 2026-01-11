# Requirement Parser EARS Specification

## Requirement 1: Constraint Extraction
**WHEN** a user provides constraints in natural language (e.g., "low budget, high scalability, 5 person team")
**THEN** the parser shall extract constraint tokens and categorize them
**AND** shall assign relative weights based on keyword frequency and emphasis
**AND** shall return a ParsedConstraints object with confidence score

### Acceptance Criteria:
- Parser identifies at least 80% of explicit constraints
- Weights sum to 1.0 (normalized)
- Confidence score reflects number of constraints parsed
- Handles synonyms (e.g., "cost" = "budget", "fast" = "performance")

## Requirement 2: Constraint Confirmation
**WHEN** constraints are parsed
**THEN** the parser shall generate clarifying questions for missing categories
**AND** shall confirm parsed constraints with the user before proceeding
**AND** shall allow user to adjust weights or add constraints

### Acceptance Criteria:
- Clarifications generated for missing budget, team, performance, scalability
- User can confirm or modify parsed constraints
- System waits for confirmation before comparison

## Requirement 3: Weight Normalization
**WHEN** multiple constraints are parsed
**THEN** the parser shall normalize weights so they sum to 1.0
**AND** shall preserve relative importance relationships
**AND** shall handle edge cases (single constraint, duplicate keywords)

### Acceptance Criteria:
- Sum of weights = 1.0 ± 0.01
- Relative ordering preserved
- No division by zero errors
