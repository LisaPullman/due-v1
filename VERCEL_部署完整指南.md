# FoxAI 记账软件 - Vercel 部署完整指南

## 🎯 部署概览

这个指南将帮你把 FoxAI 记账软件完全免费部署到 Vercel 平台。

## 📋 部署前准备

### 1. 确认本地运行正常
```bash
# 启动本地开发服务器
npm run dev

# 访问 http://localhost:3000 确认正常
```

### 2. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 3. 登录 Vercel
```bash
vercel login
```

## 🗄️ 第一步：创建 Vercel KV 数据库

### 1. 创建 KV 数据库
```bash
# 创建 KV 数据库
vercel kv create foxai-accounting-db

# 或者通过 Vercel Dashboard 创建
# 访问 https://vercel.com/dashboard
# 点击 Storage -> Create Database -> KV
```

### 2. 获取数据库连接信息
创建成功后，你会得到三个重要的环境变量：
- `KV_URL`
- `KV_REST_API_URL` 
- `KV_REST_API_TOKEN`

**保存这些信息，稍后需要配置！**

## 🚀 第二步：部署应用

### 1. 初始化 Vercel 项目
```bash
# 在项目根目录运行
vercel

# 按提示操作：
# ? Set up and deploy "~/path/to/foxai-accounting-vercel"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? foxai-accounting
# ? In which directory is your code located? ./
```

### 2. 配置环境变量
```bash
# 方法一：使用 CLI 配置
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN

# 方法二：通过 Dashboard 配置
# 访问 https://vercel.com/dashboard
# 选择你的项目 -> Settings -> Environment Variables
```

### 3. 重新部署
```bash
# 配置环境变量后重新部署
vercel --prod
```

## 🔧 第三步：验证部署

### 1. 访问部署的应用
部署成功后，Vercel 会提供一个 URL，类似：
```
https://foxai-accounting-xxx.vercel.app
```

### 2. 测试功能
- ✅ 页面加载正常
- ✅ FoxAI Logo 显示
- ✅ 响应式设计工作
- ✅ API 接口响应

### 3. 测试数据库连接
访问 `/api/test` 接口，确认数据库连接正常。

## 📱 第四步：配置 PWA（可选）

### 1. 确认 PWA 文件存在
```bash
ls public/manifest.json
ls public/sw.js
```

### 2. 测试 PWA 功能
- 在手机浏览器中访问应用
- 查看是否提示"添加到主屏幕"
- 测试离线功能

## 🎛️ 高级配置

### 1. 自定义域名（可选）
```bash
# 添加自定义域名
vercel domains add yourdomain.com
```

### 2. 性能优化
- 启用 Vercel Analytics
- 配置 CDN 缓存
- 优化图片加载

### 3. 监控设置
- 配置错误监控
- 设置性能警报
- 查看使用量统计

## 📊 免费额度说明

### Vercel 免费额度
- **带宽**: 100GB/月
- **部署次数**: 100次/月  
- **函数执行时间**: 100GB小时/月
- **团队成员**: 1个

### Vercel KV 免费额度
- **命令数**: 30,000次/月
- **存储容量**: 256MB
- **并发连接**: 30个
- **数据传输**: 1GB/月

## 🛠️ 故障排除

### 1. 部署失败
```bash
# 查看部署日志
vercel logs

# 重新部署
vercel --prod --force
```

### 2. 环境变量问题
```bash
# 查看环境变量
vercel env ls

# 删除错误的环境变量
vercel env rm KV_URL
```

### 3. 数据库连接问题
- 确认 KV 数据库已创建
- 检查环境变量配置
- 验证 API 路由正确

## 📋 部署检查清单

- [ ] 本地开发环境正常运行
- [ ] Vercel CLI 已安装并登录
- [ ] Vercel KV 数据库已创建
- [ ] 环境变量已正确配置
- [ ] 应用已成功部署
- [ ] 所有功能测试通过
- [ ] PWA 功能正常（可选）
- [ ] 性能监控已配置（可选）

## 🎉 部署完成

恭喜！你的 FoxAI 记账软件现在已经：

✅ **完全免费运行** - 使用 Vercel 免费额度  
✅ **全球 CDN 加速** - 快速访问体验  
✅ **自动 HTTPS** - 安全连接  
✅ **无服务器架构** - 自动扩缩容  
✅ **持续部署** - Git 推送自动更新  

## 📞 获取帮助

如果遇到问题：
1. 查看 Vercel 官方文档
2. 检查项目的 README.md
3. 查看部署日志排查错误
4. 联系技术支持

---

**下一步**: 开始使用你的智能记账软件，体验风险管理功能！