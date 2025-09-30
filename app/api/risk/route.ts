import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv-service';
import { ApiResponse, RiskStatus } from '@/lib/types';

// GET /api/risk - 获取风险状态
export async function GET(request: NextRequest) {
  try {
    // 检查并自动重置过期的风险状态
    const riskStatus = await KVService.checkAndResetRiskStatus();

    const response: ApiResponse<RiskStatus> = {
      success: true,
      data: riskStatus,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting risk status:', error);
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

// POST /api/risk/reset - 重置风险状态
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'reset') {
      await KVService.resetRiskStatus();

      const response: ApiResponse<null> = {
        success: true,
        message: '风险状态已重置',
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response);
    }

    // 默认检查风险状态
    const riskStatus = await KVService.checkAndResetRiskStatus();

    const response: ApiResponse<RiskStatus> = {
      success: true,
      data: riskStatus,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling risk status:', error);
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