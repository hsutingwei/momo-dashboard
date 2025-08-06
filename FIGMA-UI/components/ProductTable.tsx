import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Download, Search } from 'lucide-react';

interface ProductTableProps {
  searchQuery: string;
  selectedProduct: string;
}

// Mock product data
const mockProducts = [
  {
    id: 'PRD001',
    name: 'Wireless Headphones Pro',
    keyword: 'audio, wireless, headphones',
    price: 199.99,
    is_complete: true,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PRD002',
    name: 'Smart Fitness Tracker',
    keyword: 'fitness, health, tracker',
    price: 149.99,
    is_complete: true,
    created_at: '2024-01-20T14:22:00Z'
  },
  {
    id: 'PRD003',
    name: 'Gaming Keyboard RGB',
    keyword: 'gaming, keyboard, rgb',
    price: 89.99,
    is_complete: false,
    created_at: '2024-02-01T09:15:00Z'
  },
  {
    id: 'PRD004',
    name: 'USB-C Hub 7-in-1',
    keyword: 'usb, hub, connectivity',
    price: 79.99,
    is_complete: true,
    created_at: '2024-02-05T16:45:00Z'
  },
  {
    id: 'PRD005',
    name: 'Portable Phone Stand',
    keyword: 'phone, stand, portable',
    price: 24.99,
    is_complete: true,
    created_at: '2024-02-10T11:20:00Z'
  }
];

export function ProductTable({ searchQuery, selectedProduct }: ProductTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesGlobalSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch ||
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.keyword.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesProductFilter = selectedProduct === 'all' || product.id === selectedProduct;
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Keywords', 'Price', 'Complete', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.id,
        `"${product.name}"`,
        `"${product.keyword}"`,
        product.price,
        product.is_complete,
        new Date(product.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product List ({filteredProducts.length} items)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.keyword.split(', ').map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_complete ? "default" : "secondary"}>
                      {product.is_complete ? "Complete" : "Incomplete"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}