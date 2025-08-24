import type { BooleanExpression } from '../types/boolean';

export class BooleanParser {
  private tokens: string[] = [];
  private current: number = 0;
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    
    while (i < input.length) {
      const char = input[i];
      
      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }
      
      // Handle multi-character operators first
      if (i + 1 < input.length) {
        const twoChar = input.slice(i, i + 2);
        if (twoChar === '/\\' || twoChar === '\\/' || twoChar === '->') {
          tokens.push(twoChar);
          i += 2;
          continue;
        }
      }
      
      // Handle single characters
      if (char === '∧' || char === '∨' || char === '→' || char === '¬' || 
          char === '!' || char === '(' || char === ')' || char === '\\') {
        tokens.push(char);
        i++;
        continue;
      }
      
      // Handle variables and constants
      if (/[a-zA-Zα-ωΑ-Ω]/.test(char)) {
        let identifier = char;
        i++;
        while (i < input.length && /[a-zA-Zα-ωΑ-Ω0-9]/.test(input[i])) {
          identifier += input[i];
          i++;
        }
        
        // Check if it's a constant
        if (identifier === 'true' || identifier === 'false' || 
            identifier === '⊤' || identifier === '⊥') {
          tokens.push(identifier);
        } else {
          tokens.push(identifier);
        }
        continue;
      }
      
      // Handle question mark variables (?a, ?b, etc.)
      if (char === '?') {
        let identifier = char;
        i++;
        if (i < input.length && /[a-z]/.test(input[i])) {
          identifier += input[i];
          i++;
          tokens.push(identifier);
          continue;
        }
      }
      
      // If we get here, it's an unknown character
      throw new Error(`Unknown character: ${char}`);
    }
    
    return tokens;
  }

  private parseExpression(): BooleanExpression {
    return this.parseImplication();
  }

  private parseImplication(): BooleanExpression {
    let left = this.parseTerm();
    
    while (this.current < this.tokens.length && this.isImplication(this.tokens[this.current])) {
      const operator = this.tokens[this.current];
      this.current++;
      const right = this.parseTerm();
      left = {
        type: 'binary',
        operator: this.normalizeOperator(operator),
        left,
        right
      };
    }
    
    return left;
  }

  private parseTerm(): BooleanExpression {
    let left = this.parseFactor();
    
    while (this.current < this.tokens.length && this.isOr(this.tokens[this.current])) {
      const operator = this.tokens[this.current];
      this.current++;
      const right = this.parseFactor();
      left = {
        type: 'binary',
        operator: this.normalizeOperator(operator),
        left,
        right
      };
    }
    
    return left;
  }

  private parseFactor(): BooleanExpression {
    let left = this.parsePrimary();
    
    while (this.current < this.tokens.length && this.isAnd(this.tokens[this.current])) {
      const operator = this.tokens[this.current];
      this.current++;
      const right = this.parsePrimary();
      left = {
        type: 'binary',
        operator: this.normalizeOperator(operator),
        left,
        right
      };
    }
    
    return left;
  }

  private parsePrimary(): BooleanExpression {
    if (this.current >= this.tokens.length) {
      throw new Error('Unexpected end of input');
    }

    const token = this.tokens[this.current];
    
    if (token === '!') {
      this.current++;
      const operand = this.parsePrimary();
      return {
        type: 'unary',
        operator: '¬',
        operand
      };
    }
    
    if (token === '¬') {
      this.current++;
      const operand = this.parsePrimary();
      return {
        type: 'unary',
        operator: '¬',
        operand
      };
    }
    
    if (token === '(') {
      this.current++;
      const expression = this.parseExpression();
      if (this.current >= this.tokens.length || this.tokens[this.current] !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      this.current++;
      return expression;
    }
    
    if (token === 'true' || token === '⊤') {
      this.current++;
      return { type: 'constant', value: 'true' };
    }
    
    if (token === 'false' || token === '⊥') {
      this.current++;
      return { type: 'constant', value: 'false' };
    }
    
    if (/^[a-zA-Zα-ωΑ-Ω]/.test(token) || /^\?[a-z]$/.test(token)) {
      this.current++;
      return { type: 'variable', value: token };
    }
    
    throw new Error(`Unexpected token: ${token}`);
  }

  private isAnd(token: string): boolean {
    return token === '/\\' || token === '∧';
  }

  private isOr(token: string): boolean {
    return token === '\\/' || token === '∨';
  }

  private isImplication(token: string): boolean {
    return token === '->' || token === '→';
  }

  private normalizeOperator(operator: string): '∧' | '∨' | '→' | '¬' {
    // Convert ASCII operators to Unicode for consistency
    switch (operator) {
      case '/\\': return '∧';
      case '\\/': return '∨';
      case '->': return '→';
      case '!': return '¬';
      case '∧': return '∧';
      case '∨': return '∨';
      case '→': return '→';
      case '¬': return '¬';
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  }

  parse(): BooleanExpression {
    this.tokens = this.tokenize(this.input);
    this.current = 0;
    const result = this.parseExpression();
    
    if (this.current < this.tokens.length) {
      throw new Error(`Unexpected tokens after expression: ${this.tokens.slice(this.current).join(' ')}`);
    }
    
    return result;
  }
}

export function parseBooleanExpression(input: string): BooleanExpression {
  const parser = new BooleanParser(input);
  return parser.parse();
}
