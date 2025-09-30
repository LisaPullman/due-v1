import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv-service';
import { ApiResponse } from '@/lib/types';

// GET /api/statistics - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'daily';
    const date = searchParams.get('date');

    const statistics = await KVService.getStatistics(period, date || undefined);

    const response: ApiResponse<any> = {
      success: true,
      data: statistics,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting statistics:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}