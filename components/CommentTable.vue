<template>
  <Card>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Customer Comments ({{ filteredComments.length }} items)</h3>
        <div class="flex items-center gap-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="localSearch"
              placeholder="Search comments..."
              class="pl-10 w-64"
            />
          </div>
          <select 
            v-model="sentimentFilter"
            class="flex h-9 px-3 py-1 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <Button variant="outline" size="sm" @click="handleExportCSV">
            <Download class="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div class="rounded-md border">
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
            <TableRow 
              v-for="comment in filteredComments" 
              :key="comment.comment_id" 
              class="cursor-pointer hover:bg-muted/50"
            >
              <TableCell class="font-mono">{{ comment.comment_id }}</TableCell>
              <TableCell class="font-mono">{{ comment.product_id }}</TableCell>
              <TableCell>
                <Badge variant="outline">{{ comment.score }}/5</Badge>
              </TableCell>
              <TableCell class="max-w-md">
                <p class="truncate">{{ comment.comment_text }}</p>
              </TableCell>
              <TableCell>{{ formatDate(comment.comment_date) }}</TableCell>
              <TableCell>
                <ThumbsUp v-if="comment.is_like" class="h-4 w-4 text-green-600" />
                <ThumbsDown v-else class="h-4 w-4 text-red-600" />
              </TableCell>
              <TableCell>
                <Badge :class="getSentimentBadgeClass(comment.sentiment_score)">
                  {{ getSentimentLabel(comment.sentiment_score) }}
                </Badge>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ comment.sentiment_score.toFixed(2) }}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Download, ThumbsUp, ThumbsDown } from 'lucide-vue-next';

interface Comment {
  comment_id: string;
  product_id: string;
  score: number;
  comment_text: string;
  comment_date: string;
  is_like: boolean;
  sentiment_score: number;
}

interface Props {
  searchQuery: string;
  selectedProduct: string;
}

const props = defineProps<Props>();

const comments = ref<Comment[]>([]);
const localSearch = ref('');
const sentimentFilter = ref('all');
const loading = ref(false);

const filteredComments = computed(() => {
  return comments.value.filter(comment => {
    const matchesGlobalSearch = !props.searchQuery || 
      comment.comment_text.toLowerCase().includes(props.searchQuery.toLowerCase());
    
    const matchesLocalSearch = !localSearch.value ||
      comment.comment_text.toLowerCase().includes(localSearch.value.toLowerCase());
    
    const matchesProductFilter = props.selectedProduct === 'all' || comment.product_id === props.selectedProduct;
    
    const matchesSentimentFilter = sentimentFilter.value === 'all' || 
      (sentimentFilter.value === 'positive' && comment.sentiment_score > 0.3) ||
      (sentimentFilter.value === 'neutral' && comment.sentiment_score >= -0.3 && comment.sentiment_score <= 0.3) ||
      (sentimentFilter.value === 'negative' && comment.sentiment_score < -0.3);
    
    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter && matchesSentimentFilter;
  });
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getSentimentLabel = (score: number) => {
  if (score > 0.3) return 'Positive';
  if (score < -0.3) return 'Negative';
  return 'Neutral';
};

const getSentimentBadgeClass = (score: number) => {
  if (score > 0.3) return 'bg-green-100 text-green-800';
  if (score < -0.3) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

const handleExportCSV = () => {
  const headers = ['Comment ID', 'Product ID', 'Score', 'Comment', 'Date', 'Liked', 'Sentiment Score'];
  const csvContent = [
    headers.join(','),
    ...filteredComments.value.map(comment => [
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

const loadComments = async () => {
  loading.value = true;
  try {
    const { data } = await $fetch('/api/comments/index');
    comments.value = data.comments || [];
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadComments();
});
</script> 