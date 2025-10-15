import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv-service';
import { UpstashService } from '@/lib/upstash-service';
import { ApiResponse } from '@/lib/types';

// 使用 Upstash 服务，如果不可用则回退到 KV 服务
const DatabaseService = (process.env.UPSTASH_REDIS_REST_URL || process.env.STORAGE_URL || process.env.KV_REST_API_URL) ? UpstashService : KVService;

// 标记为动态路由
export const dynamic = 'force-dynamic';

// POST /api/reset - 重置所有数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, confirmCode } = body;

    // 验证确认码，防止误操作
    if (confirmCode !== 'RESET_ALL_DATA') {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_CONFIRM_CODE',
          message: '确认码错误，请输入正确的确认码',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (action === 'reset') {
      console.log('🔄 开始执行数据重置...');
      // 执行数据重置（resetAllData内部已经调用了recordResetTime）
      await DatabaseService.resetAllData();
      console.log('✅ 数据重置完成');

      const response: ApiResponse<{ message: string; resetTime: string }> = {
        success: true,
        data: {
          message: '所有数据已成功重置为初始状态',
          resetTime: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: '无效的操作类型',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error('Error resetting data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '数据重置失败，请稍后重试',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/reset - 获取系统数据概览
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 开始获取系统概览...');
    const overview = await DatabaseService.getSystemOverview();
    console.log('✅ 系统概览获取成功:', overview);

    const response: ApiResponse<typeof overview> = {
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error getting system overview:', error);
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'Unknown error');
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取系统概览失败',
      },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
