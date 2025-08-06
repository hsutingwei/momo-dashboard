import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ProductTable } from './components/ProductTable';
import { CommentTable } from './components/CommentTable';
import { SalesTable } from './components/SalesTable';
import { AnalysisPanel } from './components/AnalysisPanel';
import { FilterPanel } from './components/FilterPanel';
import { 
  Package, 
  MessageSquare, 
  Tag, 
  TrendingUp,
  Search,
  Download,
  Filter
} from 'lucide-react';

// Mock data for KPIs
const mockKPIs = {
  totalProducts: 1247,
  totalComments: 8934,
  uniqueKeywords: 342,
  productsWithSalesChanges: 89
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Sales & Comment Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Analyze product performance and customer feedback trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Filter Panel */}
        {showFilters && (
          <>
            <FilterPanel 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            <Separator className="my-6" />
          </>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('products')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockKPIs.totalProducts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('comments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockKPIs.totalComments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Unique Keywords</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockKPIs.uniqueKeywords}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('sales')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Sales Changes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockKPIs.productsWithSalesChanges}</div>
              <p className="text-xs text-muted-foreground">
                Products with changes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="sales">Sales Snapshots</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalysisPanel />
          </TabsContent>

          <TabsContent value="products">
            <ProductTable searchQuery={searchQuery} selectedProduct={selectedProduct} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentTable searchQuery={searchQuery} selectedProduct={selectedProduct} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTable searchQuery={searchQuery} selectedProduct={selectedProduct} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}