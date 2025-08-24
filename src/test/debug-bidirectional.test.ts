import { describe, it } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Debug Bidirectional Applications', () => {
  it('should debug what applications are found for a ∧ (b ∨ ¬a)', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    console.log('Expression:', JSON.stringify(expr, null, 2))
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    console.log('Total applications found:', applications.length)
    
    // Group by rule
    const byRule = new Map<string, Array<typeof applications[0]>>()
    for (const app of applications) {
      if (!byRule.has(app.rule.id)) {
        byRule.set(app.rule.id, [])
      }
      byRule.get(app.rule.id)!.push(app)
    }
    
    console.log('\nApplications by rule:')
    for (const [ruleId, apps] of byRule) {
      console.log(`\n${ruleId}:`)
      for (const app of apps) {
        console.log(`  ${app.direction}: ${app.description} at position [${app.position.join(', ')}]`)
      }
    }
    
    // Check specific rules with substituted descriptions
    const doubleNegationApps = applications.filter(app => app.rule.id === 'double-negation')
    console.log('\nDouble negation applications:', doubleNegationApps.length)
    for (const app of doubleNegationApps) {
      console.log(`  ${app.direction}: ${app.description} at position [${app.position.join(', ')}]`)
    }
    
    // Check distributivity with substituted descriptions
    const distributivityApps = applications.filter(app => app.rule.id === 'distributivity-and-over-or')
    console.log('\nDistributivity applications:', distributivityApps.length)
    for (const app of distributivityApps) {
      console.log(`  ${app.direction}: ${app.description} at position [${app.position.join(', ')}]`)
    }
  })
})
