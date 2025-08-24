import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Mock data for analysis
const mockTimeSeriesData = [
  { date: '2024-02-01', sales: 120, sentiment: 0.45, keywords: 0.62 },
  { date: '2024-02-02', sales: 135, sentiment: 0.52, keywords: 0.58 },
  { date: '2024-02-03', sales: 128, sentiment: 0.48, keywords: 0.65 },
  { date: '2024-02-04', sales: 142, sentiment: 0.61, keywords: 0.72 },
  { date: '2024-02-05', sales: 156, sentiment: 0.58, keywords: 0.68 },
  { date: '2024-02-06', sales: 149, sentiment: 0.55, keywords: 0.71 },
  { date: '2024-02-07', sales: 163, sentiment: 0.63, keywords: 0.75 },
  { date: '2024-02-08', sales: 171, sentiment: 0.67, keywords: 0.78 },
  { date: '2024-02-09', sales: 158, sentiment: 0.59, keywords: 0.73 },
  { date: '2024-02-10', sales: 185, sentiment: 0.72, keywords: 0.81 }
];

const mockCorrelationData = [
  { feature: 'Positive Keywords', correlation: 0.78, color: '#22c55e' },
  { feature: 'Sentiment Score', correlation: 0.65, color: '#3b82f6' },
  { feature: 'Review Volume', correlation: 0.52, color: '#f59e0b' },
  { feature: 'Rating Score', correlation: 0.48, color: '#8b5cf6' },
  { feature: 'Negative Keywords', correlation: -0.34, color: '#ef4444' },
  { feature: 'Complaint Rate', correlation: -0.42, color: '#dc2626' }
];

export function AnalysisPanel() {
  const [selectedMethod, setSelectedMethod] = useState('lda');
  const [beforeRecords, setBeforeRecords] = useState([10]);
  const [afterRecords, setAfterRecords] = useState([5]);

  const getMethodName = (method: string) => {
    switch (method) {
      case 'lda': return 'LDA Keywords';
      case 'tfidf': return 'TF-IDF Keywords';
      case 'ckip': return 'CKIP Sentiment';
      case 'bert': return 'BERT Sentiment';
      default: return method;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Influence Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Selector */}
          <div className="space-y-2">
            <label>Analysis Method</label>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lda">LDA Keywords</SelectItem>
                <SelectItem value="tfidf">TF-IDF Keywords</SelectItem>
                <SelectItem value="ckip">CKIP Sentiment</SelectItem>
                <SelectItem value="bert">BERT Sentiment</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="text-xs">
              Current: {getMethodName(selectedMethod)}
            </Badge>
          </div>

          <Separator />

          {/* Time Window Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label>Records Before Sales Change</label>
              <div className="px-2">
                <Slider
                  value={beforeRecords}
                  onValueChange={setBeforeRecords}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Reviewing {beforeRecords[0]} records before
              </div>
            </div>

            <div className="space-y-2">
              <label>Records After Sales Change</label>
              <div className="px-2">
                <Slider
                  value={afterRecords}
                  onValueChange={setAfterRecords}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Reviewing {afterRecords[0]} records after
              </div>
            </div>
          </div>

          <Separator />

          {/* Analysis Summary */}
          <div className="space-y-2">
            <h4>Analysis Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Method: {getMethodName(selectedMethod)}</p>
              <p>• Time window: -{beforeRecords[0]} to +{afterRecords[0]} records</p>
              <p>• Data points analyzed: {mockTimeSeriesData.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Correlation with Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockCorrelationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[-1, 1]} />
              <YAxis type="category" dataKey="feature" width={120} />
              <Tooltip 
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Correlation']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                {mockCorrelationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time Series Analysis */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Sales & {getMethodName(selectedMethod)} Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => {
                  if (name === 'sales') return [value, 'Sales Count'];
                  return [(value * 100).toFixed(1) + '%', name === 'sentiment' ? 'Sentiment Score' : 'Keyword Score'];
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sales" 
                stroke="#2563eb" 
                strokeWidth={3}
                name="sales"
                dot={{ fill: '#2563eb', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey={selectedMethod.includes('sentiment') ? 'sentiment' : 'keywords'} 
                stroke="#dc2626" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name={selectedMethod.includes('sentiment') ? 'sentiment' : 'keywords'}
                dot={{ fill: '#dc2626', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-600"></div>
              <span>Sales Count</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-600 border-dashed"></div>
              <span>{getMethodName(selectedMethod)} Score</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}