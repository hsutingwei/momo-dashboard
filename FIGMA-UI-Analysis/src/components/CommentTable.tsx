import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Search, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CommentTableProps {
  searchQuery: string;
  selectedProduct: string;
}

// Mock comment data
const mockComments = [
  {
    comment_id: 'CMT001',
    product_id: 'PRD001',
    score: 4.5,
    comment_text: 'Amazing sound quality and comfortable fit. Perfect for long listening sessions.',
    comment_date: '2024-02-15T10:30:00Z',
    is_like: true,
    sentiment_score: 0.85
  },
  {
    comment_id: 'CMT002',
    product_id: 'PRD001',
    score: 2.0,
    comment_text: 'Battery life is disappointing. Only lasts about 4 hours.',
    comment_date: '2024-02-14T14:22:00Z',
    is_like: false,
    sentiment_score: -0.32
  },
  {
    comment_id: 'CMT003',
    product_id: 'PRD002',
    score: 5.0,
    comment_text: 'Excellent fitness tracker! Accurate heart rate monitoring and great app integration.',
    comment_date: '2024-02-13T09:15:00Z',
    is_like: true,
    sentiment_score: 0.92
  },
  {
    comment_id: 'CMT004',
    product_id: 'PRD003',
    score: 4.0,
    comment_text: 'Nice RGB effects and responsive keys, but a bit loud for office use.',
    comment_date: '2024-02-12T16:45:00Z',
    is_like: true,
    sentiment_score: 0.45
  },
  {
    comment_id: 'CMT005',
    product_id: 'PRD004',
    score: 3.5,
    comment_text: 'Good connectivity options but gets warm during heavy use.',
    comment_date: '2024-02-11T11:20:00Z',
    is_like: true,
    sentiment_score: 0.25
  }
];

export function CommentTable({ searchQuery, selectedProduct }: CommentTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  
  const filteredComments = mockComments.filter(comment => {
    const matchesGlobalSearch = !searchQuery || 
      comment.comment_text.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch ||
      comment.comment_text.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesProductFilter = selectedProduct === 'all' || comment.product_id === selectedProduct;
    
    const matchesSentimentFilter = sentimentFilter === 'all' || 
      (sentimentFilter === 'positive' && comment.sentiment_score > 0.3) ||
      (sentimentFilter === 'neutral' && comment.sentiment_score >= -0.3 && comment.sentiment_score <= 0.3) ||
      (sentimentFilter === 'negative' && comment.sentiment_score < -0.3);
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter && matchesSentimentFilter;
  });

  const getSentimentBadge = (score: number) => {
    if (score > 0.3) return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
    if (score < -0.3) return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
    return <Badge variant="secondary">Neutral</Badge>;
  };

  const handleExportCSV = () => {
    const headers = ['Comment ID', 'Product ID', 'Score', 'Comment', 'Date', 'Liked', 'Sentiment Score'];
    const csvContent = [
      headers.join(','),
      ...filteredComments.map(comment => [
        comment.comment_id,
        comment.product_id,
        comment.score,
        `"${comment.comment_text.replace(/"/g, '""')}"`,
        new Date(comment.comment_date).toLocaleDateString(),
        comment.is_like,
        comment.sentiment_score
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comments.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Comments ({filteredComments.length} items)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Comment ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Liked</TableHead>
                <TableHead>Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.comment_id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono">{comment.comment_id}</TableCell>
                  <TableCell className="font-mono">{comment.product_id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{comment.score}/5</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{comment.comment_text}</p>
                  </TableCell>
                  <TableCell>{new Date(comment.comment_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {comment.is_like ? (
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {getSentimentBadge(comment.sentiment_score)}
                    <div className="text-xs text-muted-foreground mt-1">
                      {comment.sentiment_score.toFixed(2)}
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