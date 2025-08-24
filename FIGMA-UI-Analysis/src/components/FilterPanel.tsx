import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
}

// Mock product list
const mockProducts = [
  { id: '1', name: 'Wireless Headphones Pro' },
  { id: '2', name: 'Smart Fitness Tracker' },
  { id: '3', name: 'Gaming Keyboard RGB' },
  { id: '4', name: 'USB-C Hub 7-in-1' },
  { id: '5', name: 'Portable Phone Stand' }
];

export function FilterPanel({ 
  searchQuery, 
  setSearchQuery, 
  selectedProduct, 
  setSelectedProduct 
}: FilterPanelProps) {
  const handleReset = () => {
    setSearchQuery('');
    setSelectedProduct('all');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Product Selector */}
          <div className="space-y-2">
            <label>Product</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label>Date Range</label>
            <Select defaultValue="30days">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="space-y-2">
            <label className="invisible">Reset</label>
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}