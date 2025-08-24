export type BooleanOperator = '∧' | '∨' | '→' | '¬';
export type BooleanConstant = 'true' | 'false' | '⊤' | '⊥';

export interface VariableExpression {
  type: 'variable';
  value: string;
}

export interface ConstantExpression {
  type: 'constant';
  value: string;
}

export interface UnaryExpression {
  type: 'unary';
  operator: BooleanOperator;
  operand: BooleanExpression;
}

export interface BinaryExpression {
  type: 'binary';
  operator: BooleanOperator;
  left: BooleanExpression;
  right: BooleanExpression;
}

export type BooleanExpression = VariableExpression | ConstantExpression | UnaryExpression | BinaryExpression;

export interface TransformationRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  leftPattern: string;  // String representation of left side
  rightPattern: string; // String representation of right side
  variables: string[];  // List of variables used in the rule
}

export type RuleCategory =
  | 'commutativity' | 'associativity' | 'distributivity' | 'idempotence'
  | 'identity' | 'complement' | 'deMorgan' | 'implication'
  | 'absorption' | 'domination' | 'definability' | 'contraposition' | 'doubleNegation';

export interface TransformationStep {
  id: string;
  from: BooleanExpression;
  to: BooleanExpression;
  rule: TransformationRule;
  timestamp: number;
}

export interface TransformationChain {
  steps: TransformationStep[];
  currentExpression: BooleanExpression;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
