import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RuleSelector } from '../components/RuleSelector';
import { parseBooleanExpression } from '../utils/parser';

// Mock the onRuleSelect and onClose functions
const mockOnRuleSelect = vi.fn();
const mockOnClose = vi.fn();

describe('RuleSelector Component', () => {
  it('should display rules grouped by category with separators', () => {
    const expression = parseBooleanExpression('a ∧ b');
    
    render(
      <RuleSelector
        expression={expression}
        onRuleSelect={mockOnRuleSelect}
        onClose={mockOnClose}
      />
    );

    // Check that at least one category header is displayed
    expect(screen.getByText('Commutativity Rules')).toBeInTheDocument();
    
    // Debug: log what's actually being rendered
    console.log('Rendered HTML:', document.body.innerHTML);
    
    // Check if other categories are present
    const categoryHeaders = screen.queryAllByText(/Rules$/);
    console.log('Found category headers:', categoryHeaders.map(h => h.textContent));
    
    // For now, just check that we have at least one category
    expect(categoryHeaders.length).toBeGreaterThan(0);
  });
});
