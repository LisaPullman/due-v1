// Simple development server for testing
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Simple router for API endpoints
async function handleAPI(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

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
      // 模拟风险状态API
      const riskStatus = {
        success: true,
        data: {
          isInRisk: false,
          consecutiveLosses: 0,
          riskStartTime: null,
          lastRiskDate: null
        },
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(riskStatus));
    }
    else if (pathname === '/api/transactions' && req.method === 'GET') {
      // 模拟交易记录API
      const transactions = {
        success: true,
        data: [],
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(transactions));
    }
    else if (pathname === '/api/transactions' && req.method === 'POST') {
      // 模拟添加交易API
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const transactionData = JSON.parse(body);

          // 模拟风险检查 - 如果连续2次亏损，进入风险状态
          if (transactionData.type === 'loss') {
            const riskResponse = {
              success: true,
              message: '交易记录已添加，请注意风险',
              data: {
                id: Date.now(),
                ...transactionData,
                createdAt: new Date().toISOString()
              }
            };
            res.statusCode = 200;
            res.end(JSON.stringify(riskResponse));
          } else {
            const successResponse = {
              success: true,
              message: '交易记录已成功添加',
              data: {
                id: Date.now(),
                ...transactionData,
                createdAt: new Date().toISOString()
              }
            };
            res.statusCode = 200;
            res.end(JSON.stringify(successResponse));
          }
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
      // 模拟统计API
      const { period, date } = parsedUrl.query;

      const statistics = {
        success: true,
        data: {
          totalTransactions: 0,
          totalProfit: 0,
          totalLoss: 0,
          netProfit: 0,
          averageProfit: 0,
          averageLoss: 0,
          winRate: 0,
          consecutiveLosses: 0,
          period: period || 'daily',
          date: date || new Date().toISOString().split('T')[0]
        },
        timestamp: new Date().toISOString()
      };
      res.statusCode = 200;
      res.end(JSON.stringify(statistics));
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

// Create server
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
      // 如果frontend.html不存在，回退到简单的测试页面
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;
      res.end(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FoxAI记账软件 - 开发服务器</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #FF6B35; text-align: center; }
            .api-test { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
            button { background: #FF6B35; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
            button:hover { background: #E55A2B; }
            .result { margin-top: 10px; padding: 10px; background: #e8f5e8; border-radius: 3px; font-family: monospace; }
            .error { background: #ffe8e8; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🦊 FoxAI记账软件 - 开发服务器</h1>
            <p style="text-align: center; color: #666;">项目已正确初始化，API接口测试页面</p>

            <div class="api-test">
              <h3>测试API接口</h3>
              <button onclick="testAPI('/api/risk')">测试风险状态API</button>
              <button onclick="testAPI('/api/transactions')">测试交易记录API</button>
              <button onclick="testAPI('/api/statistics')">测试统计API</button>
              <div id="result" class="result" style="display: none;"></div>
            </div>

            <div class="api-test">
              <h3>添加测试交易</h3>
              <button onclick="addTestTransaction('profit', 100)">添加盈利记录</button>
              <button onclick="addTestTransaction('loss', 50)">添加亏损记录</button>
              <div id="addResult" class="result" style="display: none;"></div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="/test" style="color: #FF6B35; text-decoration: none;">前往完整测试页面 →</a>
            </div>
          </div>

          <script>
            async function testAPI(endpoint) {
              try {
                const response = await fetch(endpoint);
                const data = await response.json();
                showResult(JSON.stringify(data, null, 2), 'result');
              } catch (error) {
                showResult('错误: ' + error.message, 'result', true);
              }
            }

            async function addTestTransaction(type, amount) {
              try {
                const response = await fetch('/api/transactions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    date: new Date().toISOString().split('T')[0],
                    amount: amount,
                    type: type,
                    description: '测试交易'
                  })
                });
                const data = await response.json();
                showResult(JSON.stringify(data, null, 2), 'addResult');
              } catch (error) {
                showResult('错误: ' + error.message, 'addResult', true);
              }
            }

            function showResult(content, elementId, isError = false) {
              const element = document.getElementById(elementId);
              element.textContent = content;
              element.style.display = 'block';
              element.className = isError ? 'result error' : 'result';
            }
          </script>
        </body>
        </html>
      `);
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n🦊 FoxAI记账软件 开发服务器`);
  console.log(`🌐 服务器运行在: http://localhost:${PORT}`);
  console.log(`📋 API 端点:`);
  console.log(`   - GET  http://localhost:${PORT}/api/risk`);
  console.log(`   - GET  http://localhost:${PORT}/api/transactions`);
  console.log(`   - POST http://localhost:${PORT}/api/transactions`);
  console.log(`   - GET  http://localhost:${PORT}/api/statistics`);
  console.log(`\n🧪 在浏览器中打开 http://localhost:${PORT} 进行测试`);
  console.log(`\n⚠️  注意：这是一个简单的开发服务器，仅用于测试API接口`);
});