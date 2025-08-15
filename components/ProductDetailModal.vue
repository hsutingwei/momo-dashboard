<template>
    <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="商品詳細資訊"
        class="max-w-4xl">
        <div class="p-6 space-y-6">
            <!-- 商品基本資訊 -->
            <Collapsible title="商品基本資訊" :default-open="true">
                <template #icon>
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">商品 ID</label>
                        <p class="text-gray-900 font-medium">{{ product?.id }}</p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">商品名稱</label>
                        <p class="text-gray-900 font-medium">{{ product?.name }}</p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">關鍵字</label>
                        <p class="text-gray-900">
                            <span v-if="product?.keyword" class="badge badge-primary">
                                {{ product.keyword }}
                            </span>
                            <span v-else class="text-gray-500">-</span>
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">價格</label>
                        <p class="text-gray-900">
                            <span v-if="product?.price" class="font-medium text-green-700">
                                {{ formatPrice(product.price) }}
                            </span>
                            <span v-else class="text-gray-500">-</span>
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">商品連結</label>
                        <p class="text-gray-900">
                            <a v-if="product?.product_link" :href="product.product_link" target="_blank"
                                class="text-primary-600 hover:text-primary-800 underline">
                                查看商品
                            </a>
                            <span v-else class="text-gray-500">-</span>
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">評論數量</label>
                        <p class="text-gray-900">
                            <button @click="viewComments(product?.id)"
                                class="text-primary-600 hover:text-primary-800 underline font-medium"
                                :title="`View ${product?.comment_count || 0} comments`">
                                {{ product?.comment_count || 0 }} 則評論
                            </button>
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">建立時間</label>
                        <p class="text-gray-900">{{ formatDate(product?.created_at || '') }}</p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-500">更新時間</label>
                        <p class="text-gray-900">{{ formatDate(product?.updated_at || '') }}</p>
                    </div>
                </div>
            </Collapsible>

            <!-- 銷售數量變化 -->
            <Collapsible title="銷售數量變化" :default-open="false">
                <template #icon>
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                    </svg>
                </template>
                <template #badge>
                    <div v-if="salesLoading"
                        class="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin">
                    </div>
                </template>

                <div v-if="salesLoading" class="text-center py-8">
                    <div
                        class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3">
                    </div>
                    <p class="text-gray-500">載入銷售數據中...</p>
                </div>

                <div v-else-if="salesError" class="text-center py-8">
                    <p class="text-red-600 mb-2">{{ salesError }}</p>
                    <button @click="fetchSalesData" class="btn-primary text-sm">重試</button>
                </div>

                <div v-else-if="salesData && salesData.points.length > 0" class="h-80">
                    <ClientOnly>
                        <component v-if="VChart" :is="VChart" :option="salesChartOption" autoresize />
                        <div v-else class="flex items-center justify-center h-full">
                            <div
                                class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin">
                            </div>
                        </div>
                    </ClientOnly>
                </div>

                <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                    </svg>
                    <p class="text-gray-500">無銷售數據</p>
                </div>
            </Collapsible>

            <!-- TF-IDF Top 100 -->
            <Collapsible title="TF-IDF Top 100" :default-open="false">
                <template #icon>
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                        </path>
                    </svg>
                </template>
                <template #badge>
                    <div v-if="tfidfLoading"
                        class="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin">
                    </div>
                </template>

                <div v-if="tfidfLoading" class="text-center py-8">
                    <div
                        class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3">
                    </div>
                    <p class="text-gray-500">載入 TF-IDF 數據中...</p>
                </div>

                <div v-else-if="tfidfError" class="text-center py-8">
                    <p class="text-red-600 mb-2">{{ tfidfError }}</p>
                    <button @click="fetchTfidfData" class="btn-primary text-sm">重試</button>
                </div>

                <div v-else-if="tfidfData && tfidfData.terms.length > 0" class="space-y-4">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-600">
                            範圍: <span class="font-medium">{{ tfidfData.scope === 'product' ? '商品' : '全站'
                            }}</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            顯示: <span class="font-medium">{{ tfidfData.terms.length }}</span> 個詞彙
                        </p>
                    </div>

                    <!-- 文字雲 -->
                    <div class="flex flex-wrap gap-2">
                        <span v-for="term in tfidfData.terms" :key="term.term" :style="{
                            fontSize: `${Math.max(12, Math.min(24, 12 + (term.total_tfidf / maxTfidf) * 12))}px`,
                            color: getTfidfColor(term.total_tfidf / maxTfidf)
                        }"
                            class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                            :title="`${term.term}: ${term.total_tfidf.toFixed(2)} (${term.doc_count} 則評論)`">
                            {{ term.term }}
                        </span>
                    </div>
                </div>

                <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                        </path>
                    </svg>
                    <p class="text-gray-500">無 TF-IDF 數據</p>
                </div>
            </Collapsible>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Product } from '~/types';
import type { ProductSalesSeriesResp, TfidfTopResp } from '~/types';
import { formatDate, formatPrice } from '~/utils/global';
import Collapsible from '~/components/ui/Collapsible.vue';
import Modal from '~/components/ui/Modal.vue';

