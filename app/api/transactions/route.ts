import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv-service';
import { UpstashService } from '@/lib/upstash-service';

// 使用 Upstash 服务，如果不可用则回退到 KV 服务
const DatabaseService = process.env.UPSTASH_REDIS_REST_URL || process.env.STORAGE_URL ? UpstashService : KVService;
import { ApiResponse, Transaction } from '@/lib/types';

// GET /api/transactions - 获取交易记录列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') as 'profit' | 'loss' | null;

    let transactions = await DatabaseService.getTransactions();

    // 日期过滤
    if (startDate) {
      transactions = transactions.filter(t => t.date >= startDate);
    }
    if (endDate) {
      transactions = transactions.filter(t => t.date <= endDate);
    }

    // 类型过滤
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: transactions,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting transactions:', error);
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

// POST /api/transactions - 创建新交易记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, amount, type, description } = body;

    // 输入验证
    if (!date || !amount || !type) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: date, amount, type',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (type !== 'profit' && type !== 'loss') {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction type. Must be "profit" or "loss"',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (amount <= 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amount must be greater than 0',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 检查风险状态
    const riskStatus = await DatabaseService.getRiskStatus();
    if (riskStatus.isInRisk) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'RISK_WARNING',
          message: '处于风险状态，24小时内无法录入新的交易记录',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(response, { status: 403 });
    }

    // 创建交易记录
    const newTransaction = await DatabaseService.addTransaction({
      date,
      amount: type === 'loss' ? -Math.abs(amount) : Math.abs(amount),
      type,
      description: description || '',
    });

    const response: ApiResponse<Transaction> = {
      success: true,
      data: newTransaction,
      message: type === 'loss' ? '亏损记录已添加' : '盈利记录已添加',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating transaction:', error);
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