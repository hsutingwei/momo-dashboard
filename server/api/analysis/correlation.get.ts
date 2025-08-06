import { db } from '~/server/utils/database';
import { correlationAnalysis, products } from '~/server/database/schema';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const method = query.method as string;
    const productId = query.productId as string;

    let analysisQuery = db
      .select({
        feature_name: correlationAnalysis.feature_name,
        method: correlationAnalysis.method,
        correlation_score: correlationAnalysis.correlation_score,
        p_value: correlationAnalysis.p_value,
        analysis_date: correlationAnalysis.analysis_date,
        product_name: products.name
      })
      .from(correlationAnalysis)
      .leftJoin(products, sql`${correlationAnalysis.product_id} = ${products.id}`);

    // 方法過濾
    if (method) {
      analysisQuery = analysisQuery.where(sql`${correlationAnalysis.method} = ${method}`);
    }

    // 商品過濾
    if (productId && productId !== 'all') {
      analysisQuery = analysisQuery.where(sql`${correlationAnalysis.product_id} = ${productId}`);
    }

    // 按相關性分數排序
    analysisQuery = analysisQuery.orderBy(sql`abs(${correlationAnalysis.correlation_score}) desc`);

    const analysisResults = await analysisQuery;

    return {
      correlations: analysisResults,
      method,
      productId
    };
  } catch (error) {
    console.error('Error fetching correlation analysis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch correlation analysis'
    });
  }
}); 