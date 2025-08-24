import React, { useState } from 'react';
import type { BooleanExpression } from '../types/boolean';
import { parseBooleanExpression } from '../utils/parser';

interface VariableInstantiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instantiations: Map<string, BooleanExpression>) => void;
  newVariables: Map<string, string>;
  ruleName: string;
}

export const VariableInstantiationModal: React.FC<VariableInstantiationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  newVariables,
  ruleName
}) => {
  const [instantiations, setInstantiations] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  if (!isOpen) return null;

  const handleVariableChange = (varName: string, value: string) => {
    const newInstantiations = new Map(instantiations);
    newInstantiations.set(varName, value);
    setInstantiations(newInstantiations);

    // Clear error for this variable
    const newErrors = new Map(errors);
    newErrors.delete(varName);
    setErrors(newErrors);
  };

  const handleConfirm = () => {
    // Validate all variables have values
    const newErrors = new Map<string, string>();
    const parsedInstantiations = new Map<string, BooleanExpression>();

    for (const [varName] of newVariables) {
      const value = instantiations.get(varName);
      if (!value || value.trim() === '') {
        newErrors.set(varName, 'Variable must have a value');
        continue;
      }

      try {
        const parsed = parseBooleanExpression(value.trim());
        parsedInstantiations.set(varName, parsed);
      } catch (error) {
        newErrors.set(varName, 'Invalid boolean expression');
      }
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm(parsedInstantiations);
    onClose();
  };

  const getVariablePlaceholder = (varType: string): string => {
    if (varType === 'greek') {
      return 'e.g., φ, ψ, χ, α, β';
    } else if (varType === 'ascii') {
      return 'e.g., ?a, ?b, ?c';
    }
    return 'Enter expression';
  };

  const getVariableDescription = (varType: string): string => {
    if (varType === 'greek') {
      return 'Greek letter variable (φ, ψ, χ, α, β, etc.)';
    } else if (varType === 'ascii') {
      return 'ASCII variable (?a, ?b, ?c, etc.)';
    }
    return 'Variable';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Variable Instantiation Required
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            The rule "{ruleName}" introduces new variables that need to be instantiated.
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {Array.from(newVariables.entries()).map(([varName, varType]) => (
              <div key={varName} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {varName} ({getVariableDescription(varType)})
                </label>
                <input
                  type="text"
                  value={instantiations.get(varName) || ''}
                  onChange={(e) => handleVariableChange(varName, e.target.value)}
                  placeholder={getVariablePlaceholder(varType)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.has(varName)
                      ? 'border-red-500 dark:border-red-400'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.has(varName) && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.get(varName)}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter a boolean expression to substitute for {varName}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Apply Rule
          </button>
        </div>
      </div>
    </div>
  );
};
