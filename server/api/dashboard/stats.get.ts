export default defineEventHandler(async (event) => {
  try {
    // 暫時返回靜態數據，之後可以連接到資料庫
    return {
      totalProducts: 1234,
      totalComments: 5678,
      uniqueKeywords: 89,
      productsWithSalesChanges: 156
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard stats'
    });
  }
}); 