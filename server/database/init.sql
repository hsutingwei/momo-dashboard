-- 建立商品表
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  keyword TEXT,
  price DECIMAL(10,2),
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立商品評論表
CREATE TABLE IF NOT EXISTS product_comments (
  comment_id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  score DECIMAL(3,1),
  comment_text TEXT,
  comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_like BOOLEAN DEFAULT TRUE,
  sentiment_score DECIMAL(4,3)
);

-- 建立銷售快照表
CREATE TABLE IF NOT EXISTS sales_snapshots (
  id SERIAL PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  sales_count INTEGER NOT NULL,
  capture_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  previous_count INTEGER,
  change_percent DECIMAL(5,2)
);

-- 建立關鍵字分析表
CREATE TABLE IF NOT EXISTS keyword_analysis (
  id SERIAL PRIMARY KEY,
  comment_id TEXT REFERENCES product_comments(comment_id),
  keyword TEXT NOT NULL,
  method TEXT NOT NULL,
  score DECIMAL(6,4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立情緒分析表
CREATE TABLE IF NOT EXISTS sentiment_analysis (
  id SERIAL PRIMARY KEY,
  comment_id TEXT REFERENCES product_comments(comment_id),
  method TEXT NOT NULL,
  sentiment_score DECIMAL(4,3),
  sentiment_label TEXT,
  confidence DECIMAL(4,3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立關聯性分析結果表
CREATE TABLE IF NOT EXISTS correlation_analysis (
  id SERIAL PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  feature_name TEXT NOT NULL,
  method TEXT NOT NULL,
  correlation_score DECIMAL(4,3),
  p_value DECIMAL(6,4),
  analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入範例資料
INSERT INTO products (id, name, keyword, price, is_complete) VALUES
('PRD001', 'Wireless Headphones Pro', 'audio, wireless, headphones', 199.99, true),
('PRD002', 'Smart Fitness Tracker', 'fitness, health, tracker', 149.99, true),
('PRD003', 'Gaming Keyboard RGB', 'gaming, keyboard, rgb', 89.99, false),
('PRD004', 'USB-C Hub 7-in-1', 'usb, hub, connectivity', 79.99, true),
('PRD005', 'Portable Phone Stand', 'phone, stand, portable', 24.99, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_comments (comment_id, product_id, score, comment_text, is_like, sentiment_score) VALUES
('CMT001', 'PRD001', 4.5, 'Amazing sound quality and comfortable fit. Perfect for long listening sessions.', true, 0.85),
('CMT002', 'PRD001', 2.0, 'Battery life is disappointing. Only lasts about 4 hours.', false, -0.32),
('CMT003', 'PRD002', 5.0, 'Excellent fitness tracker! Accurate heart rate monitoring and great app integration.', true, 0.92),
('CMT004', 'PRD003', 4.0, 'Nice RGB effects and responsive keys, but a bit loud for office use.', true, 0.45),
('CMT005', 'PRD004', 3.5, 'Good connectivity options but gets warm during heavy use.', true, 0.25)
ON CONFLICT (comment_id) DO NOTHING;

INSERT INTO sales_snapshots (product_id, sales_count, previous_count, change_percent) VALUES
('PRD001', 245, 230, 6.5),
('PRD002', 189, 195, -3.1),
('PRD003', 156, 142, 9.9),
('PRD004', 98, 98, 0.0),
('PRD005', 67, 89, -24.7)
ON CONFLICT DO NOTHING;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_products_keyword ON products(keyword);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON product_comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_sentiment ON product_comments(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_capture_time ON sales_snapshots(capture_time); 