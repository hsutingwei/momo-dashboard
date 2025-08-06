import { pgTable, text, integer, boolean, timestamp, decimal, serial, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// ENUM types
export const fileTypeEnum = pgEnum('file_type_enum', ['product', 'snapshot', 'comment']);
export const syncStatusEnum = pgEnum('sync_status_enum', ['pending', 'processing', 'completed', 'failed']);
export const dataTypeEnum = pgEnum('data_type_enum', ['product', 'snapshot', 'comment']);
export const errorTypeEnum = pgEnum('error_type_enum', ['format_error', 'null_value', 'invalid_range', 'duplicate']);

// File sync logs table
export const fileSyncLogs = pgTable('file_sync_logs', {
  id: serial('id').primaryKey(),
  keyword: text('keyword').notNull(),
  fileType: fileTypeEnum('file_type').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  totalRecords: integer('total_records').default(0),
  validRecords: integer('valid_records').default(0),
  errorRecords: integer('error_records').default(0),
  syncStatus: syncStatusEnum('sync_status').default('pending'),
  syncStartTime: timestamp('sync_start_time'),
  syncEndTime: timestamp('sync_end_time'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Data validation errors table
export const dataValidationErrors = pgTable('data_validation_errors', {
  id: serial('id').primaryKey(),
  filePath: text('file_path').notNull(),
  keyword: text('keyword').notNull(),
  dataType: dataTypeEnum('data_type').notNull(),
  rowNumber: integer('row_number'),
  fieldName: text('field_name'),
  originalValue: text('original_value'),
  errorType: errorTypeEnum('error_type').notNull(),
  errorMessage: text('error_message'),
  suggestedValue: text('suggested_value'),
  isFixed: boolean('is_fixed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  productLink: text('product_link'),
  keyword: text('keyword'),
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product comments table
export const productComments = pgTable('product_comments', {
  id: serial('id').primaryKey(),
  commentId: text('comment_id').unique().notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  commentText: text('comment_text'),
  customerName: text('customer_name'),
  commentDate: timestamp('comment_date'),
  goodsType: text('goods_type'),
  imageUrls: jsonb('image_urls'),
  isLike: boolean('is_like'),
  isShowLike: boolean('is_show_like'),
  likeCount: integer('like_count'),
  replyContent: text('reply_content'),
  replyDate: timestamp('reply_date'),
  score: decimal('score', { precision: 2, scale: 1 }),
  videoThumbnailImg: text('video_thumbnail_img'),
  videoUrl: text('video_url'),
  captureTime: timestamp('capture_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sales snapshots table
export const salesSnapshots = pgTable('sales_snapshots', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  salesCount: integer('sales_count'),
  salesUnit: text('sales_unit'),
  captureTime: timestamp('capture_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Legacy analysis tables (keeping for backward compatibility)
export const keywordAnalysis = pgTable('keyword_analysis', {
  id: serial('id').primaryKey(),
  commentId: text('comment_id').references(() => productComments.commentId),
  keyword: text('keyword').notNull(),
  method: text('method').notNull(), // 'lda', 'tfidf', 'ckip', 'bert'
  score: decimal('score', { precision: 6, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sentimentAnalysis = pgTable('sentiment_analysis', {
  id: serial('id').primaryKey(),
  commentId: text('comment_id').references(() => productComments.commentId),
  method: text('method').notNull(), // 'ckip', 'bert'
  sentimentScore: decimal('sentiment_score', { precision: 4, scale: 3 }),
  sentimentLabel: text('sentiment_label'), // 'positive', 'negative', 'neutral'
  confidence: decimal('confidence', { precision: 4, scale: 3 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const correlationAnalysis = pgTable('correlation_analysis', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  featureName: text('feature_name').notNull(),
  method: text('method').notNull(),
  correlationScore: decimal('correlation_score', { precision: 4, scale: 3 }),
  pValue: decimal('p_value', { precision: 6, scale: 4 }),
  analysisDate: timestamp('analysis_date').defaultNow(),
}); 