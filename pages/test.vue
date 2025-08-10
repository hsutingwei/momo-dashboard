<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Tailwind CSS 測試頁面</h1>
      
      <!-- 基本樣式測試 -->
      <div class="card mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">基本樣式測試</h2>
        <div class="space-y-4">
          <p class="text-gray-600">這是一個段落文字，測試基本文字樣式。</p>
          <div class="flex space-x-4">
            <button class="btn-primary">主要按鈕</button>
            <button class="btn-secondary">次要按鈕</button>
            <button class="btn-danger">危險按鈕</button>
          </div>
        </div>
      </div>

      <!-- 響應式設計測試 -->
      <div class="card mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">響應式設計測試</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-blue-100 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800">卡片 1</h3>
            <p class="text-blue-600 text-sm">響應式網格測試</p>
          </div>
          <div class="bg-green-100 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800">卡片 2</h3>
            <p class="text-green-600 text-sm">響應式網格測試</p>
          </div>
          <div class="bg-purple-100 p-4 rounded-lg">
            <h3 class="font-semibold text-purple-800">卡片 3</h3>
            <p class="text-purple-600 text-sm">響應式網格測試</p>
          </div>
        </div>
      </div>

      <!-- 表單元素測試 -->
      <div class="card mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">表單元素測試</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">輸入框</label>
            <input type="text" class="input-field" placeholder="請輸入文字...">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">選擇框</label>
            <select class="input-field">
              <option>選項 1</option>
              <option>選項 2</option>
              <option>選項 3</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 徽章測試 -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">徽章測試</h2>
        <div class="flex space-x-4">
          <span class="badge badge-primary">主要</span>
          <span class="badge badge-success">成功</span>
          <span class="badge badge-warning">警告</span>
          <span class="badge badge-danger">危險</span>
        </div>
      </div>

      <!-- 狀態指示 -->
      <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 class="text-green-800 font-semibold mb-2">✅ Tailwind CSS 測試成功！</h3>
        <p class="text-green-700">
          如果您能看到這個頁面並且樣式正確顯示，那麼 Tailwind CSS 已經成功配置並正常工作。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 測試頁面，無需額外邏輯
</script> 