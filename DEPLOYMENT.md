# FoxAI记账软件 - 部署指南

## 🚀 快速部署到Vercel

### 前提条件
- Node.js 18+ 已安装
- Vercel账号已注册
- Git仓库（可选，用于自动部署）

### 步骤1：项目初始化

```bash
# 克隆或创建项目
cd foxai-accounting-vercel

# 安装依赖
npm install

# 本地测试
npm run dev
```

### 步骤2：Vercel CLI设置

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login
```

### 步骤3：创建Vercel KV数据库

```bash
# 创建KV数据库
kv create foxai-accounting-db

# 获取连接信息（会自动添加到环境变量）
```

### 步骤4：环境变量配置

在Vercel Dashboard中配置以下环境变量：

```bash
# 必需的环境变量
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 步骤5：部署

```bash
# 部署到Vercel
vercel

# 部署到生产环境
vercel --prod
```

## 📊 免费额度监控

### Vercel免费额度限制
- **带宽**: 100GB/月
- **函数执行时间**: 100GB小时/月
- **部署次数**: 100次/月
- **自定义域名**: 不支持（仅*.vercel.app）

### Vercel KV免费额度限制
- **命令数**: 30,000次/月
- **存储容量**: 100KB
- **并发连接**: 10个

### 监控建议
1. 在Vercel Dashboard中监控使用量
2. 实现简单的使用量统计
3. 接近限额时发送警告

## 🔧 配置优化

### vercel.json优化
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 10
    }
  },
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=0, stale-while-revalidate=0"
        }
      ]
    }
  ]
}
```

### 性能优化
1. **API缓存**: 对统计数据实现客户端缓存
2. **数据分页**: 大量交易记录时实现分页
3. **压缩**: 启用gzip压缩
4. **图片优化**: 使用WebP格式

## 🧪 测试部署

### 基本功能测试
1. **交易录入**: 添加盈利和亏损记录
2. **风险警告**: 连续2次亏损触发警告
3. **24小时限制**: 验证交易阻止功能
4. **统计计算**: 检查日/周/月统计数据
5. **响应式设计**: 移动端适配测试

### API测试端点
```bash
# 风险状态
GET https://your-app.vercel.app/api/risk

# 交易记录
GET https://your-app.vercel.app/api/transactions
POST https://your-app.vercel.app/api/transactions

# 统计数据
GET https://your-app.vercel.app/api/statistics?period=daily
GET https://your-app.vercel.app/api/statistics?period=weekly
GET https://your-app.vercel.app/api/statistics?period=monthly
```

## 🛠️ 故障排除

### 常见问题

#### 1. KV连接失败
- 检查环境变量配置
- 确认KV数据库已创建
- 验证网络连接

#### 2. API超时
- 检查函数执行时间限制
- 优化数据库查询
- 减少单次请求数据量

#### 3. 部署失败
- 检查依赖包版本
- 验证TypeScript配置
- 查看Vercel部署日志

#### 4. PWA功能异常
- 检查manifest.json配置
- 验证Service Worker注册
- 确认HTTPS环境

### 调试工具
```bash
# 查看实时日志
vercel logs

# 本地开发测试
npm run dev

# 构建测试
npm run build
```

## 📱 PWA安装

### 安装步骤
1. 在移动浏览器中打开应用
2. 点击浏览器菜单中的"添加到主屏幕"
3. 确认安装

### 支持的功能
- 离线访问
- 原生应用体验
- 推送通知（未来版本）

## 🔄 自动部署

### GitHub集成
1. 连接GitHub仓库到Vercel
2. 配置自动部署分支
3. 设置环境变量
4. 每次推送自动部署

### 分支策略
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支

## 📈 监控和分析

### Vercel Analytics
- 网站性能监控
- 用户行为分析
- 错误追踪

### 自定义监控
```typescript
// 添加简单的使用量监控
export class UsageMonitor {
  private static instance: UsageMonitor;
  private requestCount = 0;

  static getInstance(): UsageMonitor {
    if (!UsageMonitor.instance) {
      UsageMonitor.instance = new UsageMonitor();
    }
    return UsageMonitor.instance;
  }

  incrementRequest() {
    this.requestCount++;
    if (this.requestCount > 25000) {
      console.warn('接近Vercel KV免费额度上限');
    }
  }
}
```

## 🚀 扩展建议

### 未来功能
1. **用户认证**: 添加用户登录系统
2. **数据导出**: Excel/CSV导出功能
3. **图表增强**: 更多可视化图表
4. **预算管理**: 预算设置和提醒
5. **多语言**: 支持英文界面

### 升级方案
- **Vercel Pro**: $20/月，更多资源
- **Vercel KV付费**: 按使用量计费
- **数据库升级**: PlanetScale, Supabase

## 📞 支持

如有问题，请检查：
1. Vercel官方文档
2. 项目GitHub Issues
3. 技术社区论坛

---

**注意**: 部署前请确保已阅读并理解免费额度限制，避免产生意外费用。