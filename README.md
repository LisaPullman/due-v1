# 🦊 FoxAI 记账软件

> 智能个人记账软件，具备风险提醒功能，支持免费部署到 Vercel

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

## ✨ 功能特点

- 🦊 **FoxAI 品牌展示** - 专业的品牌标识和视觉设计
- 📝 **智能交易录入** - 直观的表单界面，支持盈利/亏损记录
- ⚠️ **智能风险管理** - 连续2次亏损触发风险提醒，停止交易一天
- 🎭 **视觉风险提醒** - 浮动警告窗口 + 全页面灰色效果
- 📊 **数据统计分析** - 日/周/月度统计，图表可视化展示
- 🗑️ **数据重置功能** - 一键归零所有数据，支持系统初始化
- 📱 **响应式设计** - 完美适配手机、平板、桌面端
- 🔄 **PWA 支持** - 可安装为移动应用，支持离线访问
- 💰 **完全免费** - 基于 Vercel 免费额度，零成本运行

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd foxai-accounting

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 🚀 一键部署到 Vercel

1. **Fork 本项目** 到您的 GitHub 账户
2. **登录 Vercel** 并连接 GitHub
3. **导入项目** 选择您 fork 的仓库
4. **创建 KV 数据库** 在 Vercel Dashboard 中
5. **自动部署** Vercel 会自动构建和部署

详细步骤请查看 [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 14** - React 全栈框架，支持 App Router
- **TypeScript** - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 原子化 CSS 框架
- **Recharts** - React 图表库
- **Lucide React** - 现代化图标库

### 后端技术栈
- **Vercel Serverless Functions** - 无服务器 API 路由
- **Vercel KV** - Redis 兼容的键值数据库
- **Node.js 18** - JavaScript 运行时环境

### 部署平台
- **Vercel** - 现代化的前端部署平台
- **CDN** - 全球内容分发网络
- **HTTPS** - 自动 SSL 证书

## 📱 界面预览

### 主页 - 交易录入
- 左侧：智能交易录入表单
- 右侧：实时统计数据和风险状态
- 响应式布局，完美适配各种设备

### 统计页面 - 数据分析
- 多维度统计卡片
- 交互式图表展示
- 盈亏分析和胜率计算

### 测试页面 - 系统验证
- 风险管理系统测试
- 完整的测试流程
- 实时测试结果展示

## 🔧 配置说明

### 环境变量

部署到 Vercel 后，需要配置以下环境变量：

```bash
# Vercel KV 数据库配置
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 创建 Vercel KV 数据库

```bash
# 使用 Vercel CLI 创建
vercel kv create foxai-accounting-db

# 或在 Vercel Dashboard 中创建
# 访问 https://vercel.com/dashboard
# Storage -> Create Database -> KV
```

## 📊 API 接口

### 交易记录
```typescript
GET  /api/transactions     # 获取交易记录列表
POST /api/transactions     # 创建新交易记录
```

### 风险管理
```typescript
GET  /api/risk             # 获取风险状态
POST /api/risk?action=reset # 重置风险状态
```

### 统计分析
```typescript
GET /api/statistics?period=daily|weekly|monthly # 获取统计数据
```

## 📁 项目结构

```
foxai-accounting/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── transactions/  # 交易记录 API
│   │   ├── risk/         # 风险管理 API
│   │   └── statistics/   # 统计分析 API
│   ├── statistics/       # 统计页面
│   ├── test/            # 测试页面
│   ├── page.tsx         # 主页
│   ├── layout.tsx       # 布局组件
│   └── globals.css      # 全局样式
├── components/            # React 组件
│   ├── FoxAILogo.tsx     # 品牌 Logo
│   ├── TransactionForm.tsx # 交易表单
│   ├── RiskAlert.tsx     # 风险警告
│   └── Toast.tsx         # 消息提示
├── lib/                  # 工具库
│   ├── types.ts         # TypeScript 类型
│   ├── utils.ts         # 工具函数
│   └── kv-service.ts    # 数据库服务
├── public/              # 静态资源
│   ├── manifest.json    # PWA 配置
│   ├── sw.js           # Service Worker
│   └── icon.svg        # 应用图标
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
├── next.config.js       # Next.js 配置
└── vercel.json         # Vercel 部署配置
```

## 🛡️ 风险管理系统

### 智能风险控制
当用户连续录入 2 次亏损记录时，系统会自动：

1. **🚨 触发风险警告** - 显示醒目的中文警告提示
2. **⏸️ 暂停交易功能** - 24 小时内禁止录入新交易
3. **⏰ 倒计时显示** - 实时显示剩余解除时间
4. **🔄 自动恢复** - 24 小时后自动解除交易限制
5. **🔧 手动重置** - 管理员可手动重置风险状态

### 风险提醒特点
- 基于连续亏损次数的智能判断
- 24 小时精确计时系统
- 用户友好的中文提示界面
- 数据持久化保存风险状态

## 💰 免费额度说明

### Vercel 免费额度
- **带宽**: 100GB/月
- **部署次数**: 100 次/月  
- **函数执行时间**: 100GB 小时/月
- **团队成员**: 1 个

### Vercel KV 免费额度
- **命令数**: 30,000 次/月
- **存储容量**: 256MB
- **并发连接**: 30 个
- **数据传输**: 1GB/月

> 💡 **提示**: 对于个人记账使用，免费额度完全足够！

## 🔧 开发指南

### 本地开发环境
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 开发注意事项
1. **数据库优化** - 合理使用 KV 缓存，减少 API 调用
2. **响应式设计** - 确保在各种设备上的用户体验
3. **性能优化** - 利用 Next.js 的优化功能
4. **类型安全** - 充分利用 TypeScript 的类型检查

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Vercel](https://vercel.com/) - 优秀的部署平台
- [Tailwind CSS](https://tailwindcss.com/) - 现代化的 CSS 框架
- [Recharts](https://recharts.org/) - 优雅的图表库

---

<div align="center">

**🦊 FoxAI 记账软件 - 让记账变得智能而简单**

Made with ❤️ by FoxAI Team

</div>