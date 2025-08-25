import React from 'react';
import type { TransformationStep as TransformationStepType, BooleanExpression } from '../types/boolean';
import { TransformationStep } from './TransformationStep';
import { renderExpression } from '../utils/expressionRenderer';

interface TransformationChainProps {
  steps: TransformationStepType[];
  currentExpression: BooleanExpression;
  onRuleClick?: (rule: TransformationStepType['rule']) => void;
  onUndoToStep?: (stepIndex: number) => void;
}

export const TransformationChain: React.FC<TransformationChainProps> = ({
  steps,
  currentExpression,
  onRuleClick,
  onUndoToStep
}) => {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 text-center mb-8">
        Transformation Chain
      </h3>
      
      {/* Initial Expression */}
      <div className="text-center mb-8">
        <div className="text-lg text-gray-500 dark:text-gray-400 mb-3">Initial Expression:</div>
        <div className="font-mono text-2xl bg-blue-50 px-6 py-4 rounded-lg border-2 border-blue-200 inline-block">
          {renderExpression(currentExpression)}
        </div>
      </div>

      {/* Transformation Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Step Number */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {index + 1}
            </div>
            
            <TransformationStep 
              step={step} 
              onRuleClick={() => onRuleClick?.(step.rule)}
            />
            
            {/* Undo Button */}
            {onUndoToStep && (
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => onUndoToStep(index)}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 shadow-lg hover:shadow-xl"
                  title={`Undo to step ${index + 1}`}
                >
                  ↶
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Expression */}
      <div className="text-center pt-8 border-t-2 border-gray-200 mt-8">
        <div className="text-lg text-gray-500 dark:text-gray-400 mb-3">Current Expression:</div>
        <div className="font-mono text-2xl bg-green-50 px-6 py-4 rounded-lg border-2 border-green-200 inline-block">
          {renderExpression(currentExpression)}
        </div>
      </div>
    </div>
  );
};
