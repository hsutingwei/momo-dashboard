# Momo Dashboard 部署指南

## 🚀 生產環境部署

### 1. 環境準備

#### 系統需求
- Node.js 18+ 
- PostgreSQL 12+
- Nginx (推薦)
- PM2 (推薦用於 Node.js 進程管理)

#### 伺服器設置
```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 安裝 PM2
sudo npm install -g pm2

# 安裝 Nginx
sudo apt install nginx -y
```

### 2. 資料庫設置

#### PostgreSQL 配置
```bash
# 切換到 postgres 用戶
sudo -u postgres psql

# 建立資料庫和用戶
CREATE DATABASE momo_dashboard;
CREATE USER momo_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE momo_dashboard TO momo_user;
\q

# 執行初始化腳本
psql -U postgres -d momo_dashboard -f server/database/init.sql
```

#### 環境變數
建立 `.env` 文件：
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=momo_user
DB_PASSWORD=your_secure_password
DB_NAME=momo_dashboard
NODE_ENV=production
```

### 3. 應用程式部署

#### 克隆和設置
```bash
# 克隆專案
git clone <repository-url>
cd momo_dashboard

# 安裝依賴
pnpm install

# 建立生產版本
pnpm build
```

#### PM2 配置
建立 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'momo-dashboard',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 啟動應用程式
```bash
# 使用 PM2 啟動
pm2 start ecosystem.config.js --env production

# 設置開機自啟
pm2 startup
pm2 save
```

### 4. Nginx 反向代理

#### Nginx 配置
建立 `/etc/nginx/sites-available/momo-dashboard`：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 靜態資源快取
    location /_nuxt/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 啟用站點
```bash
# 建立符號連結
sudo ln -s /etc/nginx/sites-available/momo-dashboard /etc/nginx/sites-enabled/

# 測試配置
sudo nginx -t

# 重新載入 Nginx
sudo systemctl reload nginx
```

### 5. SSL 證書 (可選)

#### 使用 Let's Encrypt
```bash
# 安裝 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 取得 SSL 證書
sudo certbot --nginx -d your-domain.com

# 設置自動續期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. 監控和維護

#### 日誌管理
```bash
# 查看應用程式日誌
pm2 logs momo-dashboard

# 查看 Nginx 日誌
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### 性能監控
```bash
# 查看 PM2 狀態
pm2 status

# 查看系統資源
pm2 monit
```

#### 備份策略
```bash
# 資料庫備份腳本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U momo_user -d momo_dashboard > backup_$DATE.sql
gzip backup_$DATE.sql
```

### 7. 更新部署

#### 自動化部署腳本
建立 `deploy.sh`：
```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# 拉取最新代碼
git pull origin main

# 安裝依賴
pnpm install

# 建立生產版本
pnpm build

# 重啟應用程式
pm2 restart momo-dashboard

echo "Deployment completed!"
```

#### 設置 Git Hooks (可選)
```bash
# 在伺服器上設置 Git hook
# 當推送代碼時自動部署
```

### 8. 故障排除

#### 常見問題
1. **資料庫連接失敗**
   - 檢查 PostgreSQL 服務狀態
   - 驗證環境變數
   - 檢查防火牆設置

2. **應用程式無法啟動**
   - 檢查端口是否被佔用
   - 查看 PM2 日誌
   - 驗證 Node.js 版本

3. **靜態資源載入失敗**
   - 檢查 Nginx 配置
   - 驗證文件權限
   - 檢查路徑設置

#### 性能優化
1. **啟用 Gzip 壓縮**
2. **設置適當的快取策略**
3. **使用 CDN 加速靜態資源**
4. **資料庫查詢優化**

### 9. 安全建議

1. **防火牆設置**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **定期更新**
   ```bash
   # 系統更新
   sudo apt update && sudo apt upgrade -y
   
   # 依賴更新
   pnpm update
   ```

3. **安全監控**
   - 設置入侵檢測系統
   - 監控異常訪問
   - 定期安全掃描

## 📞 支援

如遇到部署問題，請檢查：
1. 系統日誌
2. 應用程式日誌
3. 網路連接
4. 服務狀態

或聯繫技術支援團隊。 