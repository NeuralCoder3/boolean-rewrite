import React from 'react';
import type { TransformationStep as TransformationStepType } from '../types/boolean';
import { renderExpression } from '../utils/expressionRenderer';

interface TransformationStepProps {
  step: TransformationStepType;
  onRuleClick?: () => void;
}

export const TransformationStep: React.FC<TransformationStepProps> = ({ 
  step, 
  onRuleClick 
}) => {
  return (
    <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-lg">
      {/* From Expression */}
      <div className="flex-1">
        <div className="text-lg text-gray-500 mb-2 text-center">From:</div>
        <div className="font-mono text-xl bg-white px-4 py-3 rounded border text-center">
          {renderExpression(step.from)}
        </div>
      </div>

      {/* Equivalence Symbol with Rule Name */}
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">≡</div>
        {onRuleClick && (
          <button
            onClick={onRuleClick}
            className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer text-center max-w-32"
            title="Click to see rule details"
          >
            {step.rule.name}
          </button>
        )}
      </div>

      {/* To Expression */}
      <div className="flex-1">
        <div className="text-lg text-gray-500 mb-2 text-center">To:</div>
        <div className="font-mono text-xl bg-white px-4 py-3 rounded border text-center">
          {renderExpression(step.to)}
        </div>
      </div>
    </div>
  );
};
