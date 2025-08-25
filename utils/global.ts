/**
 * 格式化日期為台灣本地時間格式
 * @param dateString - 日期字串
 * @param includeTime - 是否包含時間，預設為 true
 * @returns 格式化後的日期字串
 */
export function formatDate(dateString: string, includeTime: boolean = true): string {
  if (!dateString) return '–';
  
  const date = new Date(dateString);
  
  if (includeTime) {
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24 小時制
    });
  } else {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}

/**
 * 格式化數字為千分位格式
 * @param value - 數字值
 * @param decimals - 小數位數，預設為 0
 * @returns 格式化後的數字字串
 */
export function formatNumber(value: number | string | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined || value === '') return '–';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '–';
  
  // 先格式化小數位數
  const formatted = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
  
  // 分割整數和小數部分
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // 為整數部分添加千分位符號
  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // 組合結果
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger ?? '–';
}

/**
 * 格式化價格為千分位格式
 * @param price - 價格值
 * @param decimals - 小數位數，預設為 0
 * @param currency - 貨幣符號，預設為 '$'
 * @returns 格式化後的價格字串
 */
export function formatPrice(price: number | string | null | undefined, decimals: number = 0, currency: string = '$'): string {
  if (price === null || price === undefined || price === '') return '–';
  
  const formatted = formatNumber(price, decimals);
  return formatted === '–' ? '–' : `${currency}${formatted}`;
}

/**
 * 格式化百分比
 * @param value - 數值（0-1 之間）
 * @param decimals - 小數位數，預設為 1
 * @returns 格式化後的百分比字串
 */
export function formatPercentage(value: number | string | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined || value === '') return '–';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '–';
  
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * 截斷文字
 * @param text - 原始文字
 * @param maxLength - 最大長度
 * @param suffix - 後綴，預設為 '...'
 * @returns 截斷後的文字
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}

/**
 * 生成隨機 ID
 * @param length - ID 長度，預設為 8
 * @returns 隨機 ID 字串
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 延遲執行
 * @param ms - 延遲毫秒數
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函數
 * @param func - 要防抖的函數
 * @param wait - 等待時間（毫秒）
 * @returns 防抖後的函數
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 