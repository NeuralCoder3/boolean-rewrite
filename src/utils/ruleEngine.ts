import type { BooleanExpression, TransformationRule } from '../types/boolean';
import { parseBooleanExpression } from './parser';

export class RuleEngine {
  private rules: TransformationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules() {
    // Commutativity rules
    this.rules.push({
      id: 'commutativity-and',
      name: 'Commutativity of AND',
      description: '𝜑 ∧ 𝜓 ≡ 𝜓 ∧ 𝜑',
      category: 'commutativity',
      leftPattern: 'A ∧ B',
      rightPattern: 'B ∧ A',
      variables: ['A', 'B']
    });

    this.rules.push({
      id: 'commutativity-or',
      name: 'Commutativity of OR',
      description: '𝜑 ∨ 𝜓 ≡ 𝜓 ∨ 𝜑',
      category: 'commutativity',
      leftPattern: 'A ∨ B',
      rightPattern: 'B ∨ A',
      variables: ['A', 'B']
    });

    // Associativity rules
    this.rules.push({
      id: 'associativity-and',
      name: 'Associativity of AND',
      description: '𝜑 ∧ (𝜓 ∧ 𝜒) ≡ (𝜑 ∧ 𝜓) ∧ 𝜒',
      category: 'associativity',
      leftPattern: 'A ∧ (B ∧ C)',
      rightPattern: '(A ∧ B) ∧ C',
      variables: ['A', 'B', 'C']
    });

    this.rules.push({
      id: 'associativity-or',
      name: 'Associativity of OR',
      description: '𝜑 ∨ (𝜓 ∨ 𝜒) ≡ (𝜑 ∨ 𝜓) ∨ 𝜒',
      category: 'associativity',
      leftPattern: 'A ∨ (B ∨ C)',
      rightPattern: '(A ∨ B) ∨ C',
      variables: ['A', 'B', 'C']
    });

    // Distributivity rules
    this.rules.push({
      id: 'distributivity-and-over-or',
      name: 'Distributivity of AND over OR',
      description: '𝜑 ∧ (𝜓 ∨ 𝜒) ≡ (𝜑 ∧ 𝜓) ∨ (𝜑 ∧ 𝜒)',
      category: 'distributivity',
      leftPattern: 'A ∧ (B ∨ C)',
      rightPattern: '(A ∧ B) ∨ (A ∧ C)',
      variables: ['A', 'B', 'C']
    });

    this.rules.push({
      id: 'distributivity-or-over-and',
      name: 'Distributivity of OR over AND',
      description: '𝜑 ∨ (𝜓 ∧ 𝜒) ≡ (𝜑 ∨ 𝜓) ∧ (𝜑 ∨ 𝜒)',
      category: 'distributivity',
      leftPattern: 'A ∨ (B ∧ C)',
      rightPattern: '(A ∨ B) ∧ (A ∨ C)',
      variables: ['A', 'B', 'C']
    });

    this.rules.push({
      id: 'distributivity-and-over-or-right',
      name: 'Distributivity of AND over OR (Right)',
      description: '(𝜑 ∨ 𝜓) ∧ 𝜒 ≡ (𝜑 ∧ 𝜒) ∨ (𝜓 ∧ 𝜒)',
      category: 'distributivity',
      leftPattern: '(A ∨ B) ∧ C',
      rightPattern: '(A ∧ C) ∨ (B ∧ C)',
      variables: ['A', 'B', 'C']
    });

    this.rules.push({
      id: 'distributivity-or-over-and-right',
      name: 'Distributivity of OR over AND (Right)',
      description: '(𝜑 ∧ 𝜓) ∨ 𝜒 ≡ (𝜑 ∨ 𝜒) ∧ (𝜓 ∨ 𝜒)',
      category: 'distributivity',
      leftPattern: '(A ∧ B) ∨ C',
      rightPattern: '(A ∨ C) ∧ (B ∨ C)',
      variables: ['A', 'B', 'C']
    });

    // Factoring rules (reverse of distributivity)
    this.rules.push({
      id: 'factoring-and-over-or',
      name: 'Factoring AND over OR',
      description: '(𝜑 ∧ 𝜓) ∨ (𝜑 ∧ 𝜒) ≡ 𝜑 ∧ (𝜓 ∨ 𝜒)',
      category: 'distributivity',
      leftPattern: '(A ∧ B) ∨ (A ∧ C)',
      rightPattern: 'A ∧ (B ∨ C)',
      variables: ['A', 'B', 'C']
    });

    this.rules.push({
      id: 'factoring-or-over-and',
      name: 'Factoring OR over AND',
      description: '(𝜑 ∨ 𝜓) ∧ (𝜑 ∨ 𝜒) ≡ 𝜑 ∨ (𝜓 ∧ 𝜒)',
      category: 'distributivity',
      leftPattern: '(A ∨ B) ∧ (A ∨ C)',
      rightPattern: 'A ∨ (B ∧ C)',
      variables: ['A', 'B', 'C']
    });

    // De Morgan's laws
    this.rules.push({
      id: 'de-morgan-and',
      name: 'De Morgan\'s Law for AND',
      description: '¬(𝜑 ∧ 𝜓) ≡ ¬𝜑 ∨ ¬𝜓',
      category: 'deMorgan',
      leftPattern: '¬(A ∧ B)',
      rightPattern: '¬A ∨ ¬B',
      variables: ['A', 'B']
    });

    this.rules.push({
      id: 'de-morgan-or',
      name: 'De Morgan\'s Law for OR',
      description: '¬(𝜑 ∨ 𝜓) ≡ ¬𝜑 ∧ ¬𝜓',
      category: 'deMorgan',
      leftPattern: '¬(A ∨ B)',
      rightPattern: '¬A ∧ ¬B',
      variables: ['A', 'B']
    });

    this.rules.push({
      id: 'de-morgan-top',
      name: 'De Morgan for Top',
      description: '¬⊤ ≡ ⊥',
      category: 'deMorgan',
      leftPattern: '¬true',
      rightPattern: 'false',
      variables: []
    });

    this.rules.push({
      id: 'de-morgan-bottom',
      name: 'De Morgan for Bottom',
      description: '¬⊥ ≡ ⊤',
      category: 'deMorgan',
      leftPattern: '¬false',
      rightPattern: 'true',
      variables: []
    });

    // Definability rules
    this.rules.push({
      id: 'implication-definition',
      name: 'Implication Definition',
      description: '𝜑 → 𝜓 ≡ ¬𝜑 ∨ 𝜓',
      category: 'definability',
      leftPattern: 'A → B',
      rightPattern: '¬A ∨ B',
      variables: ['A', 'B']
    });

    this.rules.push({
      id: 'negation-definition',
      name: 'Negation Definition',
      description: '¬𝜑 ≡ 𝜑 → ⊥',
      category: 'definability',
      leftPattern: '¬A',
      rightPattern: 'A → false',
      variables: ['A']
    });

    // Contraposition
    this.rules.push({
      id: 'contraposition',
      name: 'Contraposition',
      description: '𝜑 → 𝜓 ≡ ¬𝜓 → ¬𝜑',
      category: 'contraposition',
      leftPattern: 'A → B',
      rightPattern: '¬B → ¬A',
      variables: ['A', 'B']
    });

    // Absorption rules
    this.rules.push({
      id: 'absorption-and',
      name: 'Absorption for AND',
      description: '𝜑 ∧ (𝜑 ∨ 𝜓) ≡ 𝜑',
      category: 'absorption',
      leftPattern: 'A ∧ (A ∨ B)',
      rightPattern: 'A',
      variables: ['A', 'B']
    });

    this.rules.push({
      id: 'absorption-or',
      name: 'Absorption for OR',
      description: '𝜑 ∨ (𝜑 ∧ 𝜓) ≡ 𝜑',
      category: 'absorption',
      leftPattern: 'A ∨ (A ∧ B)',
      rightPattern: 'A',
      variables: ['A', 'B']
    });

    // Idempotence rules
    this.rules.push({
      id: 'idempotence-and',
      name: 'Idempotence of AND',
      description: '𝜑 ∧ 𝜑 ≡ 𝜑',
      category: 'idempotence',
      leftPattern: 'A ∧ A',
      rightPattern: 'A',
      variables: ['A']
    });

    this.rules.push({
      id: 'idempotence-or',
      name: 'Idempotence of OR',
      description: '𝜑 ∨ 𝜑 ≡ 𝜑',
      category: 'idempotence',
      leftPattern: 'A ∨ A',
      rightPattern: 'A',
      variables: ['A']
    });

    // Identity rules
    this.rules.push({
      id: 'identity-and-top',
      name: 'Identity for AND with Top',
      description: '𝜑 ∧ ⊤ ≡ 𝜑 ≡ ⊤ ∧ 𝜑',
      category: 'identity',
      leftPattern: 'A ∧ true',
      rightPattern: 'A',
      variables: ['A']
    });

    this.rules.push({
      id: 'identity-or-bottom',
      name: 'Identity for OR with Bottom',
      description: '𝜑 ∨ ⊥ ≡ 𝜑 ≡ ⊥ ∨ 𝜑',
      category: 'identity',
      leftPattern: 'A ∨ false',
      rightPattern: 'A',
      variables: ['A']
    });

    this.rules.push({
      id: 'identity-top-implies',
      name: 'Top Implies Identity',
      description: '⊤ → 𝜑 ≡ 𝜑',
      category: 'identity',
      leftPattern: 'true → A',
      rightPattern: 'A',
      variables: ['A']
    });

    // Domination rules
    this.rules.push({
      id: 'domination-and-bottom',
      name: 'Domination for AND with Bottom',
      description: '𝜑 ∧ ⊥ ≡ ⊥ ≡ ⊥ ∧ 𝜑',
      category: 'domination',
      leftPattern: 'A ∧ false',
      rightPattern: 'false',
      variables: ['A']
    });

    this.rules.push({
      id: 'domination-or-top',
      name: 'Domination for OR with Top',
      description: '𝜑 ∨ ⊤ ≡ ⊤ ≡ ⊤ ∨ 𝜑',
      category: 'domination',
      leftPattern: 'A ∨ true',
      rightPattern: 'true',
      variables: ['A']
    });

    this.rules.push({
      id: 'domination-implies-top',
      name: 'Domination for Implies with Top',
      description: '𝜑 → ⊤ ≡ ⊤',
      category: 'domination',
      leftPattern: 'A → true',
      rightPattern: 'true',
      variables: ['A']
    });

    this.rules.push({
      id: 'domination-bottom-implies',
      name: 'Domination for Bottom Implies',
      description: '⊥ → 𝜑 ≡ ⊤',
      category: 'domination',
      leftPattern: 'false → A',
      rightPattern: 'true',
      variables: ['A']
    });

    // Complement rules
    this.rules.push({
      id: 'complement-or',
      name: 'Complement for OR',
      description: '𝜑 ∨ ¬𝜑 ≡ ⊤',
      category: 'complement',
      leftPattern: 'A ∨ ¬A',
      rightPattern: 'true',
      variables: ['A']
    });

    this.rules.push({
      id: 'complement-and',
      name: 'Complement for AND',
      description: '𝜑 ∧ ¬𝜑 ≡ ⊥',
      category: 'complement',
      leftPattern: 'A ∧ ¬A',
      rightPattern: 'false',
      variables: ['A']
    });

    // Double negation
    this.rules.push({
      id: 'double-negation',
      name: 'Double Negation',
      description: '¬¬𝜑 ≡ 𝜑',
      category: 'doubleNegation',
      leftPattern: '¬¬A',
      rightPattern: 'A',
      variables: ['A']
    });
  }

