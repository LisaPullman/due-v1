#!/bin/bash

echo "🦊 FoxAI 记账软件 - Git 推送脚本"
echo "================================"

# 检查 Git 状态
echo "📋 检查 Git 状态..."
git status

echo ""
echo "📦 添加所有文件到暂存区..."
git add .

echo ""
echo "📝 提交更改..."
read -p "请输入提交信息 (默认: Update FoxAI accounting app): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Update FoxAI accounting app"
fi

git commit -m "$commit_message"

echo ""
echo "🔍 检查远程仓库..."
if git remote -v | grep -q origin; then
    echo "✅ 远程仓库已配置"
    git remote -v
    
    echo ""
    echo "🚀 推送到远程仓库..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 推送成功！"
        echo ""
        echo "📋 下一步操作："
        echo "   1. 访问你的 GitHub 仓库确认代码已推送"
        echo "   2. 在 Vercel 中导入这个仓库"
        echo "   3. 配置 Vercel KV 数据库"
        echo "   4. 设置环境变量"
        echo "   5. 部署完成！"
        echo ""
        echo "🔗 Vercel 部署链接: https://vercel.com/new"
    else
        echo "❌ 推送失败，请检查网络连接和权限"
    fi
else
    echo "⚠️  未配置远程仓库"
    echo ""
    echo "请先配置远程仓库："
    echo "   git remote add origin <your-repo-url>"
    echo "   然后重新运行此脚本"
fi