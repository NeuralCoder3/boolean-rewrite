# Boolean Expression Transformer

A React TypeScript web application for transforming boolean expressions using logical rules and equivalences.

## Features

- **Boolean Expression Parser**: Parse infix notation expressions like `abc ∧ (x → abc)`
- **Transformation Rules**: Apply logical rules organized by categories:
  - Commutativity (AND, OR)
  - Associativity (AND, OR)
  - Distributivity (AND over OR, OR over AND)
  - Idempotence (AND, OR)
  - Identity (AND with true, OR with false)
  - Complement (Double negation)
  - De Morgan's Laws
  - Implication definition
- **Interactive UI**: Step-by-step transformation with visual feedback
- **Rule Selection**: Modal interface for choosing applicable rules
- **Visual Chain**: Clear representation of transformation steps

## Supported Operators

- `∧` (AND)
- `∨` (OR)
- `→` (IMPLIES)
- `¬` (NOT)
- `true` and `false` constants
- Variables (any alphanumeric string)
- Parentheses for grouping

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boolean-transformer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Enter Expression**: Type a boolean expression in the input field
   - Example: `A ∧ (B ∨ C)`
   - Example: `¬(P → Q)`
   - Example: `x ∧ y ∨ z`

2. **Apply Transformations**: Click the "≡ Add Transformation" button to see applicable rules

3. **Select Rule**: Choose from the categorized list of transformation rules

4. **View Chain**: See the step-by-step transformation process with rule names above each equivalence symbol

5. **Reset**: Use the reset button to start over from the original expression

## Project Structure

```
src/
├── components/           # React components
│   ├── ExpressionInput.tsx
│   ├── RuleSelector.tsx
│   ├── TransformationStep.tsx
│   └── TransformationChain.tsx
├── types/               # TypeScript type definitions
│   └── boolean.ts
├── utils/               # Utility functions
│   ├── parser.ts        # Boolean expression parser
│   ├── ruleEngine.ts    # Transformation rule engine
│   └── expressionRenderer.ts
├── App.tsx              # Main application component
└── main.tsx            # Application entry point
```

## Technical Details

### Parser
- Recursive descent parser for boolean expressions
- Handles operator precedence and associativity
- Supports nested expressions with parentheses

### Rule Engine
- Pattern matching system for rule application
- Rule categorization and filtering
- Applicable rule detection

### State Management
- React hooks for local state management
- Transformation history tracking
- Error handling and validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Future Enhancements

- [ ] More sophisticated pattern matching with variable substitution
- [ ] Custom rule creation interface
- [ ] Export/import transformation chains
- [ ] Step-by-step undo/redo functionality
- [ ] Expression validation and error highlighting
- [ ] Mobile-responsive design improvements

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React 18 and TypeScript
- Styled with Tailwind CSS
- Icons from Heroicons
