<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <!-- Analysis Controls -->
    <Card>
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Sales Influence Analysis</h3>
        <div class="space-y-6">
          <!-- Method Selector -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Analysis Method</label>
            <select 
              v-model="selectedMethod"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="lda">LDA Keywords</option>
              <option value="tfidf">TF-IDF Keywords</option>
              <option value="ckip">CKIP Sentiment</option>
              <option value="bert">BERT Sentiment</option>
            </select>
            <Badge variant="secondary" class="text-xs">
              Current: {{ getMethodName(selectedMethod) }}
            </Badge>
          </div>

          <div class="border-t"></div>

          <!-- Time Window Controls -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Records Before Sales Change</label>
              <input 
                v-model.number="beforeRecords"
                type="range"
                min="1"
                max="50"
                class="w-full"
              />
              <div class="text-sm text-muted-foreground">
                Reviewing {{ beforeRecords }} records before
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Records After Sales Change</label>
              <input 
                v-model.number="afterRecords"
                type="range"
                min="1"
                max="20"
                class="w-full"
              />
              <div class="text-sm text-muted-foreground">
                Reviewing {{ afterRecords }} records after
              </div>
            </div>
          </div>

          <div class="border-t"></div>

          <!-- Analysis Summary -->
          <div class="space-y-2">
            <h4 class="font-medium">Analysis Summary</h4>
            <div class="text-sm text-muted-foreground space-y-1">
              <p>• Method: {{ getMethodName(selectedMethod) }}</p>
              <p>• Time window: -{{ beforeRecords }} to +{{ afterRecords }} records</p>
              <p>• Data points analyzed: {{ timeSeriesData.length }}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Correlation Analysis -->
    <Card>
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">Feature Correlation with Sales</h3>
        <div class="space-y-4">
          <div 
            v-for="item in correlationData" 
            :key="item.feature"
            class="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <span class="text-sm font-medium">{{ item.feature }}</span>
            <div class="flex items-center gap-2">
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full"
                  :class="item.correlation > 0 ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: `${Math.abs(item.correlation * 100)}%` }"
                ></div>
              </div>
              <span class="text-sm font-mono">
                {{ (item.correlation * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Time Series Analysis -->
    <Card class="xl:col-span-2">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">
          Sales & {{ getMethodName(selectedMethod) }} Trends Over Time
        </h3>
        <div class="h-80 bg-muted rounded-lg flex items-center justify-center">
          <div class="text-center text-muted-foreground">
            <p class="text-lg font-medium">Chart Visualization</p>
            <p class="text-sm">Chart.js integration would go here</p>
            <p class="text-xs mt-2">
              Showing {{ timeSeriesData.length }} data points from {{ getMethodName(selectedMethod) }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center justify-center gap-6 mt-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-4 h-0.5 bg-blue-600"></div>
            <span>Sales Count</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-0.5 bg-red-600 border-dashed"></div>
            <span>{{ getMethodName(selectedMethod) }} Score</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Mock data for analysis
const timeSeriesData = ref([
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
]);

const correlationData = ref([
  { feature: 'Positive Keywords', correlation: 0.78, color: '#22c55e' },
  { feature: 'Sentiment Score', correlation: 0.65, color: '#3b82f6' },
  { feature: 'Review Volume', correlation: 0.52, color: '#f59e0b' },
  { feature: 'Rating Score', correlation: 0.48, color: '#8b5cf6' },
  { feature: 'Negative Keywords', correlation: -0.34, color: '#ef4444' },
  { feature: 'Complaint Rate', correlation: -0.42, color: '#dc2626' }
]);

const selectedMethod = ref('lda');
const beforeRecords = ref(10);
const afterRecords = ref(5);

const getMethodName = (method: string) => {
  switch (method) {
    case 'lda': return 'LDA Keywords';
    case 'tfidf': return 'TF-IDF Keywords';
    case 'ckip': return 'CKIP Sentiment';
    case 'bert': return 'BERT Sentiment';
    default: return method;
  }
};
</script> 