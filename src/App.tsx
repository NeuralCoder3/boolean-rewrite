import { useState } from 'react';
import { ExpressionInput } from './components/ExpressionInput';
import { TransformationChain } from './components/TransformationChain';
import { RuleSelector } from './components/RuleSelector';
import type { BooleanExpression, TransformationStep, TransformationRule } from './types/boolean';
import { RuleEngine } from './utils/ruleEngine';
import { renderExpression } from './utils/expressionRenderer';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const [currentExpression, setCurrentExpression] = useState<BooleanExpression | null>(null);
  const [transformationSteps, setTransformationSteps] = useState<TransformationStep[]>([]);
  const [isRuleSelectorOpen, setIsRuleSelectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ruleEngine] = useState(() => new RuleEngine());
  const { isDark, toggleTheme } = useTheme();

  const handleExpressionSubmit = (expression: BooleanExpression) => {
    setCurrentExpression(expression);
    setTransformationSteps([]);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleAddTransformation = () => {
    if (!currentExpression) return;
    setIsRuleSelectorOpen(true);
  };

  const handleRuleSelect = (rule: TransformationRule, direction: 'left-to-right' | 'right-to-left', _position: number[]) => {
    if (!currentExpression) return;

  
    const result = ruleEngine.applyRule(currentExpression, rule, direction);
    
    if (result) {
      const newStep: TransformationStep = {
        id: Date.now().toString(),
        from: currentExpression,
        to: result,
        rule,
        timestamp: Date.now()
      };

      setTransformationSteps(prev => [...prev, newStep]);
      setCurrentExpression(result);
    }
  };

  const handleRuleClick = (rule: TransformationRule) => {
    // Show rule details or highlight in rule selector
    console.log('Rule clicked:', rule);
  };

  const resetTransformation = () => {
    if (transformationSteps.length > 0) {
      setCurrentExpression(transformationSteps[0].from);
      setTransformationSteps([]);
      setError(null);
    } else {
      setCurrentExpression(null);
      setTransformationSteps([]);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header with Theme Toggle */}
        <div className="text-center mb-10">
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-600"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 000 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 transition-all duration-300">
            Boolean Expression Transformer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
            Transform boolean expressions using logical rules and equivalences
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Expression Input - Only show when no expression is entered */}
        {!currentExpression && (
          <ExpressionInput 
            onExpressionSubmit={handleExpressionSubmit}
            onError={handleError}
          />
        )}

        {/* Current Expression Display with Equiv Button */}
        {currentExpression && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-600/50">
              <div className="font-mono text-2xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 px-6 py-3 rounded-xl border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-inner transition-all duration-200">
                {renderExpression(currentExpression)}
              </div>
              <button
                onClick={handleAddTransformation}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-2xl">≡</span>
                <span>Add Transformation</span>
              </button>
            </div>
            
            <div className="mt-6 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-200">
              Click the ≡ button to apply a transformation rule
            </div>
            
            {transformationSteps.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={resetTransformation}
                  className="px-5 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transformation Chain */}
        {currentExpression && transformationSteps.length > 0 && (
          <div className="mb-12">
            <TransformationChain
              steps={transformationSteps}
              currentExpression={currentExpression}
              onRuleClick={handleRuleClick}
            />
          </div>
        )}

        {/* Rule Selector Modal */}
        {isRuleSelectorOpen && currentExpression && (
          <RuleSelector
            expression={currentExpression}
            onRuleSelect={handleRuleSelect}
            onClose={() => setIsRuleSelectorOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
