#!/bin/bash

echo "🦊 FoxAI 记账软件 - 项目状态检查"
echo "================================"

# 检查基本文件
echo "📁 检查项目文件..."
files=("package.json" "next.config.js" "tsconfig.json" "tailwind.config.js" "app/page.tsx" "app/layout.tsx")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (缺失)"
    fi
done

# 检查组件
echo ""
echo "🧩 检查组件文件..."
components=("components/FoxAILogo.tsx" "app/globals.css")
for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component"
    else
        echo "❌ $component (缺失)"
    fi
done

# 检查依赖
echo ""
echo "📦 检查依赖安装..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules 存在"
    if [ -f "node_modules/next/package.json" ]; then
        echo "✅ Next.js 已安装"
    else
        echo "❌ Next.js 未正确安装"
    fi
else
    echo "❌ node_modules 不存在，需要运行 npm install"
fi

# 检查端口
echo ""
echo "🌐 检查端口状态..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  端口 3000 已被占用"
    echo "   运行中的进程:"
    lsof -i :3000
else
    echo "✅ 端口 3000 可用"
fi

echo ""
echo "🚀 启动建议:"
echo "   1. 运行 ./start-dev.sh 启动开发服务器"
echo "   2. 或者运行 npm run dev"
echo "   3. 然后访问 http://localhost:3000"