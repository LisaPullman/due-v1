#!/bin/bash

# Vercel部署状态检查器
echo "🔍 FoxAI记账软件 - 部署状态检查"
echo "=================================="
echo ""

# 检查项目是否已部署
echo "📊 检查GitHub仓库状态："
echo "仓库地址: https://github.com/LisaPullman/due-v1"
echo ""

# 检查Vercel可能的域名
echo "🌐 可能的Vercel域名："
echo "1. https://due-v1.vercel.app"
echo "2. https://due-v1-git-main-lisapullman.vercel.app"
echo "3. https://due-v1-lisapullman.vercel.app"
echo ""

echo "📋 请检查以下内容："
echo ""
echo "✅ 部署成功指标："
echo "1. Vercel控制台显示 'Ready' 状态"
echo "2. 构建日志显示 'Build Complete'"
echo "3. 没有红色错误信息"
echo "4. 显示部署时间和域名"
echo ""
echo "⚠️  部署失败指标："
echo "1. 显示 'Build Failed'"
echo "2. 有红色错误信息"
echo "3. 构建过程卡住或超时"
echo ""

echo "🔧 如果部署失败，请："
echo "1. 查看Vercel构建日志"
echo "2. 检查环境变量是否正确"
echo "3. 确认KV数据库连接正常"
echo "4. 告诉我具体的错误信息"
echo ""

echo "当您看到部署状态后，请告诉我："
echo "- 部署状态 (成功/失败)"
echo "- 如果有错误，具体的错误信息"
echo "- 部署域名（如果成功）"