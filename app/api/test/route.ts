import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API 连接正常！服务器运行中...',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
}