import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  FlaskConical, 
  Database, 
  BarChart3,
  Target,
  Info,
  TrendingUp,
  Users,
  Zap,
  PieChart,
  Eye,
  Activity
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

interface ExperimentDetailProps {
  experimentId: string;
  onBack: () => void;
}

// Enhanced detailed experiment data based on Figma design prompt
const getExperimentDetails = (id: string) => {
  const details: { [key: string]: any } = {
    'product_level': {
      id: 'product_level',
      name: 'Product Level Baseline',
      algorithm: 'Baseline',
      algorithmType: 'Logistic Regression',
      mode_desc_short: 'Baseline product-level classification',
      mode_desc_long: 'Baseline product-level classification without additional preprocessing. Uses basic features extracted from product metadata and historical sales data. This serves as the foundation for comparison with more sophisticated models.',
      auc: 0.720,
      auc_std: 0.03,
      precision: 0.180,
      recall: 0.110,
      f1: 0.130,
      accuracy: 0.850,
      preprocessing: ['StandardScaler', 'Missing Value Imputation'],
      hyperparameters: {
        C: 1.0,
        max_iter: 1000,
        solver: 'liblinear',
        penalty: 'l2'
      },
      dataSummary: {
        totalSamples: 7196,
        positiveSamples: 423,
        negativeSamples: 6773,
        imbalanceRatio: 16.0,
        denseFeatures: 10,
        tfidfFeatures: 100,
        cutoffDate: '2024-01-15',
        keywordFilter: 'electronics, tech',
        excludeProducts: 'discontinued, test'
      }
    },
    'd0dca4c6': {
      id: 'd0dca4c6',
      name: 'XGB Class Weight',
      algorithm: 'XGBoost',
      algorithmType: 'XGBoost Classifier',
      mode_desc_short: 'XGBoost with class weight balancing',
      mode_desc_long: 'XGBoost with class weight balancing for imbalanced dataset. Automatically adjusts class weights to handle the imbalanced nature of the dataset. Uses gradient boosting with regularization to prevent overfitting.',
      auc: 0.735,
      auc_std: 0.025,
      precision: 0.210,
      recall: 0.125,
      f1: 0.156,
      accuracy: 0.870,
      preprocessing: ['Feature Selection', 'Missing Value Imputation', 'Label Encoding'],
      hyperparameters: {
        n_estimators: 500,
        max_depth: 6,
        learning_rate: 0.1,
        scale_pos_weight: 16.0,
        subsample: 0.8,
        colsample_bytree: 0.8
      },
      dataSummary: {
        totalSamples: 7196,
        positiveSamples: 423,
        negativeSamples: 6773,
        imbalanceRatio: 16.0,
        denseFeatures: 10,
        tfidfFeatures: 100,
        cutoffDate: '2024-01-15',
        keywordFilter: 'electronics, tech',
        excludeProducts: 'discontinued, test'
      }
    },
    'dc7dd570': {
      id: 'dc7dd570',
      name: 'Random Oversample',
      algorithm: 'Random Oversample',
      algorithmType: 'Random Forest + Random Oversampling',
      mode_desc_short: 'Random oversampling to balance dataset',
      mode_desc_long: 'Random oversampling to balance minority class distribution before training. Randomly duplicates minority class samples to achieve class balance, then trains a Random Forest classifier on the balanced dataset.',
      auc: 0.701,
      auc_std: 0.035,
      precision: 0.172,
      recall: 0.138,
      f1: 0.154,
      accuracy: 0.845,
      preprocessing: ['Random Oversampling', 'StandardScaler', 'Feature Selection'],
      hyperparameters: {
        n_estimators: 200,
        max_depth: 8,
        min_samples_split: 5,
        min_samples_leaf: 2,
        random_state: 42
      },
      dataSummary: {
        totalSamples: 13546, // After oversampling
        positiveSamples: 6773,
        negativeSamples: 6773,
        imbalanceRatio: 1.0,
        denseFeatures: 10,
        tfidfFeatures: 100,
        cutoffDate: '2024-01-15',
        keywordFilter: 'electronics, tech',
        excludeProducts: 'discontinued, test'
      }
    },
    '8b0f585b': {
      id: '8b0f585b',
      name: 'SMOTE',
      algorithm: 'SMOTE',
      algorithmType: 'SMOTE + Random Forest',
      mode_desc_short: 'SMOTE oversampling technique',
      mode_desc_long: 'Synthetic Minority Oversampling Technique using k-nearest neighbors. Generates synthetic samples for the minority class to balance the dataset before training. Creates realistic synthetic examples by interpolating between existing minority class instances.',
      auc: 0.709,
      auc_std: 0.028,
      precision: 0.185,
      recall: 0.142,
      f1: 0.160,
      accuracy: 0.860,
      preprocessing: ['SMOTE Oversampling', 'StandardScaler', 'Feature Selection'],
      hyperparameters: {
        k_neighbors: 5,
        n_estimators: 200,
        max_depth: 10,
        min_samples_split: 2,
        min_samples_leaf: 1,
        random_state: 42
      },
      dataSummary: {
        totalSamples: 13546, // After SMOTE
        positiveSamples: 6773,
        negativeSamples: 6773,
        imbalanceRatio: 1.0,
        denseFeatures: 10,
        tfidfFeatures: 100,
        cutoffDate: '2024-01-15',
        keywordFilter: 'electronics, tech',
        excludeProducts: 'discontinued, test'
      }
    }
  };

  return details[id] || details['product_level'];
};

// Enhanced feature analysis data
const mockFeatureAnalysis = [
  { feature: 'price', cohens_d: -0.072, p_value: 0.121, significance: 'not_significant', overlap: 0.846, mutual_info: 0.000, importance: 0.15 },
  { feature: 'has_image_urls', cohens_d: 0.516, p_value: 1.5e-24, significance: 'significant', overlap: 1.000, mutual_info: 0.006, importance: 0.23 },
  { feature: 'score_mean', cohens_d: 0.776, p_value: 6.7e-34, significance: 'high_sep', overlap: 0.050, mutual_info: 0.024, importance: 0.18 },
  { feature: 'category_electronics', cohens_d: 0.32, p_value: 0.012, significance: 'significant', overlap: 0.78, mutual_info: 0.008, importance: 0.12 },
  { feature: 'review_count', cohens_d: 0.28, p_value: 0.034, significance: 'significant', overlap: 0.65, mutual_info: 0.005, importance: 0.11 },
  { feature: 'brand_premium', cohens_d: 0.38, p_value: 0.008, significance: 'significant', overlap: 0.72, mutual_info: 0.012, importance: 0.09 },
  { feature: 'availability', cohens_d: 0.15, p_value: 0.156, significance: 'not_significant', overlap: 0.88, mutual_info: 0.002, importance: 0.08 },
  { feature: 'shipping_cost', cohens_d: 0.19, p_value: 0.089, significance: 'not_significant', overlap: 0.82, mutual_info: 0.003, importance: 0.04 }
];

// Top TF-IDF features
const mockTfidfFeatures = [
  { token: 'premium', importance: 0.087, frequency: 1247 },
  { token: 'quality', importance: 0.074, frequency: 892 },
  { token: 'durable', importance: 0.069, frequency: 675 },
  { token: 'warranty', importance: 0.062, frequency: 543 },
  { token: 'professional', importance: 0.058, frequency: 421 },
  { token: 'certified', importance: 0.051, frequency: 387 },
  { token: 'advanced', importance: 0.048, frequency: 312 },
  { token: 'exclusive', importance: 0.045, frequency: 289 },
  { token: 'innovative', importance: 0.041, frequency: 234 },
  { token: 'compatible', importance: 0.038, frequency: 198 }
];

