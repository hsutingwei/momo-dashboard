# ML 實驗 Dashboard 功能說明

## 功能概述

這個新功能提供了一個完整的機器學習實驗比較和分析 Dashboard，讓使用者可以：

1. **瀏覽實驗批次**：查看所有可用的分析批次
2. **比較實驗結果**：在同一批次內比較不同模型（code）的表現
3. **詳細分析**：查看單一實驗的詳細資訊，包括交叉驗證、特徵分析等
4. **視覺化展示**：查看 PCA、t-SNE、UMAP 等降維視覺化結果

## 技術架構

### 後端 API

#### 1. 實驗批次管理
- `GET /api/experiments/batches` - 獲取所有實驗批次
- `GET /api/experiments/[fa_batch_id]/runs` - 獲取特定批次的所有實驗

#### 2. 實驗詳細資訊
- `GET /api/runs/[run_id]/summary` - 獲取實驗摘要
- `GET /api/runs/[run_id]/folds` - 獲取交叉驗證結果

#### 3. 特徵分析
- `GET /api/feature-analysis/[fa_batch_id]/summary` - 獲取特徵分析摘要
- `GET /api/feature-analysis/[fa_batch_id]/visualizations` - 獲取視覺化列表
- `GET /api/fa/viz/[fa_batch_id]/[viz_type].svg` - 提供 SVG 視覺化檔案

### 前端組件

#### 1. 核心組件
- `ExperimentComparisonChart.vue` - 實驗比較圖表
- `ExperimentDetailModal.vue` - 實驗詳細 Modal（4個分頁）
- `useExperiments.ts` - 實驗數據管理 composable

#### 2. 頁面
- `/experiments` - 實驗批次列表頁面
- `/experiments/[fa_batch_id]` - 特定批次的實驗比較頁面

## 資料庫結構

### 主要資料表

1. **fa_batches** - 特徵分析批次
   - `analysis_id` (UUID) - 批次 ID
   - `analysis_timestamp` - 分析時間
   - `mode_code` - 模式代碼
   - `summary_json` - 分析摘要（JSON）

2. **fa_analysis_codes** - 批次包含的代碼
   - `analysis_id` - 批次 ID
   - `code` - 代碼名稱

3. **fa_related_runs** - 代碼與實驗的關聯
   - `analysis_id` - 批次 ID
   - `code` - 代碼名稱
   - `run_id` - 實驗 ID

4. **ml_runs** - 機器學習實驗
   - `run_id` (UUID) - 實驗 ID
   - `date_cutoff` - 截止日期
   - `config` - 配置（JSON）

5. **ml_run_algorithms** - 實驗算法
   - `run_id` - 實驗 ID
   - `algorithm` - 算法名稱
   - `fs_method` - 特徵選擇方法
   - `cv_splits` - 交叉驗證折數
   - `hyperparams` - 超參數（JSON）

6. **ml_run_summary** - 實驗摘要指標
   - `run_id` - 實驗 ID
   - `auc_mean` - AUC 平均值
   - `precision_1_mean` - 正類精確率
   - `recall_1_mean` - 正類召回率
   - `f1_1_mean` - 正類 F1 分數

7. **ml_fold_metrics** - 交叉驗證指標
   - `run_id` - 實驗 ID
   - `fold` - 折數
   - `auc` - AUC
   - `precision_1` - 正類精確率
   - `recall_1` - 正類召回率
   - `f1_1` - 正類 F1 分數

8. **fa_feature_stats** - 特徵統計
   - `analysis_id` - 批次 ID
   - `feature_name` - 特徵名稱
   - `cohens_d` - Cohen's d 值
   - `mutual_info` - 互資訊
   - `p_value` - p 值
   - `is_significant` - 是否顯著
   - `has_high_separation` - 是否有高分離度

9. **fa_visualizations** - 視覺化
   - `analysis_id` - 批次 ID
   - `viz_type` - 視覺化類型（pca/tsne/umap）
   - `plot_path` - 檔案路徑
   - `separation_score` - 分離分數

## 使用流程

### 1. 首頁摘要
- 在首頁的 "ML Experiments" 區塊顯示實驗批次摘要
- 顯示總批次數、總實驗數、最佳 AUC 等統計
- 點擊批次可跳轉到詳細比較頁面

### 2. 批次列表頁面
- 路徑：`/experiments`
- 顯示所有可用的實驗批次
- 每個批次卡片顯示基本資訊和最佳指標
- 點擊卡片跳轉到該批次的實驗比較頁面

### 3. 實驗比較頁面
- 路徑：`/experiments/[fa_batch_id]`
- 顯示該批次內所有實驗的比較
- 包含 KPI 卡片、比較圖表、實驗表格
- 點擊實驗可打開詳細 Modal

### 4. 實驗詳細 Modal
包含 4 個分頁：

#### Overview 分頁
- 實驗配置資訊（算法、特徵選擇方法、CV 折數等）
- 整體指標（AUC、準確率、F1 等）
- 分類別指標（正類/負類的 P/R/F1）
- 超參數配置

#### Cross-Validation 分頁
- 每折的詳細指標
- 統計摘要（平均值、標準差）
- 指標表格

#### Feature Analysis 分頁
- 數據概覽（樣本數、不平衡比等）
- 特徵統計表格（Cohen's d、互資訊、p 值等）
- 視覺化圖表（PCA、t-SNE、UMAP）

#### Predictions 分頁
- 預留給錯誤分析功能
- 目前顯示 "Coming Soon"

## 視覺化檔案管理

### SVG 檔案存放
- 路徑：`public/visualizations/`
- 檔案結構：`Model/analysis_outputs/feature_visualization_*.svg`
- API 端點：`/api/fa/viz/[fa_batch_id]/[viz_type].svg`

### 檔案複製流程
1. 從 `momo_crawler-main` 資料夾複製 SVG 檔案
2. 放置到 `momo_dashboard/public/visualizations/` 對應路徑
3. 確保資料庫中的 `plot_path` 欄位指向正確的相對路徑

## 類型定義

### 主要介面

```typescript
interface ExperimentRun {
  code: string;
  run_id: string;
  algorithm: string;
  fs_method: string;
  cv_splits: number;
  metrics: {
    auc: number;
    precision_1: number;
    recall_1: number;
    f1_1: number;
    // ... 其他指標
  };
}

interface RunSummary {
  run_id: string;
  algorithm: string;
  fs_method: string;
  cv_splits: number;
  cutoff_date: string;
  hyperparams: Record<string, any>;
  metrics: {
    auc: number;
    accuracy: number;
    f1_macro: number;
    // ... 其他指標
  };
}

interface FeatureAnalysisSummary {
  batch_id: string;
  data_overview: {
    total_samples: number;
    y1: number;
    y0: number;
    imbalance_ratio: string;
    dense_features: number;
    tfidf_features: number;
  };
  dense_feature_stats: Array<{
    feature_name: string;
    cohens_d: number;
    mutual_info: number;
    p_value: number;
    is_significant: boolean;
    has_high_separation: boolean;
  }>;
}
```

## 部署注意事項

1. **資料庫準備**：確保所有相關資料表已建立並有數據
2. **SVG 檔案**：將視覺化檔案複製到正確位置
3. **API 端點**：確保所有 API 端點正常工作
4. **權限設定**：確保檔案讀取權限正確

## 未來擴展

1. **錯誤分析**：實現 Predictions 分頁的錯誤分析功能
2. **模型比較**：跨批次的模型比較功能
3. **自動化**：自動更新實驗結果和視覺化
4. **匯出功能**：支援實驗結果匯出
5. **通知系統**：實驗完成通知
