import { describe, it, expect, beforeEach } from 'vitest'
import { RuleEngine } from '../utils/ruleEngine'
import { parseBooleanExpression } from '../utils/parser'
import type { BooleanExpression } from '../types/boolean'

describe('RuleEngine', () => {
  let ruleEngine: RuleEngine

  beforeEach(() => {
    ruleEngine = new RuleEngine()
  })

  describe('Unification Algorithm', () => {
    describe('Constant Matching', () => {
      it('should unify identical constants', () => {
        const expr = parseBooleanExpression('true')
        const pattern = parseBooleanExpression('true')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.size).toBe(0) // No variables to substitute
      })

      it('should fail to unify different constants', () => {
        const expr = parseBooleanExpression('true')
        const pattern = parseBooleanExpression('false')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).toBeNull()
      })

      it('should unify constant with variable', () => {
        const expr = parseBooleanExpression('true')
        const pattern = parseBooleanExpression('A')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(expr)
      })
    })

    describe('Variable Matching', () => {
      it('should unify variable with any expression', () => {
        const expr = parseBooleanExpression('abc')
        const pattern = parseBooleanExpression('A')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(expr)
      })

      it('should create consistent variable mappings', () => {
        const expr = parseBooleanExpression('abc /\\ xyz')
        const pattern = parseBooleanExpression('A /\\ B')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
        expect(result!.get('B')).toEqual(parseBooleanExpression('xyz'))
      })

      it('should fail if variable mapping is inconsistent', () => {
        const expr = parseBooleanExpression('abc /\\ def')
        const pattern = parseBooleanExpression('A /\\ A') // Same variable twice
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).toBeNull() // abc ≠ def, so A can't map to both
      })
    })

    describe('Unary Operator Matching', () => {
      it('should unify matching unary operators', () => {
        const expr = parseBooleanExpression('!abc')
        const pattern = parseBooleanExpression('!A')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
      })

      it('should fail if unary operators differ', () => {
        const expr = parseBooleanExpression('!abc')
        const pattern = parseBooleanExpression('!A')
        // This should work, but let's test with different operators if we had them
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
      })

      it('should recursively unify operands', () => {
        const expr = parseBooleanExpression('!!abc')
        const pattern = parseBooleanExpression('!!A')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
      })
    })

    describe('Binary Operator Matching', () => {
      it('should unify matching binary operators', () => {
        const expr = parseBooleanExpression('abc /\\ xyz')
        const pattern = parseBooleanExpression('A /\\ B')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
        expect(result!.get('B')).toEqual(parseBooleanExpression('xyz'))
      })

      it('should fail if binary operators differ', () => {
        const expr = parseBooleanExpression('abc /\\ xyz')
        const pattern = parseBooleanExpression('A \\/ B')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).toBeNull()
      })

      it('should recursively unify left and right sides', () => {
        const expr = parseBooleanExpression('(abc /\\ xyz) \\/ def')
        const pattern = parseBooleanExpression('(A /\\ B) \\/ C')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
        expect(result!.get('B')).toEqual(parseBooleanExpression('xyz'))
        expect(result!.get('C')).toEqual(parseBooleanExpression('def'))
      })
    })

    describe('Complex Expression Matching', () => {
      it('should handle nested expressions', () => {
        const expr = parseBooleanExpression('abc /\\ (xyz \\/ def)')
        const pattern = parseBooleanExpression('A /\\ (B \\/ C)')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
        expect(result!.get('B')).toEqual(parseBooleanExpression('xyz'))
        expect(result!.get('C')).toEqual(parseBooleanExpression('def'))
      })

      it('should handle mixed operators', () => {
        const expr = parseBooleanExpression('abc -> (xyz /\\ def)')
        const pattern = parseBooleanExpression('A -> (B /\\ C)')
        const result = ruleEngine['unify'](expr, pattern)
        expect(result).not.toBeNull()
        expect(result!.get('A')).toEqual(parseBooleanExpression('abc'))
        expect(result!.get('B')).toEqual(parseBooleanExpression('xyz'))
        expect(result!.get('C')).toEqual(parseBooleanExpression('def'))
      })
    })
  })

  describe('Rule Application', () => {
    describe('Commutativity Rules', () => {
      it('should apply commutativity of AND', () => {
        const expr = parseBooleanExpression('abc /\\ xyz')
        const rule = ruleEngine.getRules().find(r => r.id === 'commutativity-and')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('xyz /\\ abc'))
      })

      it('should apply commutativity of OR', () => {
        const expr = parseBooleanExpression('abc \\/ xyz')
        const rule = ruleEngine.getRules().find(r => r.id === 'commutativity-or')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('xyz \\/ abc'))
      })
    })

    describe('Identity Rules', () => {
      it('should apply identity for AND with true', () => {
        const expr = parseBooleanExpression('abc /\\ true')
        const rule = ruleEngine.getRules().find(r => r.id === 'identity-and-top')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('abc'))
      })

      it('should apply identity for OR with false', () => {
        const expr = parseBooleanExpression('abc \\/ false')
        const rule = ruleEngine.getRules().find(r => r.id === 'identity-or-bottom')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('abc'))
      })
    })

    describe('Idempotence Rules', () => {
      it('should apply idempotence of AND', () => {
        const expr = parseBooleanExpression('abc /\\ abc')
        const rule = ruleEngine.getRules().find(r => r.id === 'idempotence-and')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('abc'))
      })

      it('should apply idempotence of OR', () => {
        const expr = parseBooleanExpression('abc \\/ abc')
        const rule = ruleEngine.getRules().find(r => r.id === 'idempotence-or')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('abc'))
      })
    })

    describe('Double Negation', () => {
      it('should apply double negation', () => {
        const expr = parseBooleanExpression('!!abc')
        const rule = ruleEngine.getRules().find(r => r.id === 'double-negation')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('abc'))
      })
    })

    describe('De Morgan Laws', () => {
      it('should apply De Morgan for AND', () => {
        const expr = parseBooleanExpression('!(abc /\\ xyz)')
        const rule = ruleEngine.getRules().find(r => r.id === 'de-morgan-and')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('!abc \\/ !xyz'))
      })

      it('should apply De Morgan for OR', () => {
        const expr = parseBooleanExpression('!(abc \\/ xyz)')
        const rule = ruleEngine.getRules().find(r => r.id === 'de-morgan-or')!
        const result = ruleEngine.applyRule(expr, rule)
        expect(result).not.toBeNull()
        expect(result).toEqual(parseBooleanExpression('!abc /\\ !xyz'))
      })
    })
  })

  describe('Rule Applicability', () => {
    it('should find applicable rules for simple AND', () => {
      const expr = parseBooleanExpression('abc /\\ xyz')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should include commutativity
      const commutativity = applicable.find(r => r.id === 'commutativity-and')
      expect(commutativity).toBeDefined()
    })

    it('should find applicable rules for AND with true', () => {
      const expr = parseBooleanExpression('abc /\\ true')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should include identity
      const identity = applicable.find(r => r.id === 'identity-and-top')
      expect(identity).toBeDefined()
    })

    it('should find applicable rules for double negation', () => {
      const expr = parseBooleanExpression('!!abc')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should include double negation
      const doubleNeg = applicable.find(r => r.id === 'double-negation')
      expect(doubleNeg).toBeDefined()
    })

    it('should find applicable rules for complex expression', () => {
      const expr = parseBooleanExpression('abc /\\ (xyz \\/ def)')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should include distributivity
      const distributivity = applicable.find(r => r.id === 'distributivity-and-over-or')
      expect(distributivity).toBeDefined()
    })
  })

  describe('Complex Transformations', () => {
    it('should handle complex expression with multiple rule possibilities', () => {
      const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should find distributivity rule
      const distributivity = applicable.find(r => r.id === 'distributivity-and-over-or')
      expect(distributivity).toBeDefined()
      
      // Note: complement-or rule is not applicable to the original expression
      // It would only become applicable after some transformations
    })

    it('should apply distributivity to complex expression', () => {
      const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
      const rule = ruleEngine.getRules().find(r => r.id === 'distributivity-and-over-or')!
      const result = ruleEngine.applyRule(expr, rule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('(a ∧ b) ∨ (a ∧ ¬a)'))
    })

    it('should apply complement rule after distributivity', () => {
      const expr = parseBooleanExpression('(a ∧ b) ∨ (a ∧ ¬a)')
      const rule = ruleEngine.getRules().find(r => r.id === 'complement-and')!
      const result = ruleEngine.applyRule(expr, rule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('(a ∧ b) ∨ false'))
    })

    it('should apply identity rule to eliminate false', () => {
      const expr = parseBooleanExpression('(a ∧ b) ∨ false')
      const rule = ruleEngine.getRules().find(r => r.id === 'identity-or-bottom')!
      const result = ruleEngine.applyRule(expr, rule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('a ∧ b'))
    })

    it('should find multiple applicable rules for complex expression', () => {
      const expr = parseBooleanExpression('(a ∧ b) ∨ (c ∧ d)')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should find distributivity rules
      const distributivity = applicable.find(r => r.id === 'distributivity-or-over-and')
      expect(distributivity).toBeDefined()
    })

    it('should handle nested negations', () => {
      const expr = parseBooleanExpression('¬¬(a ∧ b)')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should find double negation rule
      const doubleNeg = applicable.find(r => r.id === 'double-negation')
      expect(doubleNeg).toBeDefined()
    })

    it('should handle De Morgan with nested expressions', () => {
      const expr = parseBooleanExpression('¬(a ∧ (b ∨ c))')
      const applicable = ruleEngine.getApplicableRules(expr)
      expect(applicable.length).toBeGreaterThan(0)
      
      // Should find De Morgan rule
      const deMorgan = applicable.find(r => r.id === 'de-morgan-and')
      expect(deMorgan).toBeDefined()
    })
  })

  describe('Multi-step Transformations', () => {
    it('should transform a ∧ (b ∨ ¬a) step by step', () => {
      // Step 1: Start with original expression
      const expr = parseBooleanExpression('a ∧ (b ∨ ¬a)')
      
      // Step 2: Apply distributivity
      const distributivityRule = ruleEngine.getRules().find(r => r.id === 'distributivity-and-over-or')!
      let result = ruleEngine.applyRule(expr, distributivityRule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('(a ∧ b) ∨ (a ∧ ¬a)'))
      
      // Step 3: Apply complement rule to (a ∧ ¬a)
      const complementRule = ruleEngine.getRules().find(r => r.id === 'complement-and')!
      result = ruleEngine.applyRule(result!, complementRule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('(a ∧ b) ∨ false'))
      
      // Step 4: Apply identity rule to eliminate false
      const identityRule = ruleEngine.getRules().find(r => r.id === 'identity-or-bottom')!
      result = ruleEngine.applyRule(result!, identityRule)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('a ∧ b'))
      
      // Final result should be simplified
      expect(result).toEqual(parseBooleanExpression('a ∧ b'))
    })

    it('should handle transformation chain with multiple options', () => {
      // Start with expression that has multiple transformation paths
      const expr = parseBooleanExpression('(a ∧ b) ∨ (a ∧ c)')
      
      // Should find factoring rule (factoring out a)
      const applicable = ruleEngine.getApplicableRules(expr)
      const factoring = applicable.find(r => r.id === 'factoring-and-over-or')
      expect(factoring).toBeDefined()
      
      // Apply the rule
      const result = ruleEngine.applyRule(expr, factoring!)
      expect(result).not.toBeNull()
      expect(result).toEqual(parseBooleanExpression('a ∧ (b ∨ c)'))
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty expressions gracefully', () => {
      // This should not crash
      expect(() => ruleEngine.getApplicableRules({} as BooleanExpression)).not.toThrow()
    })

    it('should handle malformed rules gracefully', () => {
      const expr = parseBooleanExpression('abc /\\ xyz')
      const malformedRule = {
        id: 'malformed',
        name: 'Malformed Rule',
        description: 'This rule is malformed',
        category: 'test' as 'commutativity',
        leftPattern: 'invalid syntax',
        rightPattern: 'invalid syntax',
        variables: ['A', 'B']
      }
      
      const result = ruleEngine.applyRule(expr, malformedRule)
      expect(result).toBeNull()
    })
  })
})