export function ExperimentDetail({ experimentId, onBack }: ExperimentDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const experiment = getExperimentDetails(experimentId);

  const classDistributionData = [
    { name: 'y=0 (Negative)', value: experiment.dataSummary.negativeSamples, color: 'hsl(var(--chart-1))' },
    { name: 'y=1 (Positive)', value: experiment.dataSummary.positiveSamples, color: 'hsl(var(--chart-2))' }
  ];

  const metricsData = [
    { name: 'AUC', value: experiment.auc },
    { name: 'Precision', value: experiment.precision },
    { name: 'Recall', value: experiment.recall },
    { name: 'F1-Score', value: experiment.f1 },
    { name: 'Accuracy', value: experiment.accuracy }
  ];

  const featureImportanceData = mockFeatureAnalysis.map(f => ({
    name: f.feature,
    Dense: f.importance,
    'TF-IDF': mockTfidfFeatures.find(t => t.token === f.feature)?.importance || 0
  }));

  const tfidfImportanceData = mockTfidfFeatures.slice(0, 10).map(f => ({
    name: f.token,
    importance: f.importance,
    frequency: f.frequency
  }));

  const getSignificanceBadge = (significance: string) => {
    switch (significance) {
      case 'significant':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Significant</Badge>;
      case 'high_sep':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">High Sep.</Badge>;
      case 'not_significant':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Not Sig.</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">{experiment.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{experiment.id}</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {experiment.algorithm}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Summary</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Algorithm Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Algorithm Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Short Description</h4>
                <p className="text-muted-foreground">{experiment.mode_desc_short}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Detailed Description</h4>
                <p className="text-muted-foreground leading-relaxed">{experiment.mode_desc_long}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="font-medium mb-2">Algorithm Type</h4>
                  <Badge variant="outline" className="px-3 py-1">{experiment.algorithmType}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Preprocessing Steps</h4>
                  <div className="flex flex-wrap gap-1">
                    {experiment.preprocessing.map((step: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AUC</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{experiment.auc.toFixed(3)} ± {experiment.auc_std.toFixed(2)}</span>
                      <Progress value={experiment.auc * 100} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Precision (y=1)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{experiment.precision.toFixed(3)}</span>
                      <Progress value={experiment.precision * 100} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recall (y=1)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{experiment.recall.toFixed(3)}</span>
                      <Progress value={experiment.recall * 100} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>F1-Score (y=1)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{experiment.f1.toFixed(3)}</span>
                      <Progress value={experiment.f1 * 100} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accuracy</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{experiment.accuracy.toFixed(3)}</span>
                      <Progress value={experiment.accuracy * 100} className="w-24 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Hyperparameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(experiment.hyperparameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm">{key}</span>
                      <span className="text-sm font-mono">{typeof value === 'number' ? value.toString() : String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Dataset Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Dataset Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Samples</span>
                    <span className="font-mono">{experiment.dataSummary.totalSamples.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positive Samples (y=1)</span>
                    <span className="font-mono">{experiment.dataSummary.positiveSamples.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative Samples (y=0)</span>
                    <span className="font-mono">{experiment.dataSummary.negativeSamples.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Imbalance Ratio</span>
                    <span className="font-mono">{experiment.dataSummary.imbalanceRatio.toFixed(1)} : 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dense Features</span>
                    <span className="font-mono">{experiment.dataSummary.denseFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TF-IDF Features</span>
                    <span className="font-mono">{experiment.dataSummary.tfidfFeatures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Class Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={classDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Data Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Cutoff Date</h4>
                  <p className="text-sm text-muted-foreground font-mono">{experiment.dataSummary.cutoffDate}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Keyword Filter</h4>
                  <p className="text-sm text-muted-foreground">{experiment.dataSummary.keywordFilter}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Exclude Products</h4>
                  <p className="text-sm text-muted-foreground">{experiment.dataSummary.excludeProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Dense Feature Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Dense Feature Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead>Cohen's d</TableHead>
                      <TableHead>p-value</TableHead>
                      <TableHead>Significance</TableHead>
                      <TableHead>Overlap</TableHead>
                      <TableHead>Mutual Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFeatureAnalysis.map((feature) => (
                      <TableRow key={feature.feature}>
                        <TableCell className="font-mono">{feature.feature}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{feature.cohens_d.toFixed(3)}</span>
                            <Progress value={Math.abs(feature.cohens_d) * 100} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {feature.p_value < 0.001 ? feature.p_value.toExponential(1) : feature.p_value.toFixed(3)}
                        </TableCell>
                        <TableCell>
                          {getSignificanceBadge(feature.significance)}
                        </TableCell>
                        <TableCell className="font-mono">{feature.overlap.toFixed(3)}</TableCell>
                        <TableCell className="font-mono">{feature.mutual_info.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Feature Importance Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dense Feature Importance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockFeatureAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="importance" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 TF-IDF Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tfidfImportanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="importance" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-6">
          {/* Dimensionality Reduction Plots */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PCA Visualization</CardTitle>
                <p className="text-sm text-muted-foreground">33.5% variance explained</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>PCA scatter plot</p>
                    <p className="text-xs">(y=0 vs y=1)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>t-SNE Visualization</CardTitle>
                <p className="text-sm text-muted-foreground">Perplexity: 30</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>t-SNE scatter plot</p>
                    <p className="text-xs">(y=0 vs y=1)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UMAP Visualization</CardTitle>
                <p className="text-sm text-muted-foreground">n_neighbors: 15</p>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>UMAP scatter plot</p>
                    <p className="text-xs">(y=0 vs y=1)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance Visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <p>Confusion Matrix</p>
                    <p className="text-xs">Click to drill-down misclassified samples</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROC / PR Curves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>ROC & Precision-Recall</p>
                    <p className="text-xs">Curves visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Curve */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Curve</CardTitle>
              <p className="text-sm text-muted-foreground">Training and validation loss per epoch</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Learning Curve</p>
                  <p className="text-xs">From artifacts/logs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}