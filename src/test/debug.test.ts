import { describe, it } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Debug Tests', () => {
  it('should debug why complex expressions are not matching', () => {
    const ruleEngine = new RuleEngine()
    
    // Test the specific expression that's failing
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    console.log('Expression:', JSON.stringify(expr, null, 2))
    
    // Get all rules
    const allRules = ruleEngine.getRules()
    console.log('Total rules:', allRules.length)
    
    // Check specific distributivity rule
    const distributivityRule = allRules.find(r => r.id === 'distributivity-and-over-or')!
    console.log('Distributivity rule pattern:', distributivityRule.leftPattern)
    
    try {
      const leftPattern = parseBooleanExpression(distributivityRule.leftPattern)
      console.log('Parsed pattern:', JSON.stringify(leftPattern, null, 2))
      
      // Test unification step by step
      console.log('\n=== Testing unification step by step ===')
      
      // Test if the entire expression matches
      const fullMatch = ruleEngine['unify'](expr, leftPattern)
      console.log('Full expression match:', fullMatch)
      
      // Test if left subexpression matches
      if (expr.type === 'binary') {
        const leftMatch = ruleEngine['unify'](expr.left, leftPattern)
        console.log('Left subexpression match:', leftMatch)
        
        const rightMatch = ruleEngine['unify'](expr.right, leftPattern)
        console.log('Right subexpression match:', rightMatch)
        
        // Test if the right subexpression (b ∨ ¬a) matches the pattern (B ∨ C)
        if (leftPattern.type === 'binary' && expr.right.type === 'binary') {
          const rightPatternMatch = ruleEngine['unify'](expr.right, leftPattern.right)
          console.log('Right pattern match:', rightPatternMatch)
        }
      }
      
      // Test the findMatch method directly
      const canApply = ruleEngine['canApplyRule'](expr, distributivityRule)
      console.log('Can apply rule:', canApply)
      
    } catch (error) {
      console.log('Error during unification:', error)
    }
  })

  it('should debug complement rule application', () => {
    const ruleEngine = new RuleEngine()
    
    // Test the expression after applying distributivity: (a ∧ b) ∨ (a ∧ ¬a)
    const expr = parseBooleanExpression('(a ∧ b) ∨ (a ∧ ¬a)')
    console.log('\n=== Testing complement rule ===')
    console.log('Expression:', JSON.stringify(expr, null, 2))
    
    // Get the complement rule
    const complementRule = ruleEngine.getRules().find(r => r.id === 'complement-and')!
    console.log('Complement rule pattern:', complementRule.leftPattern)
    
    try {
      const leftPattern = parseBooleanExpression(complementRule.leftPattern)
      console.log('Parsed pattern:', JSON.stringify(leftPattern, null, 2))
      
      // Test if the entire expression matches
      const fullMatch = ruleEngine['unify'](expr, leftPattern)
      console.log('Full expression match:', fullMatch)
      
      // Test if any subexpression matches
      if (expr.type === 'binary') {
        const leftMatch = ruleEngine['unify'](expr.left, leftPattern)
        console.log('Left subexpression (a ∧ b) match:', leftMatch)
        
        const rightMatch = ruleEngine['unify'](expr.right, leftPattern)
        console.log('Right subexpression (a ∧ ¬a) match:', rightMatch)
        
        // Test the findMatch method
        const canApply = ruleEngine['canApplyRule'](expr, complementRule)
        console.log('Can apply complement rule:', canApply)
      }
      
    } catch (error) {
      console.log('Error during complement rule testing:', error)
    }
  })

  it('should debug why complement-or rule is not found', () => {
    const ruleEngine = new RuleEngine()
    
    // Test the original expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    console.log('\n=== Testing complement-or rule in original expression ===')
    console.log('Expression:', JSON.stringify(expr, null, 2))
    
    // Get the complement-or rule
    const complementOrRule = ruleEngine.getRules().find(r => r.id === 'complement-or')!
    console.log('Complement-or rule pattern:', complementOrRule.leftPattern)
    
    try {
      const leftPattern = parseBooleanExpression(complementOrRule.leftPattern)
      console.log('Parsed pattern:', JSON.stringify(leftPattern, null, 2))
      
      // Test if the entire expression matches
      const fullMatch = ruleEngine['unify'](expr, leftPattern)
      console.log('Full expression match:', fullMatch)
      
      // Test if any subexpression matches
      if (expr.type === 'binary') {
        const leftMatch = ruleEngine['unify'](expr.left, leftPattern)
        console.log('Left subexpression (a) match:', leftMatch)
        
        const rightMatch = ruleEngine['unify'](expr.right, leftPattern)
        console.log('Right subexpression (b ∨ ¬a) match:', rightMatch)
        
        // Test the findMatch method
        const canApply = ruleEngine['canApplyRule'](expr, complementOrRule)
        console.log('Can apply complement-or rule:', canApply)
        
        // Test the findMatchInSubexpressions method directly
        const findMatchResult = ruleEngine['findMatchInSubexpressions'](expr, leftPattern)
        console.log('findMatchInSubexpressions result:', findMatchResult)
      }
      
    } catch (error) {
      console.log('Error during complement-or rule testing:', error)
    }
  })
})
