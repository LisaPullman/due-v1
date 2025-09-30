# FoxAI 记账软件 - Vercel免费部署指南

## 📋 部署方案概述

基于当前需求分析，**原架构无法直接部署到Vercel**，但可以通过架构调整实现免费部署。

### 🎯 推荐方案: Vercel + Vercel KV
- **前端**: Next.js (React框架)
- **后端**: Vercel Serverless Functions
- **数据库**: Vercel KV (Redis兼容)
- **成本**: 完全免费 (有额度限制)

## 🔄 架构迁移对比

| 方面 | 原架构 | Vercel架构 |
|------|--------|------------|
| 前端 | React/Vue | Next.js |
| 后端 | Express服务器 | Serverless Functions |
| 数据库 | 本地JSON/SQLite | Vercel KV |
| 部署 | Electron + 自托管 | Vercel自动部署 |
| 数据持久化 | 本地文件 | 云数据库 |

## 🚀 实施步骤

### 1. 项目初始化
```bash
# 创建 Next.js 项目
npx create-next-app@latest foxai-accounting-vercel --typescript --tailwind --eslint --app

cd foxai-accounting-vercel

# 安装必要依赖
npm install @vercel/kv
npm install date-fns recharts lucide-react
```

### 2. 创建Vercel KV数据库
```bash
# 安装 Vercel CLI
npm i -g vercel @vercel/kv

# 登录 Vercel
vercel login

# 创建 KV 数据库
kv create foxai-accounting-db

# 获取连接信息 (会自动添加到环境变量)
```

### 3. 核心功能实现

#### 数据模型定义 (`lib/types.ts`)
```typescript
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'profit' | 'loss';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskStatus {
  isInRisk: boolean;
  consecutiveLosses: number;
  lastRiskDate?: string;
}
```

#### KV 数据服务 (`lib/kv-service.ts`)
```typescript
import { kv } from '@vercel/kv';

export class KVService {
  // 交易记录操作
  static async getTransactions(): Promise<Transaction[]> {
    return await kv.get('transactions') || [];
  }

  static async addTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions();
    transactions.push(transaction);
    await kv.set('transactions', transactions);
  }

  // 风险状态操作
  static async getRiskStatus(): Promise<RiskStatus> {
    return await kv.get('riskStatus') || {
      isInRisk: false,
      consecutiveLosses: 0
    };
  }

  static async updateRiskStatus(status: RiskStatus): Promise<void> {
    await kv.set('riskStatus', status);
  }
}
```

#### API 路由实现 (`pages/api/transactions.ts`)
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { KVService } from '../../lib/kv-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const transactions = await KVService.getTransactions();
        res.status(200).json({ success: true, data: transactions });
        break;

      case 'POST':
        const newTransaction = {
          ...req.body,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await KVService.addTransaction(newTransaction);
        res.status(201).json({ success: true, data: newTransaction });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
```

### 4. 前端页面实现

#### 首页 (`pages/index.tsx`)
```typescript
import { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import RiskAlert from '../components/RiskAlert';
import FoxAILogo from '../components/FoxAILogo';

export default function Home() {
  const [riskStatus, setRiskStatus] = useState(null);

  useEffect(() => {
    fetchRiskStatus();
  }, []);

  const fetchRiskStatus = async () => {
    const response = await fetch('/api/risk');
    const data = await response.json();
    setRiskStatus(data.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FoxAILogo />
      {riskStatus?.isInRisk && <RiskAlert riskStatus={riskStatus} />}
      <TransactionForm onSubmit={handleTransactionSubmit} />
    </div>
  );
}
```

### 5. 部署配置

#### `vercel.json`
```json
{
  "functions": {
    "pages/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "regions": ["sin1"]
}
```

#### `package.json` 脚本
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "vercel --prod"
  }
}
```

### 6. 部署执行
```bash
# 本地测试
npm run dev

# 部署到 Vercel
vercel

# 或者推送到 Git 仓库自动部署
git add .
git commit -m "Initial Vercel deployment"
git push origin main
```

## 📊 免费额度说明

### Vercel 免费额度
- ✅ **带宽**: 100GB/月
- ✅ **部署次数**: 100次/月
- ✅ **自定义域名**: *.vercel.app
- ❌ **付费功能**: 商业域名、团队协作

### Vercel KV 免费额度
- ✅ **命令数**: 30,000/月
- ✅ **存储容量**: 100KB
- ✅ **并发连接**: 10个
- ⚠️ **注意**: 适合小型应用，数据量不大的场景

## 🔧 扩展和优化

### 数据量增大时的升级方案
1. **PlanetScale**: 免费MySQL数据库 (1GB存储)
2. **Supabase**: 免费PostgreSQL (500MB存储)
3. **MongoDB Atlas**: 免费MongoDB (512MB存储)

### 性能优化
- 实现数据分页
- 添加缓存机制
- 使用 Next.js ISR

### 安全性增强
- 添加用户认证 (NextAuth.js)
- 实现数据加密
- 添加输入验证

## 🎯 总结

通过架构调整，FoxAI记账软件可以**完全免费**部署到Vercel平台：

- **技术栈**: Next.js + Vercel KV
- **部署方式**: 自动CI/CD
- **维护成本**: 几乎为零
- **扩展性**: 支持未来升级到付费服务

此方案既满足了原始需求，又充分利用了现代云服务的优势。