  getRules(): TransformationRule[] {
    return [...this.rules];
  }

  getApplicableRules(expression: BooleanExpression): TransformationRule[] {
    return this.rules.filter(rule => this.canApplyRule(expression, rule));
  }

  // New method to get all possible rule applications with details
  getAllPossibleApplications(expression: BooleanExpression): Array<{
    rule: TransformationRule;
    direction: 'left-to-right' | 'right-to-left';
    position: number[];
    description: string;
    fullPreview: string;
  }> {
    const applications: Array<{
      rule: TransformationRule;
      direction: 'left-to-right' | 'right-to-left';
      position: number[];
      description: string;
      fullPreview: string;
    }> = [];

    for (const rule of this.rules) {
      // Check left-to-right direction
      const leftPattern = parseBooleanExpression(rule.leftPattern);
      const leftToRightMatches = this.findAllMatches(expression, leftPattern);
      for (const match of leftToRightMatches) {
        const substitutedDescription = this.generateSubstitutedDescription(
          rule.leftPattern, 
          rule.rightPattern, 
          match.substitution,
          'left-to-right'
        );
        const fullPreview = this.generateFullExpressionPreview(
          expression,
          rule,
          'left-to-right',
          match.path,
          match.substitution
        );
        applications.push({
          rule,
          direction: 'left-to-right',
          position: match.path,
          description: substitutedDescription,
          fullPreview
        });
      }

      // Check right-to-left direction
      const rightPattern = parseBooleanExpression(rule.rightPattern);
      const rightToLeftMatches = this.findAllMatches(expression, rightPattern);
      for (const match of rightToLeftMatches) {
        const substitutedDescription = this.generateSubstitutedDescription(
          rule.rightPattern, 
          rule.leftPattern, 
          match.substitution,
          'right-to-left'
        );
        const fullPreview = this.generateFullExpressionPreview(
          expression,
          rule,
          'right-to-left',
          match.path,
          match.substitution
        );
        applications.push({
          rule,
          direction: 'right-to-left',
          position: match.path,
          description: substitutedDescription,
          fullPreview
        });
      }
    }

    // Deduplicate applications based on rule, direction, position, and description
    return this.deduplicateApplications(applications);
  }

