import React, { useState } from 'react';
import type { TransformationRule, BooleanExpression } from '../types/boolean';
import { RuleEngine } from '../utils/ruleEngine';

interface RuleSelectorProps {
  expression: BooleanExpression;
  onRuleSelect: (rule: TransformationRule, direction: 'left-to-right' | 'right-to-left', position: number[]) => void;
  onClose: () => void;
}

export const RuleSelector: React.FC<RuleSelectorProps> = ({ expression, onRuleSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRule, setSelectedRule] = useState<TransformationRule | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [hideNonApplicable, setHideNonApplicable] = useState(false);
  
  const ruleEngine = new RuleEngine();
  const allRules = ruleEngine.getRules();
  const allApplications = ruleEngine.getAllPossibleApplications(expression);
  
    // Get unique categories
  const categories = ['all', ...Array.from(new Set(allRules.map(rule => rule.category)))];
  
  // Group applications by rule
  const applicationsByRule = new Map<string, Array<{
    direction: 'left-to-right' | 'right-to-left';
    position: number[];
    description: string;
    fullPreview: string; // Added for full expression preview
  }>>();

  for (const app of allApplications) {
    if (!applicationsByRule.has(app.rule.id)) {
      applicationsByRule.set(app.rule.id, []);
    }
    applicationsByRule.get(app.rule.id)!.push({
      direction: app.direction,
      position: app.position,
      description: app.description,
      fullPreview: app.fullPreview // Store full preview
    });
  }

  const handleRuleClick = (rule: TransformationRule) => {
    const applications = applicationsByRule.get(rule.id);
    if (applications && applications.length > 0) {
      setSelectedRule(rule);
      setShowApplications(true);
    }
  };

  const handleApplicationSelect = (direction: 'left-to-right' | 'right-to-left', position: number[]) => {
    if (selectedRule) {
      onRuleSelect(selectedRule, direction, position);
      onClose();
    }
  };

  const getRuleStatus = (rule: TransformationRule) => {
    const applications = applicationsByRule.get(rule.id);
    if (!applications || applications.length === 0) {
      return 'disabled';
    }
    if (applications.length === 1) {
      return 'single';
    }
    return 'multiple';
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disabled':
        return '❌';
      case 'single':
        return '➡️';
      case 'multiple':
        return '🔄';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Select Transformation Rule
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Rules' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Hide Non-Applicable Rules Checkbox */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="hideNonApplicable"
              checked={hideNonApplicable}
              onChange={(e) => setHideNonApplicable(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="hideNonApplicable"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Hide non-applicable rules
            </label>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showApplications && selectedRule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Applications for: {selectedRule.name}
                </h3>
                <button
                  onClick={() => setShowApplications(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ← Back to rules
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {selectedRule.description}
                </p>
                
                <div className="space-y-3">
                  {applicationsByRule.get(selectedRule.id)?.map((app, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => handleApplicationSelect(app.direction, app.position)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {app.description}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {app.direction === 'left-to-right' ? '(L→R)' : '(R→L)'}
                          </span>
                        </div>
                        <span className="text-blue-500 text-sm font-medium">
                          Apply
                        </span>
                      </div>
                      {app.position.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Position: {app.position.join(' → ')}
                        </div>
                      )}
                      {/* Full expression preview */}
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Full expression after transformation:
                        </div>
                        <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {app.fullPreview}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group rules by category and add separators */}
              {categories.filter(cat => cat !== 'all').map(category => {
                // If a specific category is selected, only show that category
                if (selectedCategory !== 'all' && selectedCategory !== category) {
                  return null;
                }
                
                let categoryRules = allRules.filter(rule => rule.category === category);
                
                // Filter out non-applicable rules if checkbox is checked
                if (hideNonApplicable) {
                  categoryRules = categoryRules.filter(rule => {
                    const applications = applicationsByRule.get(rule.id);
                    return applications && applications.length > 0;
                  });
                }
                
                // Always show categories when "All Rules" is selected
                // Only filter by applicability when a specific category is selected
                if (selectedCategory !== 'all' && categoryRules.length === 0) {
                  return null;
                }
                
                return (
                  <div key={category} className="space-y-4">
                    {/* Category Header */}
                    {selectedCategory === 'all' && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {category.charAt(0).toUpperCase() + category.slice(1)} Rules
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    </div>)}
                    
                    {/* Rules in this category */}
                    <div className="grid gap-4">
                      {categoryRules.map(rule => {
                        const status = getRuleStatus(rule);
                        const applications = applicationsByRule.get(rule.id);
                        
                        return (
                          <div
                            key={rule.id}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              status === 'disabled' 
                                ? 'border-gray-200 dark:border-gray-700' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{getStatusIcon(status)}</span>
                                  <h3 className={`font-semibold ${status === 'disabled' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                    {rule.name}
                                  </h3>
                                  {applications && applications.length > 1 && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-200">
                                      {applications.length} options
                                    </span>
                                  )}
                                </div>
                                
                                <p className={`text-sm mb-2 ${status === 'disabled' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                  {rule.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className={`px-2 py-1 rounded ${
                                    status === 'disabled' 
                                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600' 
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                  }`}>
                                    {rule.category}
                                  </span>
                                  {applications && applications.length > 0 && (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-200">
                                      Applicable
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {status !== 'disabled' && (
                                <button
                                  onClick={() => handleRuleClick(rule)}
                                  className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {applications && applications.length > 1 ? 'Choose...' : 'Apply'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
