import React, { useState } from 'react';
import { ExperimentOverview } from './components/ExperimentOverview';
import { BatchManagement } from './components/BatchManagement';
import { ExperimentDetail } from './components/ExperimentDetail';
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  BarChart3,
  Calendar,
  ChevronDown
} from 'lucide-react';

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
    date: '2024-01-15'
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
    date: '2024-01-15'
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
    date: '2024-01-15'
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
    date: '2024-01-15'
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
    date: '2024-01-10'
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
    date: '2024-01-10'
  }
];

// Mock data for analysis batches
const mockBatches = [
  { id: 'batch_2024_01_15', date: '2024-01-15', name: 'Baseline Comparison', experimentCount: 4 },
  { id: 'batch_2024_01_10', date: '2024-01-10', name: 'Sampling Methods', experimentCount: 6 },
  { id: 'batch_2024_01_05', date: '2024-01-05', name: 'Feature Engineering', experimentCount: 8 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState(mockBatches[0].id);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  // Calculate KPIs based on selected batch
  const filteredExperiments = mockExperiments.filter(exp => exp.batchId === selectedBatch);

  const mockKPIs = {
    totalExperiments: filteredExperiments.length,
    bestAUC: filteredExperiments.length > 0 ? Math.max(...filteredExperiments.map(exp => exp.auc)) : 0,
    bestPrecision: filteredExperiments.length > 0 ? Math.max(...filteredExperiments.map(exp => exp.precision)) : 0,
    activeBatches: mockBatches.length
  };

  const selectedBatchInfo = mockBatches.find(batch => batch.id === selectedBatch);

  const handleExperimentClick = (experimentId: string) => {
    setSelectedExperiment(experimentId);
  };

  const handleBackToOverview = () => {
    setSelectedExperiment(null);
  };

  // If an experiment is selected, show the detail view
  if (selectedExperiment) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-6 py-8">
          <ExperimentDetail 
            experimentId={selectedExperiment}
            onBack={handleBackToOverview}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl tracking-tight">ML Experiment Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Compare machine learning experiments and analyze model performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Analysis Batch:</label>
              <div className="relative">
                <button
                  onClick={() => setSelectOpen(!selectOpen)}
                  className="flex h-9 w-56 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <span>
                    {selectedBatchInfo ? `${selectedBatchInfo.name} (${selectedBatchInfo.date})` : 'Select Analysis Batch'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
                {selectOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-1">
                      {mockBatches.map((batch) => (
                        <button
                          key={batch.id}
                          onClick={() => {
                            setSelectedBatch(batch.id);
                            setSelectOpen(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        >
                          {batch.name} ({batch.date})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="grid w-full grid-cols-2 max-w-lg h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'overview'
                  ? 'bg-background text-foreground shadow'
                  : 'hover:bg-muted-foreground/10'
              }`}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Experiment Overview
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'batches'
                  ? 'bg-background text-foreground shadow'
                  : 'hover:bg-muted-foreground/10'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Batch Management
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Current Batch Info Banner */}
        {selectedBatchInfo && (
          <div className="mb-8 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 text-card-foreground shadow-sm">
            <div className="py-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {selectedBatchInfo.name}
                    </h3>
                    <p className="text-blue-700">
                      Analysis batch from {selectedBatchInfo.date} • {filteredExperiments.length} experiments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600">Best AUC Score</div>
                  <div className="text-3xl font-bold text-blue-900">{mockKPIs.bestAUC.toFixed(3)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div 
            className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm"
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
              <h3 className="text-sm font-medium">Total Experiments</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FlaskConical className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold">{mockKPIs.totalExperiments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {selectedBatchInfo?.name || 'selected batch'}
              </p>
            </div>
          </div>

          <div className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
              <h3 className="text-sm font-medium">Best AUC Score</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold">{mockKPIs.bestAUC.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(() => {
                  const bestExp = filteredExperiments.find(exp => exp.auc === mockKPIs.bestAUC);
                  return bestExp ? bestExp.name : 'No experiments';
                })()}
              </p>
            </div>
          </div>

          <div className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
              <h3 className="text-sm font-medium">Best Precision (y=1)</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold">{mockKPIs.bestPrecision.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {filteredExperiments.length} experiments
              </p>
            </div>
          </div>

          <div 
            className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-lg border bg-card text-card-foreground shadow-sm"
            onClick={() => setActiveTab('batches')}
          >
            <div className="flex flex-row items-center justify-between space-y-0 pb-3 p-6">
              <h3 className="text-sm font-medium">Active Batches</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="text-3xl font-bold">{mockKPIs.activeBatches}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Analysis runs available
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ExperimentOverview 
                selectedBatch={selectedBatch}
                onExperimentClick={handleExperimentClick}
              />
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="space-y-8">
              <BatchManagement onExperimentClick={handleExperimentClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}