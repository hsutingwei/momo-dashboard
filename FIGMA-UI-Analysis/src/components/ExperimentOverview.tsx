import React, { useState } from 'react';
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  BarChart3,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock experiment data
const mockExperiments = [
  {
    id: 'product_level',
    name: 'Product Level Baseline',
    algorithm: 'Baseline',
    auc: 0.72,
    precision: 0.18,
    recall: 0.11,
    f1: 0.13,
    batchId: 'batch_2024_01_15',
    date: '2024-01-15',
    description: 'Baseline product-level classification without additional preprocessing'
  },
  {
    id: 'd0dca4c6',
    name: 'XGB Class Weight',
    algorithm: 'XGBoost',
    auc: 0.73,
    precision: 0.21,
    recall: 0.12,
    f1: 0.15,
    batchId: 'batch_2024_01_15',
    date: '2024-01-15',
    description: 'XGBoost with class weight balancing for imbalanced dataset'
  },
  {
    id: 'dc7dd570',
    name: 'Random Oversample',
    algorithm: 'Sampling',
    auc: 0.71,
    precision: 0.20,
    recall: 0.13,
    f1: 0.16,
    batchId: 'batch_2024_01_15',
    date: '2024-01-15',
    description: 'Random oversampling to balance minority class distribution'
  },
  {
    id: '8b0f585b',
    name: 'SMOTE',
    algorithm: 'Sampling',
    auc: 0.74,
    precision: 0.22,
    recall: 0.14,
    f1: 0.17,
    batchId: 'batch_2024_01_15',
    date: '2024-01-15',
    description: 'Synthetic Minority Oversampling Technique using k-nearest neighbors'
  },
  {
    id: 'exp_2024_01_10_1',
    name: 'Deep Learning',
    algorithm: 'Neural Network',
    auc: 0.69,
    precision: 0.19,
    recall: 0.10,
    f1: 0.13,
    batchId: 'batch_2024_01_10',
    date: '2024-01-10',
    description: 'Deep neural network with dropout and batch normalization'
  },
  {
    id: 'exp_2024_01_10_2',
    name: 'Random Forest',
    algorithm: 'Ensemble',
    auc: 0.70,
    precision: 0.17,
    recall: 0.09,
    f1: 0.12,
    batchId: 'batch_2024_01_10',
    date: '2024-01-10',
    description: 'Random Forest with feature importance analysis'
  }
];

interface ExperimentOverviewProps {
  selectedBatch: string;
  onExperimentClick: (experimentId: string) => void;
}

export function ExperimentOverview({ selectedBatch, onExperimentClick }: ExperimentOverviewProps) {
  // Filter experiments by selected batch
  const filteredExperiments = mockExperiments.filter(exp => exp.batchId === selectedBatch);

  // Prepare chart data
  const chartData = filteredExperiments.map(exp => ({
    name: exp.name.length > 15 ? exp.name.substring(0, 15) + '...' : exp.name,
    fullName: exp.name,
    AUC: exp.auc,
    'Precision (y=1)': exp.precision,
    'Recall (y=1)': exp.recall,
    'F1-Score (y=1)': exp.f1,
    id: exp.id
  }));

  const getAlgorithmBadge = (algorithm: string) => {
    const colors = {
      'Baseline': 'bg-gray-100 text-gray-800 border-gray-200',
      'XGBoost': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sampling': 'bg-orange-100 text-orange-800 border-orange-200',
      'Neural Network': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Ensemble': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    const colorClass = colors[algorithm as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${colorClass}`}>
        {algorithm}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Performance Analysis</h2>
          <p className="text-muted-foreground">
            Showing {filteredExperiments.length} experiments from batch {filteredExperiments[0]?.date}
          </p>
        </div>
      </div>

      {filteredExperiments.length === 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-center h-64 px-6">
            <div className="text-center">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Experiments Found</h3>
              <p className="text-muted-foreground">
                No experiments found in the selected batch
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Performance Comparison Chart */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <BarChart3 className="h-5 w-5" />
                Performance Comparison
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload;
                        return item?.fullName || label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="AUC" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="Precision (y=1)" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="Recall (y=1)" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="F1-Score (y=1)" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Experiments Table */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <FlaskConical className="h-5 w-5" />
                Experiment Results
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Experiment</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Algorithm</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">AUC</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Precision (y=1)</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Recall (y=1)</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">F1-Score (y=1)</th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExperiments.map((experiment) => (
                      <tr key={experiment.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          <div>
                            <div className="font-mono text-sm text-muted-foreground">{experiment.id}</div>
                            <div className="font-medium">{experiment.name}</div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {getAlgorithmBadge(experiment.algorithm)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{experiment.auc.toFixed(3)}</span>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${experiment.auc * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{experiment.precision.toFixed(3)}</span>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${experiment.precision * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{experiment.recall.toFixed(3)}</span>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${experiment.recall * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{experiment.f1.toFixed(3)}</span>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${experiment.f1 * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <button
                            onClick={() => onExperimentClick(experiment.id)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  Best Performing
                </h3>
              </div>
              <div className="p-6 pt-0">
                {(() => {
                  if (filteredExperiments.length === 0) {
                    return (
                      <div className="text-center text-muted-foreground">
                        No data available
                      </div>
                    );
                  }
                  const best = filteredExperiments.reduce((max, exp) => 
                    exp.auc > max.auc ? exp : max
                  );
                  return (
                    <div className="space-y-3">
                      <div className="font-mono text-sm text-muted-foreground">{best.id}</div>
                      <div className="font-medium">{best.name}</div>
                      <div className="text-2xl font-bold">AUC: {best.auc.toFixed(3)}</div>
                      <span className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{best.algorithm}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                  Highest Precision
                </h3>
              </div>
              <div className="p-6 pt-0">
                {(() => {
                  if (filteredExperiments.length === 0) {
                    return (
                      <div className="text-center text-muted-foreground">
                        No data available
                      </div>
                    );
                  }
                  const best = filteredExperiments.reduce((max, exp) => 
                    exp.precision > max.precision ? exp : max
                  );
                  return (
                    <div className="space-y-3">
                      <div className="font-mono text-sm text-muted-foreground">{best.id}</div>
                      <div className="font-medium">{best.name}</div>
                      <div className="text-2xl font-bold">Precision: {best.precision.toFixed(3)}</div>
                      <span className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{best.algorithm}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  Best F1-Score
                </h3>
              </div>
              <div className="p-6 pt-0">
                {(() => {
                  if (filteredExperiments.length === 0) {
                    return (
                      <div className="text-center text-muted-foreground">
                        No data available
                      </div>
                    );
                  }
                  const best = filteredExperiments.reduce((max, exp) => 
                    exp.f1 > max.f1 ? exp : max
                  );
                  return (
                    <div className="space-y-3">
                      <div className="font-mono text-sm text-muted-foreground">{best.id}</div>
                      <div className="font-medium">{best.name}</div>
                      <div className="text-2xl font-bold">F1: {best.f1.toFixed(3)}</div>
                      <span className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">{best.algorithm}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}