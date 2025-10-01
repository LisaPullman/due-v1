# Vercel一键导入链接

## 🚀 快速导入方式

**一键导入链接：**
```
https://vercel.com/import/git?c=1&s=https://github.com/LisaPullman/due-v1
```

**或者手动导入步骤：**

1. 登录Vercel控制台：https://vercel.com/dashboard
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 搜索并选择：LisaPullman/due-v1
5. 点击 "Import"

## 🔧 导入设置

在导入页面，请确认以下设置：

- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: next build
- **Output Directory**: .next
- **Install Command**: npm install

## 📋 后续步骤

导入后，您需要：

1. 配置环境变量
2. 设置Vercel KV数据库
3. 部署项目
4. 测试功能

详细配置步骤请参考：
- DEPLOYMENT_VERCEL.md
- README_DEPLOY.md

## 🎯 环境变量预览

需要配置的环境变量：
```
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

这些将在后续步骤中获取。现在请先完成项目导入！🚀