// 動態導入 ECharts 組件，避免 SSR 問題
let VChart: any = null;
let use: any = null;
let CanvasRenderer: any = null;
let LineChart: any = null;
let TitleComponent: any = null;
let TooltipComponent: any = null;
let GridComponent: any = null;
let LegendComponent: any = null;

// 客戶端初始化 ECharts
const initECharts = async () => {
    if (process.client) {
        const echarts = await import('echarts/core');
        const renderers = await import('echarts/renderers');
        const charts = await import('echarts/charts');
        const components = await import('echarts/components');
        const vueEcharts = await import('vue-echarts');

        VChart = vueEcharts.default;
        use = echarts.use;
        CanvasRenderer = renderers.CanvasRenderer;
        LineChart = charts.LineChart;
        TitleComponent = components.TitleComponent;
        TooltipComponent = components.TooltipComponent;
        GridComponent = components.GridComponent;
        LegendComponent = components.LegendComponent;

        // 註冊 ECharts 組件
        use([
            CanvasRenderer,
            LineChart,
            TitleComponent,
            TooltipComponent,
            GridComponent,
            LegendComponent
        ]);
    }
};

interface Props {
    modelValue: boolean;
    product: Product | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    'update:modelValue': [value: boolean];
}>();

// 銷售數據
const salesData = ref<ProductSalesSeriesResp | null>(null);
const salesLoading = ref(false);
const salesError = ref<string | null>(null);

// TF-IDF 數據
const tfidfData = ref<TfidfTopResp | null>(null);
const tfidfLoading = ref(false);
const tfidfError = ref<string | null>(null);

// 計算屬性
const maxTfidf = computed(() => {
    if (!tfidfData.value?.terms.length) return 1;
    return Math.max(...tfidfData.value.terms.map(t => t.total_tfidf));
});

// 銷售圖表配置
const salesChartOption = computed(() => {
    if (!salesData.value?.points.length) return {};

    const xAxisData = salesData.value.points.map(point =>
        formatDate(point.batch_capture_time, false)
    );
    const seriesData = salesData.value.points.map(point =>
        point.sales_count || 0
    );

    return {
        title: {
            text: '銷售數量變化',
            left: 'center',
            textStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const data = params[0];
                return `${data.axisValue}<br/>銷售數量: ${data.value}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                rotate: 45,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: '銷售數量',
            minInterval: 1
        },
        series: [{
            name: '銷售數量',
            type: 'line',
            data: seriesData,
            smooth: true,
            lineStyle: { color: '#10b981' },
            itemStyle: { color: '#10b981' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
                    ]
                }
            }
        }]
    };
});

// 關閉 Modal
const closeModal = () => {
    emit('update:modelValue', false);
};

// 查看評論
const viewComments = (productId?: number) => {
    if (productId) {
        navigateTo(`/comments?product_id=${productId}`);
    }
};

// 獲取銷售數據
const fetchSalesData = async () => {
    if (!props.product?.id) return;

    salesLoading.value = true;
    salesError.value = null;

    try {
        const response = await $fetch(`/api/analysis/product-sales-series?product_id=${props.product.id}`) as ProductSalesSeriesResp;
        salesData.value = response;
    } catch (err: any) {
        salesError.value = err.message || '載入銷售數據失敗';
        console.error('Error fetching sales data:', err);
    } finally {
        salesLoading.value = false;
    }
};

// 獲取 TF-IDF 數據
const fetchTfidfData = async () => {
    if (!props.product?.id) return;

    tfidfLoading.value = true;
    tfidfError.value = null;

    try {
        const response = await $fetch(`/api/nlp/product-tfidf-top?product_id=${props.product.id}&limit=100`) as TfidfTopResp;
        tfidfData.value = response;
    } catch (err: any) {
        tfidfError.value = err.message || '載入 TF-IDF 數據失敗';
        console.error('Error fetching TF-IDF data:', err);
    } finally {
        tfidfLoading.value = false;
    }
};

// TF-IDF 顏色計算
const getTfidfColor = (ratio: number) => {
    if (ratio > 0.8) return '#dc2626'; // red-600
    if (ratio > 0.6) return '#ea580c'; // orange-600
    if (ratio > 0.4) return '#d97706'; // amber-600
    if (ratio > 0.2) return '#65a30d'; // lime-600
    return '#059669'; // emerald-600
};

// 監聽 Modal 開啟
watch(() => props.modelValue, async (newValue) => {
    if (newValue && props.product) {
        // 確保 ECharts 已初始化
        if (!VChart) {
            await initECharts();
        }
        fetchSalesData();
        fetchTfidfData();
    }
});

// 監聽商品變化
watch(() => props.product, async (newProduct) => {
    if (props.modelValue && newProduct) {
        // 確保 ECharts 已初始化
        if (!VChart) {
            await initECharts();
        }
        fetchSalesData();
        fetchTfidfData();
    }
});

// 組件掛載時初始化 ECharts
onMounted(async () => {
    if (process.client) {
        await initECharts();
    }
});
</script>
