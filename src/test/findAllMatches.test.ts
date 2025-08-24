import { describe, it, expect } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('FindAllMatches Method', () => {
  it('should find all subexpressions for simple expression a ∧ b', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ b
    const expr = parseBooleanExpression('a ∧ b')
    
    // Pattern to match: A (any variable)
    const pattern = parseBooleanExpression('A')
    
    // Get all matches
    const matches = ruleEngine['findAllMatches'](expr, pattern)
    
    // Debug: show all matches
    console.log(`\nSimple expression a ∧ b - found ${matches.length} matches:`)
    for (const match of matches) {
      console.log(`  Position [${match.path.join(', ')}]: substitution size = ${match.substitution.size}`)
    }
    
    // Should find 3 matches: entire expression, left a, right b
    expect(matches).toHaveLength(3)
    
    // Check positions
    const positions = matches.map(m => m.path.join(','))
    expect(positions).toContain('')      // entire expression
    expect(positions).toContain('0')     // left subexpression (a)
    expect(positions).toContain('1')     // right subexpression (b)
    
    // Check that substitutions are not empty
    for (const match of matches) {
      expect(match.substitution.size).toBeGreaterThan(0)
    }
  })

  it('should find all subexpressions for complex expression a ∧ (b ∨ ¬a)', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Pattern to match: A (any variable)
    const pattern = parseBooleanExpression('A')
    
    // Get all matches
    const matches = ruleEngine['findAllMatches'](expr, pattern)
    
    // Debug: show all matches
    console.log(`\nComplex expression a ∧ (b ∨ ¬a) - found ${matches.length} matches:`)
    for (const match of matches) {
      console.log(`  Position [${match.path.join(', ')}]: substitution size = ${match.substitution.size}`)
    }
    
    // Should find 6 matches: entire expression, left a, right (b ∨ ¬a), left-right b, right-right ¬a, right-right-left a
    expect(matches).toHaveLength(6)
    
    // Check positions
    const positions = matches.map(m => m.path.join(','))
    expect(positions).toContain('')      // entire expression
    expect(positions).toContain('0')     // left subexpression (a)
    expect(positions).toContain('1')     // right subexpression (b ∨ ¬a)
    expect(positions).toContain('1,0')   // left of right (b)
    expect(positions).toContain('1,1')   // right of right (¬a)
    expect(positions).toContain('1,1,0') // right of right of left (a inside ¬a)
    
    // Check that substitutions are not empty
    for (const match of matches) {
      expect(match.substitution.size).toBeGreaterThan(0)
    }
  })

  it('should work with double negation rule', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get double negation rule
    const doubleNegationRule = ruleEngine.getRules().find(r => r.id === 'double-negation')!
    
    // Test right-to-left direction (A → ¬¬A)
    const rightPattern = parseBooleanExpression(doubleNegationRule.rightPattern) // A
    const matches = ruleEngine['findAllMatches'](expr, rightPattern)
    
    // Should find 6 matches for pattern A
    expect(matches).toHaveLength(6)
    
    // Check positions
    const positions = matches.map(m => m.path.join(','))
    expect(positions).toContain('')      // entire expression
    expect(positions).toContain('0')     // left a
    expect(positions).toContain('1')     // right (b ∨ ¬a)
    expect(positions).toContain('1,0')   // left of right b
    expect(positions).toContain('1,1')   // right of right ¬a
    expect(positions).toContain('1,1,0') // a inside ¬a
  })
})
