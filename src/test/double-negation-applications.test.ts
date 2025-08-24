import { describe, it, expect } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Double Negation Applications', () => {
  it('should find all 6 possible double negation applications for a ∧ (b ∨ ¬a)', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    // Filter for double negation rule
    const doubleNegationApps = applications.filter(app => app.rule.id === 'double-negation')
    
    // Should find 6 applications (all positions where A → ¬¬A can be applied)
    expect(doubleNegationApps).toHaveLength(6)
    
    // Check that all expected positions are found
    const positions = doubleNegationApps.map(app => app.position.join(','))
    expect(positions).toContain('')      // entire expression
    expect(positions).toContain('0')     // left a
    expect(positions).toContain('1')     // right (b ∨ ¬a)
    expect(positions).toContain('1,0')   // left of right b
    expect(positions).toContain('1,1')   // right of right ¬a
    expect(positions).toContain('1,1,0') // a inside ¬a
    
    // All should be right-to-left applications (A → ¬¬A)
    for (const app of doubleNegationApps) {
      expect(app.direction).toBe('right-to-left')
    }
    
    // Check that all applications have valid descriptions and previews
    for (const app of doubleNegationApps) {
      expect(app.description).toBeTruthy()
      expect(app.fullPreview).toBeTruthy()
    }
    
    // Show the applications for verification
    console.log('\n=== Double Negation Applications ===')
    for (const app of doubleNegationApps) {
      console.log(`Position [${app.position.join(', ')}]: ${app.description}`)
      console.log(`  Result: ${app.fullPreview}`)
    }
  })
})
