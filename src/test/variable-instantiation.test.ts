import { describe, it, expect } from 'vitest';
import { RuleEngine } from '../utils/ruleEngine';
import { parseBooleanExpression } from '../utils/parser';

describe('Variable Instantiation System', () => {
  const ruleEngine = new RuleEngine();

  it('should detect new variables in absorption rules', () => {
    // Absorption rule: A ∧ (A ∨ B) ≡ A (right-to-left introduces B)
    const absorptionRule = ruleEngine.getRules().find(r => r.id === 'absorption-and')!;
    
    const newVars = ruleEngine.detectNewVariables(absorptionRule, 'right-to-left');
    
    expect(newVars.size).toBe(1);
    expect(newVars.has('B')).toBe(true);
    expect(newVars.get('B')).toBe('pattern');
  });

  it('should detect new variables in identity rules', () => {
    // Identity rule: A ∧ ⊤ ≡ A (right-to-left introduces ⊤)
    const identityRule = ruleEngine.getRules().find(r => r.id === 'identity-and-top')!;
    
    const newVars = ruleEngine.detectNewVariables(identityRule, 'right-to-left');
    
    expect(newVars.size).toBe(0); // true is a constant, not a variable
    expect(newVars.has('⊤')).toBe(false); // ⊤ is a constant, not a variable
  });

  it('should not detect new variables in commutativity rules', () => {
    // Commutativity rule: A ∧ B ≡ B ∧ A (no new variables)
    const commutativityRule = ruleEngine.getRules().find(r => r.id === 'commutativity-and')!;
    
    const newVars = ruleEngine.detectNewVariables(commutativityRule, 'left-to-right');
    
    expect(newVars.size).toBe(0);
  });

  it('should apply rule with variable instantiation', () => {
    const expression = parseBooleanExpression('a ∧ b');
    const absorptionRule = ruleEngine.getRules().find(r => r.id === 'absorption-and')!;
    
    // Create variable instantiation for B
    const variableInstantiations = new Map();
    variableInstantiations.set('B', parseBooleanExpression('c'));
    
    const result = ruleEngine.applyRule(
      expression, 
      absorptionRule, 
      'right-to-left', 
      [], 
      variableInstantiations
    );
    
    expect(result).not.toBeNull();
    if (result) {
      const resultStr = ruleEngine['expressionToString'](result);
      // Should be: (a ∧ b) ∧ ((a ∧ b) ∨ c) - the entire expression is replaced
      expect(resultStr).toBe('(a ∧ b) ∧ ((a ∧ b) ∨ c)');
    }
  });

  it('should handle multiple variable instantiations', () => {
    const expression = parseBooleanExpression('a ∧ b');
    const absorptionRule = ruleEngine.getRules().find(r => r.id === 'absorption-and')!;
    
    // Create variable instantiations for both A and B
    const variableInstantiations = new Map();
    variableInstantiations.set('A', parseBooleanExpression('x'));
    variableInstantiations.set('B', parseBooleanExpression('y'));
    
    const result = ruleEngine.applyRule(
      expression, 
      absorptionRule, 
      'right-to-left', 
      [], 
      variableInstantiations
    );
    
    expect(result).not.toBeNull();
    if (result) {
      const resultStr = ruleEngine['expressionToString'](result);
      // Should be: x ∧ (x ∨ y) - A is instantiated to x, B to y
      expect(resultStr).toBe('x ∧ (x ∨ y)');
    }
  });
});
