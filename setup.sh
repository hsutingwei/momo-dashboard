#!/bin/bash

echo "🚀 Momo Dashboard 快速設置腳本"
echo "================================"

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js 18+"
    exit 1
fi

# 檢查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安裝 pnpm..."
    npm install -g pnpm
fi

# 檢查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL 未安裝，請先安裝 PostgreSQL"
    echo "   在 Ubuntu/Debian 上：sudo apt install postgresql postgresql-contrib"
    echo "   在 macOS 上：brew install postgresql"
    echo "   在 Windows 上：下載並安裝 PostgreSQL"
fi

echo "📦 安裝依賴..."
pnpm install

echo "🔧 設置環境變數..."
if [ ! -f .env ]; then
    cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=postgres
EOF
    echo "✅ 已建立 .env 文件"
else
    echo "✅ .env 文件已存在"
fi

echo "🗄️ 設置資料庫..."
echo "請確保 PostgreSQL 正在運行，並執行以下命令："
echo "psql -U postgres -d postgres -f server/database/init.sql"

echo "🚀 啟動開發伺服器..."
echo "pnpm dev"

echo ""
echo "✅ 設置完成！"
echo "📖 請查看 README.md 獲取詳細說明"
echo "🌐 訪問 http://localhost:3000 查看應用程式" 