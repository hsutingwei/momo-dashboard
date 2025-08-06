import { pgTable, text, integer, boolean, timestamp, decimal, serial } from 'drizzle-orm/pg-core';

// 商品表
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  keyword: text('keyword'),
  price: decimal('price', { precision: 10, scale: 2 }),
  is_complete: boolean('is_complete').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

// 商品評論表
export const productComments = pgTable('product_comments', {
  comment_id: text('comment_id').primaryKey(),
  product_id: text('product_id').references(() => products.id),
  score: decimal('score', { precision: 3, scale: 1 }),
  comment_text: text('comment_text'),
  comment_date: timestamp('comment_date').defaultNow(),
  is_like: boolean('is_like').default(true),
  sentiment_score: decimal('sentiment_score', { precision: 4, scale: 3 }),
});

// 銷售快照表
export const salesSnapshots = pgTable('sales_snapshots', {
  id: serial('id').primaryKey(),
  product_id: text('product_id').references(() => products.id),
  sales_count: integer('sales_count').notNull(),
  capture_time: timestamp('capture_time').defaultNow(),
  previous_count: integer('previous_count'),
  change_percent: decimal('change_percent', { precision: 5, scale: 2 }),
});

// 關鍵字分析表
export const keywordAnalysis = pgTable('keyword_analysis', {
  id: serial('id').primaryKey(),
  comment_id: text('comment_id').references(() => productComments.comment_id),
  keyword: text('keyword').notNull(),
  method: text('method').notNull(), // 'lda', 'tfidf', 'ckip', 'bert'
  score: decimal('score', { precision: 6, scale: 4 }),
  created_at: timestamp('created_at').defaultNow(),
});

// 情緒分析表
export const sentimentAnalysis = pgTable('sentiment_analysis', {
  id: serial('id').primaryKey(),
  comment_id: text('comment_id').references(() => productComments.comment_id),
  method: text('method').notNull(), // 'ckip', 'bert'
  sentiment_score: decimal('sentiment_score', { precision: 4, scale: 3 }),
  sentiment_label: text('sentiment_label'), // 'positive', 'negative', 'neutral'
  confidence: decimal('confidence', { precision: 4, scale: 3 }),
  created_at: timestamp('created_at').defaultNow(),
});

// 關聯性分析結果表
export const correlationAnalysis = pgTable('correlation_analysis', {
  id: serial('id').primaryKey(),
  product_id: text('product_id').references(() => products.id),
  feature_name: text('feature_name').notNull(),
  method: text('method').notNull(),
  correlation_score: decimal('correlation_score', { precision: 4, scale: 3 }),
  p_value: decimal('p_value', { precision: 6, scale: 4 }),
  analysis_date: timestamp('analysis_date').defaultNow(),
}); 