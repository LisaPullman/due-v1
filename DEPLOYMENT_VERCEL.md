# FoxAI记账软件 - Vercel部署指南

## 🚀 快速部署步骤

### 1. 准备工作
确保您已准备好以下内容：
- Vercel账号（https://vercel.com）
- GitHub/GitLab/Bitbucket账号
- Vercel KV数据库（免费额度足够）

### 2. 环境变量配置
在Vercel控制台中设置以下环境变量：

```bash
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

获取方式：
1. 登录Vercel控制台
2. 进入Storage -> KV
3. 创建新的KV数据库或选择现有
4. 在KV详情页找到连接信息

### 3. 一键部署
点击下面的按钮进行一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/foxai-accounting)

或者手动部署：
1. 将代码推送到Git仓库
2. 在Vercel控制台导入项目
3. 配置环境变量
4. 点击部署

## 📋 项目结构

```
foxai-accounting/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── risk/         # 风险状态API
│   │   ├── statistics/   # 统计API
│   │   └── transactions/ # 交易记录API
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 布局文件
│   └── page.tsx          # 首页
├── components/            # React组件
│   ├── FoxAILogo.tsx     # Logo组件
│   ├── MobileNav.tsx     # 移动端导航
│   ├── RiskAlert.tsx     # 风险警告组件
│   ├── Toast.tsx         # 通知组件
│   └── TransactionForm.tsx # 交易表单
├── lib/                   # 工具库
│   ├── kv-service.ts     # KV服务层
│   ├── types.ts          # TypeScript类型定义
│   └── utils.ts          # 工具函数
├── public/               # 静态资源
│   ├── manifest.json     # PWA配置
│   └── favicon.ico       # 图标
├── next.config.js        # Next.js配置
├── package.json          # 项目依赖
├── tailwind.config.js    # Tailwind配置
├── tsconfig.json         # TypeScript配置
└── vercel.json          # Vercel部署配置
```

## ⚙️ 技术栈

- **前端框架**: Next.js 14 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Vercel KV (Redis兼容)
- **部署**: Vercel Serverless Functions
- **图标**: Lucide React
- **PWA**: 支持离线使用和安装

## 🔧 核心功能

### 1. 交易记录管理
- ✅ 添加盈利/亏损记录
- ✅ 自定义交易日期
- ✅ 添加备注说明
- ✅ 实时数据验证

### 2. 智能风险管理系统
- ✅ 连续亏损2次自动触发风险警告
- ✅ 24小时交易限制
- ✅ 手动重置风险状态
- ✅ 实时风险状态监控

### 3. 数据统计分析
- ✅ 今日盈利/亏损统计
- ✅ 净收益计算
- ✅ 胜率分析
- ✅ 平均值计算

### 4. 用户体验
- ✅ 响应式设计，支持移动端
- ✅ PWA支持，可安装为应用
- ✅ Toast通知系统
- ✅ 表单验证和错误处理

## 🌍 API端点

### 交易记录API
- `GET /api/transactions` - 获取交易记录
- `POST /api/transactions` - 创建新交易

### 风险状态API
- `GET /api/risk` - 获取当前风险状态
- `POST /api/risk?action=reset` - 重置风险状态

### 统计API
- `GET /api/statistics?period=daily&date=YYYY-MM-DD` - 获取统计数据

## 🎨 界面特色

### 现代化设计
- 渐变背景和玻璃态效果
- 流畅的动画过渡
- 专业的配色方案
- 移动端友好的交互

### 功能完整
- 实时数据更新
- 智能表单验证
- 风险状态可视化
- 一键数据刷新

## 📱 PWA功能

项目支持渐进式Web应用(PWA)：
- 离线使用
- 桌面安装
- 移动端安装
- 原生应用体验

## 🔒 安全特性

- 输入数据验证
- 错误边界处理
- 安全的API调用
- 数据持久化保护

## 🚀 性能优化

- 服务端渲染(SSR)
- 代码分割和懒加载
- 图片优化
- 缓存策略

## 📊 部署后验证

部署完成后，请验证以下功能：

1. **基本功能测试**
   - [ ] 添加盈利记录
   - [ ] 添加亏损记录
   - [ ] 查看统计数据
   - [ ] 检查风险状态

2. **风险管理测试**
   - [ ] 连续添加2次亏损记录
   - [ ] 验证风险警告触发
   - [ ] 测试24小时限制
   - [ ] 测试手动重置功能

3. **移动端测试**
   - [ ] 响应式布局
   - [ ] 触摸交互
   - [ ] PWA安装
   - [ ] 离线使用

## 🛠️ 故障排除

### 常见问题

**1. 环境变量配置错误**
```
Error: KV connection failed
```
**解决**: 检查KV_URL、KV_REST_API_URL、KV_REST_API_TOKEN是否正确配置

**2. 构建失败**
```
Error: Module not found
```
**解决**: 确保所有依赖已正确安装，尝试重新安装依赖

**3. API调用失败**
```
Error: Network error
```
**解决**: 检查网络连接，确认API端点可访问

### 获取帮助

如遇到问题，请检查：
1. Vercel控制台日志
2. 浏览器开发者工具
3. 网络请求状态
4. 环境变量配置

## 📞 技术支持

- GitHub Issues: [项目Issues页面]
- 文档更新: [项目Wiki]
- 版本历史: [CHANGELOG.md]

---

**🎉 恭喜！您的FoxAI记账软件已成功部署到Vercel！**

现在您可以开始使用这个智能记账系统，享受现代化的记账体验和智能风险管理功能。