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
  }> {
    const applications: Array<{
      rule: TransformationRule;
      direction: 'left-to-right' | 'right-to-left';
      position: number[];
      description: string;
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
        applications.push({
          rule,
          direction: 'left-to-right',
          position: match.path,
          description: substitutedDescription
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
        applications.push({
          rule,
          direction: 'right-to-left',
          position: match.path,
          description: substitutedDescription
        });
      }
    }

    return applications;
  }

  private generateSubstitutedDescription(
    fromPattern: string, 
    toPattern: string, 
    substitution: Map<string, BooleanExpression>,
    direction: 'left-to-right' | 'right-to-left'
  ): string {
    let substitutedFrom = fromPattern;
    let substitutedTo = toPattern;
    
    // Apply substitutions to both patterns
    for (const [variable, value] of substitution) {
      const valueStr = this.expressionToString(value);
      substitutedFrom = substitutedFrom.replace(new RegExp(`\\b${variable}\\b`, 'g'), valueStr);
      substitutedTo = substitutedTo.replace(new RegExp(`\\b${variable}\\b`, 'g'), valueStr);
    }
    
    if (direction === 'left-to-right') {
      return `${substitutedFrom} → ${substitutedTo}`;
    } else {
      return `${substitutedFrom} → ${substitutedTo}`;
    }
  }

  private expressionToString(expr: BooleanExpression): string {
    switch (expr.type) {
      case 'variable':
        return expr.value;
      case 'constant':
        return expr.value;
      case 'unary':
        return `¬${this.expressionToString(expr.operand)}`;
      case 'binary': {
        const leftStr = this.expressionToString(expr.left);
        const rightStr = this.expressionToString(expr.right);
        
        // Add parentheses for proper precedence
        const leftNeedsParens = expr.left.type === 'binary' && 
          this.getOperatorPrecedence(expr.left.operator) < this.getOperatorPrecedence(expr.operator);
        const rightNeedsParens = expr.right.type === 'binary' && 
          this.getOperatorPrecedence(expr.right.operator) < this.getOperatorPrecedence(expr.operator);
        
        const leftFormatted = leftNeedsParens ? `(${leftStr})` : leftStr;
        const rightFormatted = rightNeedsParens ? `(${rightStr})` : rightStr;
        
        return `${leftFormatted} ${expr.operator} ${rightFormatted}`;
      }
    }
  }

  private getOperatorPrecedence(operator: string): number {
    switch (operator) {
      case '¬': return 3;
      case '∧': return 2;
      case '∨': return 1;
      case '→': return 0;
      default: return 0;
    }
  }

  private findAllMatches(expression: BooleanExpression, pattern: BooleanExpression): Array<{ substitution: Map<string, BooleanExpression>, path: number[] }> {
    const matches: Array<{ substitution: Map<string, BooleanExpression>, path: number[] }> = [];
    
    // Check if the entire expression matches
    const fullMatch = this.unify(expression, pattern);
    if (fullMatch) {
      matches.push({ substitution: fullMatch, path: [] });
    }

    // Check all subexpressions
    this.findAllSubexpressionMatches(expression, pattern, [], matches);
    
    return matches;
  }

  private findAllSubexpressionMatches(
    expression: BooleanExpression, 
    pattern: BooleanExpression, 
    path: number[], 
    matches: Array<{ substitution: Map<string, BooleanExpression>, path: number[] }>
  ) {
    if (expression.type === 'unary') {
      // Check if this subexpression matches
      const substitution = this.unify(expression, pattern);
      if (substitution) {
        matches.push({ substitution, path });
      }
      
      // Continue searching deeper
      this.findAllSubexpressionMatches(expression.operand, pattern, [...path, 0], matches);
    }
    
    if (expression.type === 'binary') {
      // Check if this subexpression matches
      const substitution = this.unify(expression, pattern);
      if (substitution) {
        matches.push({ substitution, path });
      }
      
      // Continue searching in left and right subtrees
      this.findAllSubexpressionMatches(expression.left, pattern, [...path, 0], matches);
      this.findAllSubexpressionMatches(expression.right, pattern, [...path, 1], matches);
    }
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
    const substitution = new Map<string, BooleanExpression>();
    return this.unifyRecursive(expression, pattern, substitution);
  }

  private unifyRecursive(expression: BooleanExpression, pattern: BooleanExpression, substitution: Map<string, BooleanExpression>): Map<string, BooleanExpression> | null {
    // Pattern variables can match any expression type
    if (pattern.type === 'variable') {
      const patternVar = pattern.value;
      const existingMapping = substitution.get(patternVar);
      
      if (existingMapping) {
        // Variable already mapped, check consistency
        if (this.expressionsEqual(existingMapping, expression)) {
          return substitution;
        }
        return null;
      } else {
        // New variable mapping - pattern variables can match any expression
        substitution.set(patternVar, expression);
        return substitution;
      }
    }

    // For non-variable patterns, types must match
    if (expression.type !== pattern.type) {
      return null;
    }

    switch (pattern.type) {
      case 'constant':
        if (expression.type === 'constant' && expression.value === pattern.value) {
          return substitution;
        }
        return null;

      case 'unary': {
        if (expression.type !== 'unary' || expression.operator !== pattern.operator) {
          return null;
        }
        return this.unifyRecursive(expression.operand, pattern.operand, substitution);
      }

      case 'binary': {
        if (expression.type !== 'binary' || expression.operator !== pattern.operator) {
          return null;
        }
        
        const leftSubstitution = this.unifyRecursive(expression.left, pattern.left, substitution);
        if (leftSubstitution === null) {
          return null;
        }
        
        return this.unifyRecursive(expression.right, pattern.right, leftSubstitution);
      }

      default:
        return null;
    }
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

  applyRule(expression: BooleanExpression, rule: TransformationRule, direction: 'left-to-right' | 'right-to-left' = 'left-to-right'): BooleanExpression | null {
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

      // Find where the pattern matches in the expression
      const matchInfo = this.findMatchWithPosition(expression, pattern);
      if (!matchInfo) {
        return null;
      }

      // Apply the substitution to the replacement
      const substitutedReplacement = this.applySubstitution(replacement, matchInfo.substitution);
      
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

  private applySubstitution(expression: BooleanExpression, substitution: Map<string, BooleanExpression>): BooleanExpression {
    switch (expression.type) {
      case 'constant':
        return expression;
      
      case 'variable': {
        const replacement = substitution.get(expression.value);
        if (replacement) {
          return replacement;
        }
        return expression;
      }
      
      case 'unary':
        return {
          ...expression,
          operand: this.applySubstitution(expression.operand, substitution)
        };
      
      case 'binary':
        return {
          ...expression,
          left: this.applySubstitution(expression.left, substitution),
          right: this.applySubstitution(expression.right, substitution)
        };
      
      default:
        return expression;
    }
  }

  // Method to introduce new variables (for rules like T = φ ∨ ¬φ)
  introduceVariable(expression: BooleanExpression): BooleanExpression {
    // This would be used when applying rules that introduce new variables
    // For now, we'll just return the original expression
    // In a full implementation, this would track variable definitions
    return expression;
  }
}
