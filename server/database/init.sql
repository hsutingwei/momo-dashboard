-- 建立 ENUM 類型
CREATE TYPE file_type_enum AS ENUM ('product', 'snapshot', 'comment');
CREATE TYPE sync_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE data_type_enum AS ENUM ('product', 'snapshot', 'comment');
CREATE TYPE error_type_enum AS ENUM ('format_error', 'null_value', 'invalid_range', 'duplicate');

-- 建立 file_sync_logs 表
CREATE TABLE IF NOT EXISTS file_sync_logs (
    id BIGSERIAL PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    file_type file_type_enum NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    total_records INT DEFAULT 0,
    valid_records INT DEFAULT 0,
    error_records INT DEFAULT 0,
    sync_status sync_status_enum DEFAULT 'pending',
    sync_start_time TIMESTAMP,
    sync_end_time TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_file_sync UNIQUE (keyword, file_type, file_path)
);

-- 建立 data_validation_errors 表
CREATE TABLE IF NOT EXISTS data_validation_errors (
    id BIGSERIAL PRIMARY KEY,
    file_path VARCHAR(500) NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    data_type data_type_enum NOT NULL,
    row_number INT,
    field_name VARCHAR(100),
    original_value TEXT,
    error_type error_type_enum NOT NULL,
    error_message TEXT,
    suggested_value TEXT,
    is_fixed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 products 表
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    price DECIMAL(10,2),
    product_link TEXT,
    keyword VARCHAR(100),
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 product_comments 表
CREATE TABLE IF NOT EXISTS product_comments (
    id BIGSERIAL PRIMARY KEY,
    comment_id VARCHAR(100) UNIQUE NOT NULL,
    product_id BIGINT NOT NULL,
    comment_text TEXT,
    customer_name VARCHAR(200),
    comment_date TIMESTAMP,
    goods_type VARCHAR(100),
    image_urls JSONB,
    is_like BOOLEAN,
    is_show_like BOOLEAN,
    like_count INT,
    reply_content TEXT,
    reply_date TIMESTAMP,
    score DECIMAL(2,1),
    video_thumbnail_img TEXT,
    video_url TEXT,
    capture_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 建立 sales_snapshots 表
CREATE TABLE IF NOT EXISTS sales_snapshots (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sales_count INT,
    sales_unit VARCHAR(10),
    capture_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT unique_product_time UNIQUE (product_id, capture_time)
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_file_sync_keyword ON file_sync_logs (keyword);
CREATE INDEX IF NOT EXISTS idx_file_sync_status ON file_sync_logs (sync_status);
CREATE INDEX IF NOT EXISTS idx_validation_file_path ON data_validation_errors (file_path);
CREATE INDEX IF NOT EXISTS idx_validation_keyword ON data_validation_errors (keyword);
CREATE INDEX IF NOT EXISTS idx_validation_error_type ON data_validation_errors (error_type);
CREATE INDEX IF NOT EXISTS idx_validation_is_fixed ON data_validation_errors (is_fixed);
CREATE INDEX IF NOT EXISTS idx_products_keyword ON products (keyword);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON product_comments (product_id);
CREATE INDEX IF NOT EXISTS idx_comments_comment_id ON product_comments (comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_comment_date ON product_comments (comment_date);
CREATE INDEX IF NOT EXISTS idx_comments_capture_time ON product_comments (capture_time);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales_snapshots (product_id);
CREATE INDEX IF NOT EXISTS idx_sales_capture_time ON sales_snapshots (capture_time);

-- 建立更新時間戳的函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器
CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON file_sync_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();