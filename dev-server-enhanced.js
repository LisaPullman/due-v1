// Enhanced development server with data persistence
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// 数据存储
let transactions = [];
let riskStatus = {
  isInRisk: false,
  consecutiveLosses: 0,
  riskStartTime: null,
  lastRiskDate: null
};

// 保存数据到文件
function saveData() {
  try {
    const data = {
      transactions,
      riskStatus,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(path.join(__dirname, 'dev-data.json'), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

// 加载数据从文件
function loadData() {
  try {
    if (fs.existsSync(path.join(__dirname, 'dev-data.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'dev-data.json'), 'utf8'));
      transactions = data.transactions || [];
      riskStatus = data.riskStatus || {
        isInRisk: false,
        consecutiveLosses: 0,
        riskStartTime: null,
        lastRiskDate: null
      };
      console.log('✅ 已加载保存的数据');
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    transactions = [];
    riskStatus = {
      isInRisk: false,
      consecutiveLosses: 0,
      riskStartTime: null,
      lastRiskDate: null
    };
  }
}

// 计算统计数据
function calculateStatistics(date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const dayStart = new Date(targetDate);
  const dayEnd = new Date(targetDate);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const dayTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= dayStart && tDate < dayEnd;
  });

  const totalProfit = dayTransactions
    .filter(t => t.type === 'profit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLoss = dayTransactions
    .filter(t => t.type === 'loss')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalTransactions: dayTransactions.length,
    totalProfit,
    totalLoss,
    netProfit: totalProfit - totalLoss,
    averageProfit: dayTransactions.filter(t => t.type === 'profit').length > 0 ? totalProfit / dayTransactions.filter(t => t.type === 'profit').length : 0,
    averageLoss: dayTransactions.filter(t => t.type === 'loss').length > 0 ? totalLoss / dayTransactions.filter(t => t.type === 'loss').length : 0,
    winRate: dayTransactions.length > 0 ? (dayTransactions.filter(t => t.type === 'profit').length / dayTransactions.length * 100) : 0,
    consecutiveLosses: riskStatus.consecutiveLosses
  };
}

// 更新风险状态
function updateRiskStatus(newTransaction) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (newTransaction.type === 'loss') {
    riskStatus.consecutiveLosses += 1;

    // 如果连续亏损2次，进入风险状态
    if (riskStatus.consecutiveLosses >= 2) {
      riskStatus.isInRisk = true;
      riskStatus.riskStartTime = now.toISOString();
      riskStatus.lastRiskDate = today;
    }
  } else {
    // 盈利时重置连续亏损计数
    riskStatus.consecutiveLosses = 0;
    if (riskStatus.isInRisk) {
      // 如果当前在风险状态，可以重置
      riskStatus.isInRisk = false;
      riskStatus.riskStartTime = null;
    }
  }

  saveData();
}

// API处理函数
async function handleAPI(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    if (pathname === '/api/risk' && req.method === 'GET') {
      // 风险状态API
      const response = {
        success: true,
        data: { ...riskStatus },
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(response));
    }
    else if (pathname === '/api/risk' && req.method === 'POST' && query.action === 'reset') {
      // 重置风险状态API
      riskStatus = {
        isInRisk: false,
        consecutiveLosses: 0,
        riskStartTime: null,
        lastRiskDate: null
      };
      saveData();

      const response = {
        success: true,
        message: '风险状态已重置',
        data: { ...riskStatus },
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(response));
    }
    else if (pathname === '/api/transactions' && req.method === 'GET') {
      // 交易记录API
      const response = {
        success: true,
        data: [...transactions].reverse(), // 最新的在前面
        count: transactions.length,
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(response));
    }
    else if (pathname === '/api/transactions' && req.method === 'POST') {
      // 添加交易API
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const transactionData = JSON.parse(body);

          // 验证数据
          if (!transactionData.date || !transactionData.amount || !transactionData.type) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              success: false,
              error: {
                code: 'INVALID_DATA',
                message: '缺少必要字段'
              }
            }));
            return;
          }

          // 检查风险状态
          if (riskStatus.isInRisk) {
            res.statusCode = 403;
            res.end(JSON.stringify({
              success: false,
              error: {
                code: 'RISK_WARNING',
                message: '您当前处于风险警告状态，24小时内无法录入新的交易记录'
              }
            }));
            return;
          }

          // 创建新交易
          const newTransaction = {
            id: Date.now(),
            date: transactionData.date,
            amount: parseFloat(transactionData.amount),
            type: transactionData.type,
            description: transactionData.description || '',
            createdAt: new Date().toISOString()
          };

          // 添加到交易列表
          transactions.push(newTransaction);

          // 更新风险状态
          updateRiskStatus(newTransaction);

          const response = {
            success: true,
            message: '交易记录已成功添加',
            data: newTransaction,
            timestamp: new Date().toISOString()
          };

          res.statusCode = 200;
          res.end(JSON.stringify(response));
        } catch (error) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            success: false,
            error: {
              code: 'INVALID_DATA',
              message: '无效的请求数据'
            }
          }));
        }
      });
    }
    else if (pathname === '/api/statistics' && req.method === 'GET') {
      // 统计API
      const { period, date } = query;
      const statistics = calculateStatistics(date);

      const response = {
        success: true,
        data: {
          ...statistics,
          period: period || 'daily',
          date: date || new Date().toISOString().split('T')[0]
        },
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(response));
    }
    else {
      res.statusCode = 404;
      res.end(JSON.stringify({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'API接口不存在'
        }
      }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '服务器内部错误'
      }
    }));
  }
}

// 创建服务器
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (req.url?.startsWith('/api/')) {
    handleAPI(req, res);
  } else {
    // 提供美观的前端界面
    const frontendPath = path.join(__dirname, 'frontend.html');
    if (fs.existsSync(frontendPath)) {
      const content = fs.readFileSync(frontendPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;
      res.end(content);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('frontend.html 文件未找到');
    }
  }
});

// 启动服务器
server.listen(PORT, () => {
  // 加载之前保存的数据
  loadData();

  console.log(`\n🦊 FoxAI记账软件 增强版开发服务器`);
  console.log(`🌐 服务器运行在: http://localhost:${PORT}`);
  console.log(`📋 API 端点:`);
  console.log(`   - GET  http://localhost:${PORT}/api/risk`);
  console.log(`   - POST http://localhost:${PORT}/api/risk?action=reset`);
  console.log(`   - GET  http://localhost:${PORT}/api/transactions`);
  console.log(`   - POST http://localhost:${PORT}/api/transactions`);
  console.log(`   - GET  http://localhost:${PORT}/api/statistics`);
  console.log(`\n🧪 在浏览器中打开 http://localhost:${PORT} 进行测试`);
  console.log(`\n💾 数据将自动保存到 dev-data.json 文件`);
  console.log(`\n⚠️  注意：这是一个增强的开发服务器，支持数据持久化`);
});