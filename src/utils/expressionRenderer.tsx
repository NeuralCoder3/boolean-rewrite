import type { BooleanExpression } from '../types/boolean';

export function renderExpression(expr: BooleanExpression): string {
  switch (expr.type) {
    case 'variable':
      return expr.value || '';
    
    case 'constant':
      return expr.value || '';
    
    case 'unary':
      if (expr.operator === '¬') {
        return `¬${renderExpression(expr.operand!)}`;
      }
      return `${expr.operator}${renderExpression(expr.operand!)}`;
    
    case 'binary':
      const left = renderExpression(expr.left!);
      const right = renderExpression(expr.right!);
      const operator = expr.operator;
      
      // Add parentheses for precedence using the same logic as ruleEngine
      const leftNeedsParens = needsParentheses(expr.left!);
      const rightNeedsParens = needsParentheses(expr.right!);
      
      const leftStr = leftNeedsParens ? `(${left})` : left;
      const rightStr = rightNeedsParens ? `(${right})` : right;
      
      return `${leftStr} ${operator} ${rightStr}`;
    
    default:
      return '';
  }
}

// Use the same parentheses logic as ruleEngine.ts
function needsParentheses(subexpr: BooleanExpression): boolean {
  if (subexpr.type === 'variable' || subexpr.type === 'constant') {
    return false; // Variables and constants never need parentheses
  }
  
  if (subexpr.type === 'unary') {
    // Unary expressions need parentheses only when their operand is binary
    // This ensures clear precedence and matches the test expectations
    // For example: a ∧ ((¬a) ∨ b) instead of a ∧ (¬a ∨ b)
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


