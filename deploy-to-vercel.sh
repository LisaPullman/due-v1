#!/bin/bash

echo "🦊 FoxAI 记账软件 - Vercel 部署脚本"
echo "=================================="

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Vercel CLI 已就绪"

# 检查登录状态
echo "🔐 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 请登录 Vercel..."
    vercel login
fi

echo "✅ 已登录 Vercel"

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 项目构建成功"
else
    echo "❌ 项目构建失败，请检查错误信息"
    exit 1
fi

# 部署到 Vercel
echo "🚀 开始部署..."
echo ""
echo "⚠️  重要提醒："
echo "   1. 如果是首次部署，需要创建 Vercel KV 数据库"
echo "   2. 部署后需要配置环境变量"
echo "   3. 详细步骤请参考 VERCEL_部署完整指南.md"
echo ""

read -p "是否继续部署？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📋 下一步操作："
    echo "   1. 创建 Vercel KV 数据库: vercel kv create foxai-accounting-db"
    echo "   2. 配置环境变量 (KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN)"
    echo "   3. 重新部署: vercel --prod"
    echo ""
    echo "📖 详细指南: 查看 VERCEL_部署完整指南.md"
else
    echo "❌ 部署已取消"
fi