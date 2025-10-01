# 🚀 Vercel部署详细步骤

## 📋 步骤1：项目导入

### 方法一：直接访问导入链接
1. **访问一键导入链接：**
   ```
   https://vercel.com/import/git?c=1&s=https://github.com/LisaPullman/due-v1
   ```

2. **登录Vercel**（使用GitHub账户）

3. **确认项目信息：**
   - Repository: LisaPullman/due-v1
   - Framework: Next.js
   - Root Directory: ./

### 方法二：手动导入
1. **登录Vercel控制台**
   - 访问：https://vercel.com/dashboard
   - 点击右上角的 "New Project"

2. **导入Git仓库**
   - 在 "Import Git Repository" 部分
   - 搜索：LisaPullman/due-v1
   - 点击 "Import"

## 📋 步骤2：项目配置

### 基础设置确认
确保以下设置正确：

```
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
Root Directory: ./
```

### 环境变量配置
**重要：先不要立即部署，需要先配置环境变量**

1. **点击 "Environment Variables" 展开**
2. **添加以下环境变量：**

```bash
# 这些值需要从Vercel KV获取
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
```

## 📋 步骤3：创建Vercel KV数据库

### 创建KV数据库
1. **在Vercel控制台中：**
   - 点击顶部菜单 "Storage"
   - 点击 "Create Database"
   - 选择 "KV"

2. **配置数据库：**
   - 名称：`foxai-accounting-kv`
   - 区域：选择 `Singapore (sin1)` 或就近区域
   - 点击 "Create"

3. **获取连接信息：**
   - 创建后会跳转到数据库详情页
   - 找到 ".env" 部分
   - 复制三个关键值：
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`

## 📋 步骤4：配置环境变量

### 添加环境变量到项目
1. **回到项目导入页面**
2. **在 Environment Variables 区域添加：**

```
KV_URL=粘贴_KV_URL_值
KV_REST_API_URL=粘贴_KV_REST_API_URL_值
KV_REST_API_TOKEN=粘贴_KV_REST_API_TOKEN_值
```

### 环境变量示例
```
KV_URL=redis://default:your_token@your_host:your_port
KV_REST_API_URL=https://your_host:your_port
KV_REST_API_TOKEN=your_token_here
```

## 📋 步骤5：部署项目

### 开始部署
1. **点击 "Deploy