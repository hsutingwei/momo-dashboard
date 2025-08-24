import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Download, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SalesTableProps {
  searchQuery: string;
  selectedProduct: string;
}

// Mock sales data
const mockSalesData = [
  {
    product_id: 'PRD001',
    sales_count: 245,
    capture_time: '2024-02-15T10:00:00Z',
    previous_count: 230,
    change_percent: 6.5
  },
  {
    product_id: 'PRD002',
    sales_count: 189,
    capture_time: '2024-02-15T10:00:00Z',
    previous_count: 195,
    change_percent: -3.1
  },
  {
    product_id: 'PRD003',
    sales_count: 156,
    capture_time: '2024-02-15T10:00:00Z',
    previous_count: 142,
    change_percent: 9.9
  },
  {
    product_id: 'PRD004',
    sales_count: 98,
    capture_time: '2024-02-15T10:00:00Z',
    previous_count: 98,
    change_percent: 0
  },
  {
    product_id: 'PRD005',
    sales_count: 67,
    capture_time: '2024-02-15T10:00:00Z',
    previous_count: 89,
    change_percent: -24.7
  }
];

export function SalesTable({ searchQuery, selectedProduct }: SalesTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  
  const filteredSales = mockSalesData.filter(sale => {
    const matchesGlobalSearch = !searchQuery || 
      sale.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch ||
      sale.product_id.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesProductFilter = selectedProduct === 'all' || sale.product_id === selectedProduct;
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  });

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (changePercent < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendBadge = (changePercent: number) => {
    if (changePercent > 5) return <Badge className="bg-green-100 text-green-800">Strong Growth</Badge>;
    if (changePercent > 0) return <Badge className="bg-blue-100 text-blue-800">Growth</Badge>;
    if (changePercent === 0) return <Badge variant="secondary">Stable</Badge>;
    if (changePercent > -5) return <Badge className="bg-orange-100 text-orange-800">Decline</Badge>;
    return <Badge className="bg-red-100 text-red-800">Strong Decline</Badge>;
  };

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Sales Count', 'Capture Time', 'Previous Count', 'Change %'];
    const csvContent = [
      headers.join(','),
      ...filteredSales.map(sale => [
        sale.product_id,
        sale.sales_count,
        new Date(sale.capture_time).toISOString(),
        sale.previous_count,
        sale.change_percent
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_snapshots.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Snapshots ({filteredSales.length} items)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product ID..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Current Sales</TableHead>
                <TableHead>Previous Sales</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Capture Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.product_id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">{sale.product_id}</TableCell>
                  <TableCell>
                    <span>{sale.sales_count.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sale.previous_count.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(sale.change_percent)}
                      <span className={
                        sale.change_percent > 0 ? 'text-green-600' :
                        sale.change_percent < 0 ? 'text-red-600' : 'text-gray-600'
                      }>
                        {sale.change_percent > 0 ? '+' : ''}{sale.change_percent.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTrendBadge(sale.change_percent)}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.capture_time).toLocaleDateString()}
                    <div className="text-xs text-muted-foreground">
                      {new Date(sale.capture_time).toLocaleTimeString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}