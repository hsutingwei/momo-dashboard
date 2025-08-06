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
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Liked</TableHead>
              <TableHead>Like Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="comment in filteredComments"
              :key="comment.id"
              class="cursor-pointer hover:bg-muted/50"
            >
              <TableCell class="font-mono text-xs">{{ comment.commentId }}</TableCell>
              <TableCell>
                <div>
                  <div class="font-medium">{{ comment.productName || 'Unknown Product' }}</div>
                  <div class="text-xs text-muted-foreground">ID: {{ comment.productId }}</div>
                </div>
              </TableCell>
              <TableCell>{{ comment.customerName || 'Anonymous' }}</TableCell>
              <TableCell>
                <Badge variant="outline">{{ comment.score || 'N/A' }}/5</Badge>
              </TableCell>
              <TableCell class="max-w-md">
                <p class="truncate">{{ comment.commentText || 'No comment text' }}</p>
              </TableCell>
              <TableCell>{{ formatDate(comment.commentDate) }}</TableCell>
              <TableCell>
                <ThumbsUp v-if="comment.isLike" class="h-4 w-4 text-green-600" />
                <ThumbsDown v-else class="h-4 w-4 text-red-600" />
              </TableCell>
              <TableCell>
                <span class="text-sm">{{ comment.likeCount || 0 }}</span>
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
  id: number;
  commentId: string;
  productId: number;
  commentText: string | null;
  customerName: string | null;
  commentDate: string | null;
  goodsType: string | null;
  isLike: boolean | null;
  isShowLike: boolean | null;
  likeCount: number | null;
  replyContent: string | null;
  replyDate: string | null;
  score: number | null;
  videoThumbnailImg: string | null;
  videoUrl: string | null;
  captureTime: string;
  createdAt: string;
  productName: string | null;
  productKeyword: string | null;
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
      (comment.commentText && comment.commentText.toLowerCase().includes(props.searchQuery.toLowerCase()));

    const matchesLocalSearch = !localSearch.value ||
      (comment.commentText && comment.commentText.toLowerCase().includes(localSearch.value.toLowerCase()));

    const matchesProductFilter = props.selectedProduct === 'all' || comment.productId.toString() === props.selectedProduct;

    const matchesSentimentFilter = sentimentFilter.value === 'all' ||
      (sentimentFilter.value === 'positive' && comment.score && comment.score >= 4) ||
      (sentimentFilter.value === 'neutral' && comment.score && comment.score > 2 && comment.score < 4) ||
      (sentimentFilter.value === 'negative' && comment.score && comment.score <= 2);

    return matchesGlobalSearch && matchesLocalSearch && matchesProductFilter && matchesSentimentFilter;
  });
});

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const handleExportCSV = () => {
  const headers = ['Comment ID', 'Product ID', 'Product Name', 'Customer Name', 'Score', 'Comment Text', 'Comment Date', 'Is Like', 'Like Count', 'Capture Time'];
  const csvContent = [
    headers.join(','),
    ...filteredComments.value.map(comment => [
      comment.commentId,
      comment.productId,
      `"${comment.productName || ''}"`,
      `"${comment.customerName || ''}"`,
      comment.score || '',
      `"${comment.commentText || ''}"`,
      comment.commentDate ? new Date(comment.commentDate).toLocaleDateString() : '',
      comment.isLike,
      comment.likeCount || 0,
      new Date(comment.captureTime).toLocaleDateString()
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
    const { comments: fetchedComments } = await $fetch('/api/comments/index');
    comments.value = fetchedComments || [];
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