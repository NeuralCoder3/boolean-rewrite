import type { BooleanExpression } from '../types/boolean';
import { RuleEngine } from './ruleEngine';

// Create a singleton instance to access the expressionToString method
const ruleEngine = new RuleEngine();

export function renderExpression(expr: BooleanExpression): string {
  // Use the same expressionToString method as the rule engine
  return ruleEngine['expressionToString'](expr);
}


