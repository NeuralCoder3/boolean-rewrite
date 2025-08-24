import { describe, it, expect } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Full Expression Preview', () => {
  it('should generate correct full expression previews for subexpression transformations', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Test commutativity OR at subexpression position [1] (b ∨ ¬a)
    const commutativityOr = applications.find(app => 
      app.rule.id === 'commutativity-or' && 
      app.direction === 'left-to-right' &&
      app.position.length > 0
    )
    
    expect(commutativityOr).toBeDefined()
    expect(commutativityOr!.fullPreview).toBe('a ∧ (¬a ∨ b)')
    
    // Test double negation at subexpression position [1, 1] (¬a)
    const doubleNegation = applications.find(app => 
      app.rule.id === 'double-negation' && 
      app.direction === 'right-to-left' &&
      app.position.join(',') === '1,1'
    )
    
    expect(doubleNegation).toBeDefined()
    expect(doubleNegation!.fullPreview).toBe('a ∧ (b ∨ ¬¬¬a)')
  })

  it('should generate correct full expression previews for full expression transformations', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Test distributivity at position [] (entire expression)
    const distributivity = applications.find(app => 
      app.rule.id === 'distributivity-and-over-or' && 
      app.direction === 'left-to-right' &&
      app.position.length === 0
    )
    
    expect(distributivity).toBeDefined()
    expect(distributivity!.fullPreview).toBe('(a ∧ b) ∨ (a ∧ ¬a)')
    
    // Test commutativity AND at position [] (entire expression)
    const commutativityAnd = applications.find(app => 
      app.rule.id === 'commutativity-and' && 
      app.direction === 'left-to-right' &&
      app.position.length === 0
    )
    
    expect(commutativityAnd).toBeDefined()
    expect(commutativityAnd!.fullPreview).toBe('(b ∨ ¬a) ∧ a')
  })

  it('should handle complex nested transformations correctly', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: (a ∧ b) ∨ (a ∧ c)
    const expr = parseBooleanExpression('(a ∧ b) ∨ (a ∧ c)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Test factoring rule
    const factoring = applications.find(app => 
      app.rule.id === 'factoring-and-over-or' && 
      app.direction === 'left-to-right'
    )
    
    expect(factoring).toBeDefined()
    expect(factoring!.fullPreview).toBe('a ∧ (b ∨ c)')
  })
})
