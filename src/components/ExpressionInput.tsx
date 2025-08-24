import React, { useState } from 'react';
import { parseBooleanExpression } from '../utils/parser';
import type { BooleanExpression } from '../types/boolean';

interface ExpressionInputProps {
  onExpressionSubmit: (expression: BooleanExpression) => void;
  onError: (error: string) => void;
}

export const ExpressionInput: React.FC<ExpressionInputProps> = ({ 
  onExpressionSubmit, 
  onError 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      onError('Please enter a boolean expression');
      return;
    }

    try {
      const expression = parseBooleanExpression(inputValue);
      onExpressionSubmit(expression);
      setIsValid(true);
    } catch {
      onError('Invalid boolean expression. Please check your syntax.');
      setIsValid(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-600/50">
          <label htmlFor="expression" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 text-center transition-colors duration-200">
            Enter Boolean Expression
          </label>
          <div className="relative">
            <input
              id="expression"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsValid(true);
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., abc /\ (x -> abc) or A /\ (B \/ C)"
              className={`w-full px-6 py-4 border-2 rounded-xl shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-mono text-center transition-all duration-200 ${
                isValid 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'border-red-400 dark:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-600/50">
          <div className="text-sm text-gray-700 dark:text-gray-200 text-center transition-colors duration-200">
            <p className="mb-3 font-semibold text-lg">Supported operators:</p>
            <div className="grid grid-cols-2 gap-3 text-sm max-w-xs mx-auto">
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-blue-200 dark:border-blue-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-blue-800 dark:text-blue-300 font-bold text-lg">/\</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(AND)</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-green-200 dark:border-green-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-green-800 dark:text-green-300 font-bold text-lg">\/</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(OR)</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-purple-200 dark:border-purple-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-purple-800 dark:text-purple-300 font-bold text-lg">-&gt;</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(IMPLIES)</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-red-200 dark:border-red-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-red-800 dark:text-red-300 font-bold text-lg">!</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(NOT)</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm max-w-xs mx-auto">
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-yellow-200 dark:border-yellow-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-yellow-800 dark:text-yellow-300 font-bold text-lg">true</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(⊤)</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl border border-orange-200 dark:border-orange-600 shadow-md transition-all duration-200 hover:shadow-lg">
                <code className="text-orange-800 dark:text-orange-300 font-bold text-lg">false</code>
                <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">(⊥)</div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Use parentheses for grouping: <code className="text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-600/60 px-2 py-1 rounded">(A /\ B) \/ C</code></p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Examples: <code className="text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-600/60 px-2 py-1 rounded">abc /\ (x -&gt; def)</code>, <code className="text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-600/60 px-2 py-1 rounded">true -&gt; A</code>, <code className="text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-600/60 px-2 py-1 rounded">!A \/ B</code></p>
          </div>
        </div>
      </form>
    </div>
  );
};
