# 🔍 查找Vercel KV(Redis)环境变量指南

## 📍 具体位置步骤

### 方法1：在数据库详情页查找

1. **进入Vercel控制台**
   - https://vercel.com/dashboard

2. **点击"Storage"菜单**
   - 在顶部导航栏

3. **点击您的Redis数据库**
   - 应该显示为 `foxai-accounting-kv` 或您设置的名称

4. **查找连接信息**

**常见位置：**

#### 位置A：".env" 部分（最常见）
- 在数据库详情页顶部
- 标题可能是："Quickstart" 或 ".env"
- 会显示类似：
```
KV_URL=redis://default:abc123@your-host:6379
KV_REST_API_URL=https://your-host:6379
KV_REST_API_TOKEN=abc123
```

#### 位置B："Connect" 标签页
- 查找 "Connect" 或 "Connection" 标签
- 点击后显示连接详情

#### 位置C："Settings" 标签页
- 查找 "Settings" 或 "Configuration" 标签
- 可能有连接字符串部分

### 方法2：通过项目设置查找

1. **进入您的Vercel项目**
2. **点击"Settings"**
3. **点击"Environment Variables"**
4. **查找已有的KV变量**（如果已添加过）

### 方法3：创建时自动显示

如果您刚创建数据库，Vercel通常会在创建后立即显示连接信息弹窗。

## 🔑 变量格式说明

### KV_URL
格式：`redis://default:[TOKEN]@[HOST]:[PORT]`
示例：`redis://default:abc123def@redis-12345.c123.us-east-1-2.ec2.cloud.redislabs.com:6379`

### KV_REST_API_URL
格式：`https://[HOST]:[PORT]`
示例：`https://redis-12345.c123.us-east-1-2.ec2.cloud.redislabs.com:6379`

### KV_REST_API_TOKEN
格式：随机字符串
示例：`abc123def456ghi789`

## 📋 复制方法

1. **逐个复制**
   - 点击每个变量旁边的复制按钮
   - 或手动选择文本复制

2. **完整复制**
   - 复制整个.env部分
   - 然后分别粘贴到Vercel的环境变量配置中

## ⚠️ 注意事项

- **不要分享这些值** - 它们是访问您数据库的密钥
- **保持安全** - 不要在公共地方暴露
- **正确复制** - 确保包含完整的值，不要遗漏字符

## 🎯 下一步

找到这些值后，回到Vercel项目导入页面，在 **Environment Variables** 部分添加：

```
KV_URL=粘贴您的完整KV_URL值
KV_REST_API_URL=粘贴您的完整KV_REST_API_URL值
KV_REST_API_TOKEN=粘贴您的完整KV_REST_API_TOKEN值
```

## 🆘 如果找不到

如果您在上述位置都找不到，请：

1. **截图您当前看到的页面**（遮盖敏感信息）
2. **告诉我您看到的内容**
3. **我会根据具体情况指导您**

或者您可以：
- 返回Vercel数据库列表页面
- 重新点击进入数据库
- 查找是否有"Connect"或"Quickstart"按钮

**告诉我您现在看到什么内容，我会继续指导您！** 🚀