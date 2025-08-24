import React, { useState } from 'react';
import { 
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';

interface BatchManagementProps {
  onExperimentClick: (experimentId: string) => void;
}

// Mock batch data with experiments (removed status from experiments and batches)
const mockBatches = [
  {
    id: 'batch_2024_01_15',
    name: 'Baseline Comparison',
    date: '2024-01-15',
    experiments: [
      { id: 'product_level', name: 'Product Level Baseline', algorithm: 'Baseline', auc: 0.72, precision: 0.18, recall: 0.11, f1: 0.13 },
      { id: 'd0dca4c6', name: 'XGB Class Weight', algorithm: 'XGBoost', auc: 0.73, precision: 0.21, recall: 0.12, f1: 0.15 },
      { id: 'dc7dd570', name: 'Random Oversample', algorithm: 'Sampling', auc: 0.71, precision: 0.20, recall: 0.13, f1: 0.16 },
      { id: '8b0f585b', name: 'SMOTE', algorithm: 'Sampling', auc: 0.74, precision: 0.22, recall: 0.14, f1: 0.17 }
    ]
  },
  {
    id: 'batch_2024_01_10',
    name: 'Sampling Methods',
    date: '2024-01-10',
    experiments: [
      { id: 'exp_2024_01_10_1', name: 'Deep Learning', algorithm: 'Neural Network', auc: 0.69, precision: 0.19, recall: 0.10, f1: 0.13 },
      { id: 'exp_2024_01_10_2', name: 'Random Forest', algorithm: 'Ensemble', auc: 0.70, precision: 0.17, recall: 0.09, f1: 0.12 },
      { id: 'exp_2024_01_10_3', name: 'SVM with RBF', algorithm: 'SVM', auc: 0.68, precision: 0.16, recall: 0.08, f1: 0.11 },
      { id: 'exp_2024_01_10_4', name: 'Gradient Boosting', algorithm: 'Ensemble', auc: 0.71, precision: 0.18, recall: 0.11, f1: 0.14 },
      { id: 'exp_2024_01_10_5', name: 'Naive Bayes', algorithm: 'Probabilistic', auc: 0.64, precision: 0.14, recall: 0.07, f1: 0.09 },
      { id: 'exp_2024_01_10_6', name: 'KNN', algorithm: 'Instance-based', auc: 0.66, precision: 0.15, recall: 0.08, f1: 0.10 }
    ]
  },
  {
    id: 'batch_2024_01_05',
    name: 'Feature Engineering',
    date: '2024-01-05',
    experiments: [
      { id: 'exp_2024_01_05_1', name: 'PCA + XGBoost', algorithm: 'Dimensionality Reduction', auc: 0.69, precision: 0.17, recall: 0.09, f1: 0.12 },
      { id: 'exp_2024_01_05_2', name: 'Feature Selection + RF', algorithm: 'Feature Selection', auc: 0.71, precision: 0.19, recall: 0.11, f1: 0.14 },
      { id: 'exp_2024_01_05_3', name: 'Polynomial Features', algorithm: 'Feature Engineering', auc: 0.67, precision: 0.15, recall: 0.08, f1: 0.10 },
      { id: 'exp_2024_01_05_4', name: 'Interaction Features', algorithm: 'Feature Engineering', auc: 0.70, precision: 0.18, recall: 0.10, f1: 0.13 },
      { id: 'exp_2024_01_05_5', name: 'Text Embeddings', algorithm: 'NLP', auc: 0.72, precision: 0.20, recall: 0.12, f1: 0.15 },
      { id: 'exp_2024_01_05_6', name: 'Time Features', algorithm: 'Feature Engineering', auc: 0.68, precision: 0.16, recall: 0.09, f1: 0.11 },
      { id: 'exp_2024_01_05_7', name: 'Categorical Encoding', algorithm: 'Feature Engineering', auc: 0.69, precision: 0.17, recall: 0.10, f1: 0.12 },
      { id: 'exp_2024_01_05_8', name: 'Outlier Detection', algorithm: 'Preprocessing', auc: 0.70, precision: 0.18, recall: 0.11, f1: 0.13 }
    ]
  }
];

export function BatchManagement({ onExperimentClick }: BatchManagementProps) {
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set(['batch_2024_01_15']));

  const toggleBatch = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const getAlgorithmBadge = (algorithm: string) => {
    const colors = {
      'Baseline': 'bg-gray-100 text-gray-800 border-gray-200',
      'XGBoost': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sampling': 'bg-orange-100 text-orange-800 border-orange-200',
      'Neural Network': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Ensemble': 'bg-teal-100 text-teal-800 border-teal-200',
      'SVM': 'bg-pink-100 text-pink-800 border-pink-200',
      'Probabilistic': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Instance-based': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Dimensionality Reduction': 'bg-lime-100 text-lime-800 border-lime-200',
      'Feature Selection': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Feature Engineering': 'bg-violet-100 text-violet-800 border-violet-200',
      'NLP': 'bg-rose-100 text-rose-800 border-rose-200',
      'Preprocessing': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    const colorClass = colors[algorithm as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${colorClass}`}>
        {algorithm}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analysis Batches Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-semibold">
          <Calendar className="h-5 w-5" />
          Analysis Batches
        </h3>
      </div>

      {/* Batch List */}
      <div className="space-y-4">
        {mockBatches.map((batch) => (
          <div key={batch.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            {/* Batch Header */}
            <button
              onClick={() => toggleBatch(batch.id)}
              className="w-full p-6 hover:bg-muted/50 transition-colors rounded-t-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedBatches.has(batch.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="text-left">
                    <h4 className="text-base font-semibold">{batch.name}</h4>
                    <p className="text-sm text-muted-foreground">{batch.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {batch.experiments.length} experiments
                    </div>
                    <div className="text-sm">
                      Best AUC: {Math.max(...batch.experiments.map(e => e.auc)).toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            </button>
            
            {/* Expanded Content */}
            {expandedBatches.has(batch.id) && (
              <div className="border-t p-6 pt-0">
                <div className="mt-6 rounded-md border overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Experiment</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Algorithm</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">AUC</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Precision</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Recall</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">F1-Score</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.experiments.map((experiment) => (
                        <tr key={experiment.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 align-middle">
                            <div>
                              <div className="text-xs text-muted-foreground font-mono">{experiment.id}</div>
                              <div className="text-sm">{experiment.name}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {getAlgorithmBadge(experiment.algorithm)}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{experiment.auc.toFixed(3)}</span>
                              <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${experiment.auc * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{experiment.precision.toFixed(3)}</span>
                              <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${experiment.precision * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{experiment.recall.toFixed(3)}</span>
                              <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${experiment.recall * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{experiment.f1.toFixed(3)}</span>
                              <div className="w-12 h-1 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${experiment.f1 * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onExperimentClick(experiment.id);
                              }}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}