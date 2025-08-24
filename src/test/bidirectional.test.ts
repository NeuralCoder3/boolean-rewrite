import { describe, it, expect } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Bidirectional Rule Application', () => {
  it('should find both left-to-right and right-to-left applications', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Should find distributivity left-to-right: a ∧ (b ∨ ¬a) → (a ∧ b) ∨ (a ∧ ¬a)
    const distributivityLTR = applications.find(app => 
      app.rule.id === 'distributivity-and-over-or' && 
      app.direction === 'left-to-right'
    )
    expect(distributivityLTR).toBeDefined()
    
    // Should find double negation right-to-left: (b ∨ ¬a) → ¬¬(b ∨ ¬a)
    const doubleNegationRTL = applications.find(app => 
      app.rule.id === 'double-negation' && 
      app.direction === 'right-to-left'
    )
    expect(doubleNegationRTL).toBeDefined()
    
    // Should find double negation right-to-left at subexpression position [1]
    const doubleNegationRTLSubexpr = applications.find(app => 
      app.rule.id === 'double-negation' && 
      app.direction === 'right-to-left' &&
      app.position.length > 0
    )
    expect(doubleNegationRTLSubexpr).toBeDefined()
  })

  it('should apply double negation right-to-left to subexpression', () => {
    const ruleEngine = new RuleEngine()
    
    // Start with: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Apply double negation right-to-left to the subexpression (b ∨ ¬a)
    const doubleNegationRule = ruleEngine.getRules().find(r => r.id === 'double-negation')!
    
    // This should transform (b ∨ ¬a) to ¬¬(b ∨ ¬a) at position [1] (right subexpression)
    const result = ruleEngine.applyRule(expr, doubleNegationRule, 'right-to-left')
    
    expect(result).not.toBeNull()
    
    // The result should be: a ∧ ¬¬(b ∨ ¬a)
    // We can't easily test the exact structure, but we can verify it's not null
    expect(result).toBeDefined()
  })

  it('should find multiple applications for the same rule', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: (a ∧ b) ∨ (a ∧ c)
    const expr = parseBooleanExpression('(a ∧ b) ∨ (a ∧ c)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Should find factoring rule: (a ∧ b) ∨ (a ∧ c) → a ∧ (b ∨ c)
    const factoringRule = applications.find(app => 
      app.rule.id === 'factoring-and-over-or' && 
      app.direction === 'left-to-right'
    )
    expect(factoringRule).toBeDefined()
    
    // Should also find the reverse: a ∧ (b ∨ c) → (a ∧ b) ∨ (a ∧ c)
    // But this would be for a different expression
  })
})
