import { describe, it } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'

describe('Debug Full Expression Preview', () => {
  it('should debug the exact full expression preview values', () => {
    const ruleEngine = new RuleEngine()
    
    // Test expression: a ∧ (b ∨ ¬a)
    const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
    
    // Get all possible applications
    const applications = ruleEngine.getAllPossibleApplications(expr)
    
    console.log('\n=== Full Expression Previews ===')
    
    // Show all applications with their full previews
    for (const app of applications) {
      console.log(`\n${app.rule.name} (${app.direction}) at position [${app.position.join(', ')}]:`)
      console.log(`  Description: ${app.description}`)
      console.log(`  Full Preview: ${app.fullPreview}`)
    }
    
    // Focus on specific rules
    console.log('\n=== Specific Rules ===')
    
    const commutativityOr = applications.find(app => 
      app.rule.id === 'commutativity-or' && 
      app.direction === 'left-to-right' &&
      app.position.join(',') === '1'
    )
    
    if (commutativityOr) {
      console.log('\nCommutativity OR:')
      console.log(`  Description: ${commutativityOr.description}`)
      console.log(`  Full Preview: ${commutativityOr.fullPreview}`)
    }
    
    const doubleNegation = applications.find(app => 
      app.rule.id === 'double-negation' && 
      app.direction === 'right-to-left' &&
      app.position.join(',') === '1,1'
    )
    
    if (doubleNegation) {
      console.log('\nDouble Negation:')
      console.log(`  Description: ${doubleNegation.description}`)
      console.log(`  Full Preview: ${doubleNegation.fullPreview}`)
    }
    
    const commutativityAnd = applications.find(app => 
      app.rule.id === 'commutativity-and' && 
      app.direction === 'left-to-right' &&
      app.position.length === 0
    )
    
    if (commutativityAnd) {
      console.log('\nCommutativity AND:')
      console.log(`  Description: ${commutativityAnd.description}`)
      console.log(`  Full Preview: ${commutativityAnd.fullPreview}`)
    }
  })
})
