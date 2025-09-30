# FoxAI记账软件

智能个人记账软件，具备风险提醒功能，支持免费部署到Vercel。

## 功能特点

- ✅ **FoxAI品牌展示**: 首页显著位置展示FoxAI LOGO
- ✅ **交易记录**: 手动录入盈利/亏损数据
- ✅ **智能风险提醒**: 连续2次亏损后自动24小时暂停交易
- ✅ **统计分析**: 日/周/月度盈亏统计和图表展示
- ✅ **响应式设计**: 支持移动端和桌面端
- ✅ **PWA支持**: 可安装为移动应用
- ✅ **免费部署**: 完全免费部署到Vercel

## 技术架构

- **前端**: Next.js + TypeScript + Tailwind CSS
- **后端**: Vercel Serverless Functions
- **数据库**: Vercel KV (Redis兼容)
- **图表**: Recharts
- **图标**: Lucide React

## 快速开始

### 本地开发

1. **安装依赖**
```bash
npm install
```

2. **本地开发服务器**
```bash
npm run dev
```

3. **构建生产版本**
```bash
npm run build
```

### Vercel部署

1. **安装Vercel CLI**
```bash
npm i -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **创建Vercel KV数据库**
```bash
kv create foxai-accounting-db
```

4. **部署到Vercel**
```bash
vercel
```

5. **配置环境变量**
在Vercel Dashboard中配置以下环境变量：
- `KV_URL`: 从KV创建时获得
- `KV_REST_API_URL`: 从KV创建时获得
- `KV_REST_API_TOKEN`: 从KV创建时获得

## API接口

### 交易记录
- `GET /api/transactions` - 获取交易记录列表
- `POST /api/transactions` - 创建新交易记录

### 风险管理
- `GET /api/risk` - 获取风险状态
- `POST /api/risk?action=reset` - 重置风险状态

### 统计
- `GET /api/statistics?period=daily|weekly|monthly` - 获取统计数据

## 项目结构

```
foxai-accounting-vercel/
├── app/                    # Next.js app目录
│   ├── api/               # API路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 布局组件
│   ├── page.tsx           # 首页
│   └── statistics/        # 统计页面
├── components/            # React组件
│   ├── FoxAILogo.tsx      # FoxAI品牌组件
│   ├── TransactionForm.tsx # 交易表单
│   └── RiskAlert.tsx      # 风险警告组件
├── lib/                   # 工具库
│   ├── types.ts           # TypeScript类型定义
│   └── kv-service.ts      # Vercel KV服务
├── public/                # 静态资源
│   ├── manifest.json      # PWA配置
│   └── sw.js             # Service Worker
└── vercel.json           # Vercel配置
```

## 项目文件说明

### 📁 根目录文件详解

#### 配置文件
- **`package.json`** - 项目依赖管理和脚本配置
  - 定义项目基本信息、依赖包和开发脚本
  - 包含 Next.js、React、Vercel KV 等核心依赖
  - 配置开发、构建、部署等命令

- **`tsconfig.json`** - TypeScript 编译器配置
  - 设置 TypeScript 编译选项和路径映射
  - 配置 JSX 支持和模块解析
  - 包含 Next.js 插件配置

- **`next.config.js`** - Next.js 框架配置
  - 启用 App Router 实验性功能
  - 配置图片域名白名单
  - 设置构建和运行时选项

- **`vercel.json`** - Vercel 平台部署配置
  - 定义 Serverless Functions 运行时环境
  - 配置部署区域和环境变量引用
  - 设置静态资源缓存策略

- **`tailwind.config.js`** - Tailwind CSS 样式配置
  - 定义自定义颜色主题（FoxAI 橙色）
  - 配置内容扫描路径
  - 设置样式插件

- **`postcss.config.js`** - PostCSS 处理配置
  - 配置 Tailwind CSS 和 Autoprefixer 插件
  - 处理 CSS 兼容性和优化

#### 开发工具
- **`dev-server.js`** - 本地开发服务器
  - 模拟 Vercel Serverless Functions 环境
  - 提供本地 API 测试接口
  - 支持热重载和跨域请求

- **`test.js`** - 自动化测试脚本
  - 测试风险管理系统逻辑
  - 验证交易记录功能
  - 检查数据持久化和状态管理

#### 文档文件
- **`README.md`** - 项目说明文档（本文件）
  - 包含项目介绍、安装部署指南
  - API 接口文档和项目结构说明

- **`go.md`** - 原始需求文档
  - 记录最初的项目需求和功能要求
  - 包含详细的功能规格说明

- **`技术规范文档.md`** - 完整技术规范
  - 系统架构设计和数据模型定义
  - API 接口规范和前端组件设计
  - 性能优化和安全性要求

- **`Vercel部署指南.md`** - 部署实施指南
  - 详细的 Vercel 部署步骤
  - 免费额度说明和优化建议
  - 架构迁移和配置说明

- **`DEPLOYMENT.md`** - 部署操作手册
  - 实际部署流程和命令
  - 环境配置和故障排除
  - 生产环境维护指南

- **`PROJECT_SUMMARY.md`** - 项目完成总结
  - 功能实现清单和验收标准
  - 技术实现总结和性能指标
  - 项目里程碑和交付物说明

- **`CLAUDE.md`** - AI 助手指导文档
  - 为 Claude Code 提供的项目指导
  - 架构决策和技术栈说明
  - 开发规范和最佳实践

#### 其他文件
- **`next-env.d.ts`** - Next.js TypeScript 声明文件
  - 提供 Next.js 相关类型定义
  - 支持 IDE 智能提示和类型检查

- **`.gitignore`** - Git 忽略文件配置
  - 排除 node_modules、构建产物等
  - 保护敏感信息和临时文件

- **`.claude/`** - Claude AI 助手配置目录
  - 存储 AI 助手的工作状态和配置
  - 支持智能代码生成和项目理解

## 许可证
```

## 风险管理系统

当用户连续录入2次亏损记录时，系统会自动：

1. **触发风险警告**: 显示大幅中文警告提示
2. **暂停交易**: 24小时内禁止录入新交易
3. **倒计时显示**: 显示剩余解除时间
4. **自动恢复**: 24小时后自动解除限制

## 免费额度说明

### Vercel免费额度
- 带宽: 100GB/月
- 部署次数: 100次/月
- 函数执行时间: 100GB小时/月

### Vercel KV免费额度
- 命令数: 30,000次/月
- 存储容量: 100KB
- 并发连接: 10个

## 开发注意事项

1. **KV使用优化**: 合理使用缓存，减少KV命令数
2. **响应式设计**: 确保移动端体验
3. **风险逻辑**: 严格测试24小时计时器
4. **性能优化**: 使用Next.js优化功能

## 许可证

MIT License