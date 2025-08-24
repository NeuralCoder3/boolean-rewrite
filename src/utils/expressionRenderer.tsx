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
      
      // Add parentheses for precedence
      const leftNeedsParens = needsParentheses(expr.left!, expr, 'left');
      const rightNeedsParens = needsParentheses(expr.right!, expr, 'right');
      
      const leftStr = leftNeedsParens ? `(${left})` : left;
      const rightStr = rightNeedsParens ? `(${right})` : right;
      
      return `${leftStr} ${operator} ${rightStr}`;
    
    default:
      return '';
  }
}

function needsParentheses(child: BooleanExpression, parent: BooleanExpression, side: 'left' | 'right'): boolean {
  if (parent.type !== 'binary' || child.type !== 'binary') {
    return false;
  }
  
  const parentPrecedence = getOperatorPrecedence(parent.operator!);
  const childPrecedence = getOperatorPrecedence(child.operator!);
  
  if (childPrecedence < parentPrecedence) {
    return true;
  }
  
  if (childPrecedence === parentPrecedence) {
    // Right associativity for implication
    if (parent.operator === '→' && side === 'right') {
      return false;
    }
    // Left associativity for AND and OR
    if ((parent.operator === '∧' || parent.operator === '∨') && side === 'left') {
      return false;
    }
    return true;
  }
  
  return false;
}

function getOperatorPrecedence(operator: string): number {
  switch (operator) {
    case '¬':
      return 4;
    case '∧':
      return 3;
    case '∨':
      return 2;
    case '→':
      return 1;
    default:
      return 0;
  }
}


