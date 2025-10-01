#!/bin/bash

echo "🦊 FoxAI 记账软件 - 开发环境启动脚本"
echo "=================================="

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node --version)
npm_version=$(npm --version)
echo "✅ Node.js: $node_version"
echo "✅ npm: $npm_version"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 启动开发服务器
echo ""
echo "🚀 启动开发服务器..."
echo "📱 本地访问地址: http://localhost:3000"
echo "🔧 测试页面: http://localhost:3000/simple-test"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev