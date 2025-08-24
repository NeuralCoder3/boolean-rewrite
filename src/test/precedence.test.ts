import { describe, it, expect } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Operator Precedence in ExpressionToString', () => {
  it('should handle unary negation precedence correctly', () => {
    const ruleEngine = new RuleEngine()
    
    // Test basic expressions
    const expr1 = parseBooleanExpression('¬a')
    expect(ruleEngine['expressionToString'](expr1)).toBe('¬a')
    
    const expr2 = parseBooleanExpression('¬(a ∧ b)')
    expect(ruleEngine['expressionToString'](expr2)).toBe('¬(a ∧ b)')
    
    const expr3 = parseBooleanExpression('¬a ∧ b')
    expect(ruleEngine['expressionToString'](expr3)).toBe('¬a ∧ b')
    
    const expr4 = parseBooleanExpression('a ∧ ¬b')
    expect(ruleEngine['expressionToString'](expr4)).toBe('a ∧ ¬b')
  })

  it('should handle binary operator precedence correctly', () => {
    const ruleEngine = new RuleEngine()
    
    // Test AND vs OR precedence
    const expr1 = parseBooleanExpression('a ∧ b ∨ c')
    console.log(`\nParsing 'a ∧ b ∨ c':`)
    console.log(`  AST:`, JSON.stringify(expr1, null, 2))
    console.log(`  String: ${ruleEngine['expressionToString'](expr1)}`)
    expect(ruleEngine['expressionToString'](expr1)).toBe('(a ∧ b) ∨ c')
    
    const expr2 = parseBooleanExpression('a ∨ b ∧ c')
    console.log(`\nParsing 'a ∨ b ∧ c':`)
    console.log(`  AST:`, JSON.stringify(expr2, null, 2))
    console.log(`  String: ${ruleEngine['expressionToString'](expr2)}`)
    expect(ruleEngine['expressionToString'](expr2)).toBe('a ∨ (b ∧ c)')
    
    // Test implication precedence
    const expr3 = parseBooleanExpression('a ∧ b → c')
    console.log(`\nParsing 'a ∧ b → c':`)
    console.log(`  AST:`, JSON.stringify(expr3, null, 2))
    console.log(`  String: ${ruleEngine['expressionToString'](expr3)}`)
    expect(ruleEngine['expressionToString'](expr3)).toBe('(a ∧ b) → c')
    
    const expr4 = parseBooleanExpression('a → b ∧ c')
    console.log(`\nParsing 'a → b ∧ c':`)
    console.log(`  AST:`, JSON.stringify(expr4, null, 2))
    console.log(`  String: ${ruleEngine['expressionToString'](expr4)}`)
    expect(ruleEngine['expressionToString'](expr4)).toBe('a → (b ∧ c)')
  })

  it('should handle complex nested expressions correctly', () => {
    const ruleEngine = new RuleEngine()
    
    // Test the specific case mentioned by the user
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    console.log(`\nParsing 'a ∧ (b ∨ ¬a)':`)
    console.log(`  AST:`, JSON.stringify(expr, null, 2))
    console.log(`  String: ${ruleEngine['expressionToString'](expr)}`)
    expect(ruleEngine['expressionToString'](expr)).toBe('a ∧ (b ∨ ¬a)')
    
    // Test double negation around the entire expression
    const doubleNegExpr = parseBooleanExpression('¬¬(a ∧ (b ∨ ¬a))')
    expect(ruleEngine['expressionToString'](doubleNegExpr)).toBe('¬¬(a ∧ (b ∨ ¬a))')
    
    // Test double negation applied to left subexpression
    const leftDoubleNegExpr = parseBooleanExpression('¬¬a ∧ (b ∨ ¬a)')
    expect(ruleEngine['expressionToString'](leftDoubleNegExpr)).toBe('¬¬a ∧ (b ∨ ¬a)')
  })

  it('should work with the double negation rule application', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get double negation rule
    const doubleNegationRule = ruleEngine.getRules().find(r => r.id === 'double-negation')!
    
    // Test right-to-left direction (A → ¬¬A) at position [] (entire expression)
    const rightPattern = parseBooleanExpression(doubleNegationRule.rightPattern) // A
    const matches = ruleEngine['findAllMatches'](expr, rightPattern)
    
    // Find the match at position [] (entire expression)
    const rootMatch = matches.find(m => m.path.length === 0)
    expect(rootMatch).toBeDefined()
    
    if (rootMatch) {
      // Generate the full expression preview for this application
      const fullPreview = ruleEngine['generateFullExpressionPreview'](
        expr,
        doubleNegationRule,
        'right-to-left',
        rootMatch.path,
        rootMatch.substitution
      )
      
      // Should be ¬¬(a ∧ (b ∨ ¬a)), not ¬¬a ∧ (b ∨ ¬a)
      expect(fullPreview).toBe('¬¬(a ∧ (b ∨ ¬a))')
      
      console.log(`\nDouble negation applied to entire expression:`)
      console.log(`  Original: ${ruleEngine['expressionToString'](expr)}`)
      console.log(`  Result: ${fullPreview}`)
    }
  })
})