  private deduplicateApplications(applications: Array<{
    rule: TransformationRule;
    direction: 'left-to-right' | 'right-to-left';
    position: number[];
    description: string;
    fullPreview: string;
  }>): Array<{
    rule: TransformationRule;
    direction: 'left-to-right' | 'right-to-left';
    position: number[];
    description: string;
    fullPreview: string;
  }> {
    const seen = new Set<string>();
    const unique: Array<typeof applications[0]> = [];
    
    for (const app of applications) {
      // Create a unique key that includes position to distinguish different applications
      // Only deduplicate if rule, direction, position, AND result are identical
      const key = `${app.rule.id}:${app.direction}:${app.position.join(',')}:${app.fullPreview}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(app);
      }
    }
    
    return unique;
  }

  private generateSubstitutedDescription(
    fromPattern: string, 
    toPattern: string, 
    substitution: Map<string, BooleanExpression>,
    direction: 'left-to-right' | 'right-to-left'
  ): string {
    // Parse the patterns to get proper expression structure
    const fromExpr = parseBooleanExpression(fromPattern);
    const toExpr = parseBooleanExpression(toPattern);
    
    // Apply substitutions to the parsed expressions
    const substitutedFrom = this.applySubstitutionToExpression(fromExpr, substitution);
    const substitutedTo = this.applySubstitutionToExpression(toExpr, substitution);
    
    // Convert back to strings with proper parentheses
    const fromStr = this.expressionToString(substitutedFrom);
    const toStr = this.expressionToString(substitutedTo);
    
    if (direction === 'left-to-right') {
      return `${fromStr} → ${toStr}`;
    } else {
      return `${fromStr} → ${toStr}`;
    }
  }

  // New method to generate full expression preview
  generateFullExpressionPreview(
    originalExpression: BooleanExpression,
    rule: TransformationRule,
    direction: 'left-to-right' | 'right-to-left',
    position: number[],
    substitution: Map<string, BooleanExpression>
  ): string {
    if (position.length === 0) {
      // Rule applies to the entire expression
      if (direction === 'left-to-right') {
        const toPattern = parseBooleanExpression(rule.rightPattern);
        return this.applySubstitutionToString(toPattern, substitution);
      } else {
        const toPattern = parseBooleanExpression(rule.leftPattern);
        return this.applySubstitutionToString(toPattern, substitution);
      }
    } else {
      // Rule applies to a subexpression - show the full transformed expression
      const transformedExpr = this.replaceSubexpressionAtPosition(
        originalExpression,
        position,
        rule,
        direction,
        substitution
      );
      return this.expressionToString(transformedExpr);
    }
  }

  private applySubstitutionToString(pattern: BooleanExpression, substitution: Map<string, BooleanExpression>): string {
    // Apply substitution to a parsed pattern and return as string
    const substituted = this.applySubstitutionToExpression(pattern, substitution);
    return this.expressionToString(substituted);
  }

  private applySubstitutionToExpression(
    expr: BooleanExpression, 
    substitution: Map<string, BooleanExpression>
  ): BooleanExpression {
    switch (expr.type) {
      case 'variable':
        return substitution.get(expr.value) || expr;
      case 'constant':
        return expr;
      case 'unary':
        return {
          type: 'unary',
          operator: expr.operator,
          operand: this.applySubstitutionToExpression(expr.operand, substitution)
        };
      case 'binary':
        return {
          type: 'binary',
          operator: expr.operator,
          left: this.applySubstitutionToExpression(expr.left, substitution),
          right: this.applySubstitutionToExpression(expr.right, substitution)
        };
    }
  }

  private replaceSubexpressionAtPosition(
    expression: BooleanExpression,
    position: number[],
    rule: TransformationRule,
    direction: 'left-to-right' | 'right-to-left',
    substitution: Map<string, BooleanExpression>
  ): BooleanExpression {
    if (position.length === 0) {
      // Apply to the entire expression
      if (direction === 'left-to-right') {
        const toPattern = parseBooleanExpression(rule.rightPattern);
        return this.applySubstitutionToExpression(toPattern, substitution);
      } else {
        const toPattern = parseBooleanExpression(rule.leftPattern);
        return this.applySubstitutionToExpression(toPattern, substitution);
      }
    }

    // Navigate to the subexpression position
    const currentPos = position[0];
    const remainingPos = position.slice(1);

    if (expression.type === 'unary') {
      if (currentPos === 0) {
        return {
          type: 'unary',
          operator: expression.operator,
          operand: this.replaceSubexpressionAtPosition(
            expression.operand,
            remainingPos,
            rule,
            direction,
            substitution
          )
        };
      }
    } else if (expression.type === 'binary') {
      if (currentPos === 0) {
        return {
          type: 'binary',
          operator: expression.operator,
          left: this.replaceSubexpressionAtPosition(
            expression.left,
            remainingPos,
            rule,
            direction,
            substitution
          ),
          right: expression.right
        };
      } else if (currentPos === 1) {
        return {
          type: 'binary',
          operator: expression.operator,
          left: expression.left,
          right: this.replaceSubexpressionAtPosition(
            expression.right,
            remainingPos,
            rule,
            direction,
            substitution
          )
        };
      }
    }

    return expression;
  }

  private expressionToString(expr: BooleanExpression): string {
    switch (expr.type) {
      case 'variable':
        return expr.value;
      case 'constant':
        // Convert ASCII constants to Unicode for display
        if (expr.value === 'true') return '⊤';
        if (expr.value === 'false') return '⊥';
        return expr.value;
      case 'unary': {
        // For unary expressions, we need to check if the operand needs parentheses
        const operandStr = this.expressionToString(expr.operand);
        if (expr.operand.type === 'binary') {
          // Binary operands of unary operators need parentheses
          return `¬(${operandStr})`;
        } else {
          // Variables, constants, and unary operands don't need parentheses
          return `¬${operandStr}`;
        }
      }
      case 'binary': {
        const leftStr = this.expressionToString(expr.left);
        const rightStr = this.expressionToString(expr.right);
        
        // Check if subexpressions need parentheses based on operator precedence
        const leftNeedsParens = this.needsParentheses(expr.left);
        const rightNeedsParens = this.needsParentheses(expr.right);
        
        const leftFormatted = leftNeedsParens ? `(${leftStr})` : leftStr;
        const rightFormatted = rightNeedsParens ? `(${rightStr})` : rightStr;
        
        return `${leftFormatted} ${expr.operator} ${rightFormatted}`;
      }
    }
  }

  private needsParentheses(subexpr: BooleanExpression): boolean {
    if (subexpr.type === 'variable' || subexpr.type === 'constant') {
      return false; // Variables and constants never need parentheses
    }
    
    if (subexpr.type === 'unary') {
      // Unary expressions need parentheses only when their operand is binary
      // ¬a doesn't need parentheses, but ¬(a ∧ b) does
      if (subexpr.operand.type === 'binary') {
        return true;
      }
      return false;
    }
    
    if (subexpr.type === 'binary') {
      // Always add parentheses around binary subexpressions when they're operands
      // This ensures clarity and prevents ambiguity
      // For example: a ∧ (b ∨ c) instead of a ∧ b ∨ c
      return true;
    }
    
    return false;
  }

  private findAllMatches(expression: BooleanExpression, pattern: BooleanExpression): Array<{ substitution: Map<string, BooleanExpression>, path: number[] }> {
    const matches: Array<{ substitution: Map<string, BooleanExpression>, path: number[] }> = [];
    
    // Check if the entire expression matches
    const fullMatch = this.unify(expression, pattern);
    if (fullMatch) {
      matches.push({ substitution: fullMatch, path: [] });
    }

    // Find all subexpression matches (excluding the root)
    this.findAllSubexpressionMatches(expression, pattern, [], matches);
    
    return matches;
  }

  private findAllSubexpressionMatches(
    expression: BooleanExpression, 
    pattern: BooleanExpression, 
    path: number[], 
    matches: Array<{ substitution: Map<string, BooleanExpression>, path: number[] }>
  ) {
    // Only check subexpressions, not the root expression
    if (path.length === 0) {
      // Skip root - it was already checked in findAllMatches
      // Continue searching deeper based on expression type
      if (expression.type === 'unary') {
        // Search in the operand
        this.findAllSubexpressionMatches(expression.operand, pattern, [...path, 0], matches);
      } else if (expression.type === 'binary') {
        // Search in both left and right subtrees
        this.findAllSubexpressionMatches(expression.left, pattern, [...path, 0], matches);
        this.findAllSubexpressionMatches(expression.right, pattern, [...path, 1], matches);
      }
      return;
    }

    // Check if this subexpression matches the pattern
    const substitution = this.unify(expression, pattern);
    if (substitution) {
      matches.push({ substitution, path });
    }

    // Continue searching deeper based on expression type
    if (expression.type === 'unary') {
      // Search in the operand
      this.findAllSubexpressionMatches(expression.operand, pattern, [...path, 0], matches);
    } else if (expression.type === 'binary') {
      // Search in both left and right subtrees
      this.findAllSubexpressionMatches(expression.left, pattern, [...path, 0], matches);
      this.findAllSubexpressionMatches(expression.right, pattern, [...path, 1], matches);
    }
    // For variables and constants, no deeper search needed
  }

  private canApplyRule(expression: BooleanExpression, rule: TransformationRule): boolean {
    try {
      // Try to match left pattern
      const leftPattern = parseBooleanExpression(rule.leftPattern);
      if (this.findMatch(expression, leftPattern)) {
        return true;
      }

      // Try to match right pattern
      const rightPattern = parseBooleanExpression(rule.rightPattern);
      if (this.findMatch(expression, rightPattern)) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  private findMatch(expression: BooleanExpression, pattern: BooleanExpression): boolean {
    // Check if the entire expression matches
    if (this.unify(expression, pattern)) {
      return true;
    }

    // Check if any subexpression matches
    return this.findMatchInSubexpressions(expression, pattern);
  }

  private findMatchInSubexpressions(expression: BooleanExpression, pattern: BooleanExpression): boolean {
    if (expression.type === 'unary') {
      return this.findMatch(expression.operand, pattern);
    }
    
    if (expression.type === 'binary') {
      // Check immediate children
      if (this.findMatch(expression.left, pattern) || 
          this.findMatch(expression.right, pattern)) {
        return true;
      }
      
      // Check if the pattern matches any combination of subexpressions
      // For example, if we have (a ∧ b) ∨ (a ∧ ¬a), the pattern A ∧ ¬A should match (a ∧ ¬a)
      if (pattern.type === 'binary') {
        // Try to match the pattern against the left side
        if (this.unify(expression.left, pattern)) {
          return true;
        }
        // Try to match the pattern against the right side
        if (this.unify(expression.right, pattern)) {
          return true;
        }
      }
      
      // Also check if the pattern matches any deeper subexpression
      // This is needed for cases like A ∨ ¬A matching (b ∨ ¬a) in a ∧ (b ∨ ¬a)
      return this.findMatchInSubexpressions(expression.left, pattern) || 
             this.findMatchInSubexpressions(expression.right, pattern);
    }
    
    return false;
  }

  private unify(expression: BooleanExpression, pattern: BooleanExpression): Map<string, BooleanExpression> | null {
    return this.unifyRecursive(expression, pattern, new Map());
  }

  private unifyRecursive(expression: BooleanExpression, pattern: BooleanExpression, substitution: Map<string, BooleanExpression>): Map<string, BooleanExpression> | null {
    // If pattern is a variable, check if we can bind it
    if (pattern.type === 'variable') {
      const existingBinding = substitution.get(pattern.value);
      
      if (existingBinding) {
        // Variable already bound - check consistency
        if (this.expressionsEqual(existingBinding, expression)) {
          return substitution;
        } else {
          return null; // Inconsistent binding
        }
      } else {
        // New variable binding - pattern variables can match any expression
        const newSubstitution = new Map(substitution);
        newSubstitution.set(pattern.value, expression);
        return newSubstitution;
      }
    }

    // If pattern is a constant, expression must match exactly
    if (pattern.type === 'constant') {
      if (expression.type === 'constant' && expression.value === pattern.value) {
        return substitution;
      } else {
        return null;
      }
    }

    // If pattern is unary, expression must be unary with same operator
    if (pattern.type === 'unary') {
      if (expression.type === 'unary' && expression.operator === pattern.operator) {
        return this.unifyRecursive(expression.operand, pattern.operand, substitution);
      } else {
        return null;
      }
    }

    // If pattern is binary, expression must be binary with same operator
    if (pattern.type === 'binary') {
      if (expression.type === 'binary' && expression.operator === pattern.operator) {
        const leftResult = this.unifyRecursive(expression.left, pattern.left, substitution);
        if (leftResult === null) return null;
        
        return this.unifyRecursive(expression.right, pattern.right, leftResult);
      } else {
        return null;
      }
    }

    return null;
  }



  private expressionsEqual(expr1: BooleanExpression, expr2: BooleanExpression): boolean {
    if (expr1.type !== expr2.type) {
      return false;
    }

    switch (expr1.type) {
      case 'constant':
        return expr2.type === 'constant' && expr1.value === expr2.value;
      case 'variable':
        return expr2.type === 'variable' && expr1.value === expr2.value;
      case 'unary':
        return expr2.type === 'unary' && 
               expr1.operator === expr2.operator && 
               this.expressionsEqual(expr1.operand, expr2.operand);
      case 'binary':
        return expr2.type === 'binary' && 
               expr1.operator === expr2.operator && 
               this.expressionsEqual(expr1.left, expr2.left) && 
               this.expressionsEqual(expr1.right, expr2.right);
      default:
        return false;
    }
  }

  applyRule(
    expression: BooleanExpression, 
    rule: TransformationRule, 
    direction: 'left-to-right' | 'right-to-left' = 'left-to-right', 
    position?: number[],
    variableInstantiations?: Map<string, BooleanExpression>
  ): BooleanExpression | null {
    try {
      let pattern: BooleanExpression;
      let replacement: BooleanExpression;

      if (direction === 'left-to-right') {
        pattern = parseBooleanExpression(rule.leftPattern);
        replacement = parseBooleanExpression(rule.rightPattern);
      } else {
        pattern = parseBooleanExpression(rule.rightPattern);
        replacement = parseBooleanExpression(rule.leftPattern);
      }

      let matchInfo: { substitution: Map<string, BooleanExpression>, path: number[] } | null;

      if (position !== undefined) {
        // Apply rule at specific position
        const subexpr = this.getSubexpressionAtPosition(expression, position);
        if (!subexpr) {
          return null;
        }
        
        const substitution = this.unify(subexpr, pattern);
        if (!substitution) {
          return null;
        }
        
        matchInfo = { substitution, path: position };
      } else {
        // Find where the pattern matches in the expression (original behavior)
        matchInfo = this.findMatchWithPosition(expression, pattern);
        if (!matchInfo) {
          return null;
        }
      }

      // Merge the unification substitution with any provided variable instantiations
      const finalSubstitution = new Map(matchInfo.substitution);
      if (variableInstantiations) {
        for (const [varName, instantiation] of variableInstantiations) {
          finalSubstitution.set(varName, instantiation);
        }
      }

      // Apply the substitution to the replacement
      const substitutedReplacement = this.applySubstitutionToExpression(replacement, finalSubstitution);
      
      // Replace the matched part with the substituted replacement
      return this.replaceSubexpression(expression, matchInfo.path, substitutedReplacement);
    } catch {
      return null;
    }
  }

  private findMatchWithPosition(expression: BooleanExpression, pattern: BooleanExpression): { substitution: Map<string, BooleanExpression>, path: number[] } | null {
    // Check if the entire expression matches
    const substitution = this.unify(expression, pattern);
    if (substitution) {
      return { substitution, path: [] };
    }

    // Check subexpressions
    return this.findMatchInSubexpressionsWithPosition(expression, pattern, []);
  }

  private findMatchInSubexpressionsWithPosition(expression: BooleanExpression, pattern: BooleanExpression, path: number[]): { substitution: Map<string, BooleanExpression>, path: number[] } | null {
    // First check if the current expression matches the pattern
    const substitution = this.unify(expression, pattern);
    if (substitution) {
      return { substitution, path };
    }

    // If not, check deeper subexpressions
    if (expression.type === 'unary') {
      const result = this.findMatchInSubexpressionsWithPosition(expression.operand, pattern, [...path, 0]);
      if (result) {
        return result;
      }
    }
    
    if (expression.type === 'binary') {
      // Check left subtree
      const leftResult = this.findMatchInSubexpressionsWithPosition(expression.left, pattern, [...path, 0]);
      if (leftResult) {
        return leftResult;
      }
      
      // Check right subtree
      const rightResult = this.findMatchInSubexpressionsWithPosition(expression.right, pattern, [...path, 1]);
      if (rightResult) {
        return rightResult;
      }
    }
    
    return null;
  }

  private getSubexpressionAtPosition(expression: BooleanExpression, position: number[]): BooleanExpression | null {
    if (position.length === 0) {
      return expression;
    }

    const currentPos = position[0];
    const remainingPos = position.slice(1);

    if (expression.type === 'unary') {
      if (currentPos === 0) {
        return this.getSubexpressionAtPosition(expression.operand, remainingPos);
      }
    } else if (expression.type === 'binary') {
      if (currentPos === 0) {
        return this.getSubexpressionAtPosition(expression.left, remainingPos);
      } else if (currentPos === 1) {
        return this.getSubexpressionAtPosition(expression.right, remainingPos);
      }
    }

    return null;
  }

  /**
   * Detects if a rule introduces new variables that need instantiation
   * Returns a map of variable names to their types (greek for unicode, ?a-z for ascii)
   */
  detectNewVariables(rule: TransformationRule, direction: 'left-to-right' | 'right-to-left'): Map<string, string> {
    const newVars = new Map<string, string>();
    
    let pattern: BooleanExpression;
    let replacement: BooleanExpression;
    
    if (direction === 'left-to-right') {
      pattern = parseBooleanExpression(rule.leftPattern);
      replacement = parseBooleanExpression(rule.rightPattern);
    } else {
      pattern = parseBooleanExpression(rule.rightPattern);
      replacement = parseBooleanExpression(rule.leftPattern);
    }
    
    // Find all variables in the replacement
    const replacementVars = this.extractVariables(replacement);
    
    // Find all variables in the pattern
    const patternVars = this.extractVariables(pattern);
    
    // Variables that appear in replacement but not in pattern are new
    for (const [varName, varType] of replacementVars) {
      if (!patternVars.has(varName)) {
        newVars.set(varName, varType);
      }
    }
    
    return newVars;
  }

  /**
   * Extracts all variables from an expression with their types
   */
  private extractVariables(expr: BooleanExpression): Map<string, string> {
    const vars = new Map<string, string>();
    
    switch (expr.type) {
      case 'variable':
        if (/^[α-ωΑ-Ω]/.test(expr.value)) {
          vars.set(expr.value, 'greek');
        } else if (/^\?[a-z]$/.test(expr.value)) {
          vars.set(expr.value, 'ascii');
        } else if (/^[A-Z]$/.test(expr.value)) {
          // Capital letters are used in rule patterns
          vars.set(expr.value, 'pattern');
        }
        break;
      case 'unary':
        this.extractVariablesFromMap(expr.operand, vars);
        break;
      case 'binary':
        this.extractVariablesFromMap(expr.left, vars);
        this.extractVariablesFromMap(expr.right, vars);
        break;
    }
    
    return vars;
  }

  private extractVariablesFromMap(expr: BooleanExpression, vars: Map<string, string>): void {
    const subVars = this.extractVariables(expr);
    for (const [varName, varType] of subVars) {
      vars.set(varName, varType);
    }
  }

  private replaceSubexpression(expression: BooleanExpression, path: number[], replacement: BooleanExpression): BooleanExpression {
    if (path.length === 0) {
      return replacement;
    }

    if (expression.type === 'unary') {
      if (path[0] === 0) {
        return {
          ...expression,
          operand: this.replaceSubexpression(expression.operand, path.slice(1), replacement)
        };
      }
    }

    if (expression.type === 'binary') {
      if (path[0] === 0) {
        return {
          ...expression,
          left: this.replaceSubexpression(expression.left, path.slice(1), replacement)
        };
      } else if (path[0] === 1) {
        return {
          ...expression,
          right: this.replaceSubexpression(expression.right, path.slice(1), replacement)
        };
      }
    }

    return expression;
  }

  // Method to introduce new variables (for rules like T = φ ∨ ¬φ)
  introduceVariable(expression: BooleanExpression): BooleanExpression {
    // This would be used when applying rules that introduce new variables
    // For now, we'll just return the original expression
    // In a full implementation, this would track variable definitions
    return expression;
  }
}

