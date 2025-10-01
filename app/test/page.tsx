'use client';

import { useState, useEffect } from 'react';
import FoxAILogo from '@/components/FoxAILogo';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const testRiskManagement = async () => {
    setIsTesting(true);
    setTestResults([]);

    try {
      addTestResult('开始测试风险管理系统...');

      // 测试1: 获取初始风险状态
      addTestResult('测试1: 获取初始风险状态');
      const initialRiskResponse = await fetch('/api/risk');
      const initialRiskData = await initialRiskResponse.json();

      if (initialRiskData.success) {
        addTestResult(`✓ 初始状态: ${initialRiskData.data.isInRisk ? '风险中' : '正常'}`);
        addTestResult(`✓ 连续亏损次数: ${initialRiskData.data.consecutiveLosses}`);
      } else {
        addTestResult('✗ 获取初始风险状态失败');
        return;
      }

      // 测试2: 添加第一笔亏损记录
      addTestResult('测试2: 添加第一笔亏损记录');
      const loss1Response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          amount: 100,
          type: 'loss',
          description: '测试亏损1'
        })
      });
      const loss1Data = await loss1Response.json();

      if (loss1Data.success) {
        addTestResult('✓ 第一笔亏损记录添加成功');
      } else {
        addTestResult('✗ 第一笔亏损记录添加失败: ' + loss1Data.error?.message);
      }

      // 测试3: 检查风险状态（应该为1次连续亏损）
      addTestResult('测试3: 检查风险状态（1次连续亏损）');
      const risk1Response = await fetch('/api/risk');
      const risk1Data = await risk1Response.json();

      if (risk1Data.success) {
        addTestResult(`✓ 连续亏损次数: ${risk1Data.data.consecutiveLosses}`);
        addTestResult(`✓ 风险状态: ${risk1Data.data.isInRisk ? '风险中' : '正常'}`);

        if (risk1Data.data.consecutiveLosses === 1 && !risk1Data.data.isInRisk) {
          addTestResult('✓ 风险状态正确：1次亏损，未触发风险警告');
        } else {
          addTestResult('✗ 风险状态异常');
        }
      }

      // 测试4: 添加第二笔亏损记录（应该触发风险警告）
      addTestResult('测试4: 添加第二笔亏损记录（应该触发风险警告）');
      const loss2Response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          amount: 200,
          type: 'loss',
          description: '测试亏损2'
        })
      });
      const loss2Data = await loss2Response.json();

      if (loss2Data.success) {
        addTestResult('✓ 第二笔亏损记录添加成功');
      } else {
        addTestResult('✗ 第二笔亏损记录添加失败: ' + loss2Data.error?.message);
      }

      // 测试5: 检查风险状态（应该触发风险警告）
      addTestResult('测试5: 检查风险状态（应该触发风险警告）');
      const risk2Response = await fetch('/api/risk');
      const risk2Data = await risk2Response.json();

      if (risk2Data.success) {
        addTestResult(`✓ 连续亏损次数: ${risk2Data.data.consecutiveLosses}`);
        addTestResult(`✓ 风险状态: ${risk2Data.data.isInRisk ? '风险中' : '正常'}`);

        if (risk2Data.data.consecutiveLosses === 2 && risk2Data.data.isInRisk) {
          addTestResult('✓ 风险警告已正确触发！');
          if (risk2Data.data.riskStartTime) {
            addTestResult(`✓ 风险开始时间: ${new Date(risk2Data.data.riskStartTime).toLocaleString()}`);
          }
        } else {
          addTestResult('✗ 风险警告未正确触发');
        }
      }

      // 测试6: 尝试添加第三笔记录（应该被拒绝）
      addTestResult('测试6: 尝试添加第三笔记录（应该被拒绝）');
      const loss3Response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          amount: 300,
          type: 'loss',
          description: '测试亏损3 - 应该被拒绝'
        })
      });
      const loss3Data = await loss3Response.json();

      if (!loss3Data.success && loss3Data.error?.code === 'RISK_WARNING') {
        addTestResult('✓ 第三笔记录正确被拒绝');
        addTestResult(`✓ 拒绝原因: ${loss3Data.error.message}`);
      } else {
        addTestResult('✗ 第三笔记录未被正确拒绝');
      }

      // 测试7: 重置风险状态
      addTestResult('测试7: 重置风险状态');
      const resetResponse = await fetch('/api/risk?action=reset', {
        method: 'POST'
      });
      const resetData = await resetResponse.json();

      if (resetData.success) {
        addTestResult('✓ 风险状态重置成功');
      } else {
        addTestResult('✗ 风险状态重置失败');
      }

      // 测试8: 验证重置后的状态
      addTestResult('测试8: 验证重置后的状态');
      const finalRiskResponse = await fetch('/api/risk');
      const finalRiskData = await finalRiskResponse.json();

      if (finalRiskData.success) {
        addTestResult(`✓ 最终状态: ${finalRiskData.data.isInRisk ? '风险中' : '正常'}`);
        addTestResult(`✓ 连续亏损次数: ${finalRiskData.data.consecutiveLosses}`);

        if (!finalRiskData.data.isInRisk && finalRiskData.data.consecutiveLosses === 0) {
          addTestResult('✓ 风险状态已正确重置为初始状态');
        } else {
          addTestResult('✗ 风险状态重置异常');
        }
      }

      addTestResult('🎉 风险管理系统测试完成！');

    } catch (error) {
      console.error('测试失败:', error);
      addTestResult('❌ 测试失败: ' + error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* FoxAI Logo */}
        <FoxAILogo />

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">风险管理系统测试</h1>
          <p className="text-gray-600">测试24小时风险提醒功能</p>
        </div>

        {/* 测试控制按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={testRiskManagement}
            disabled={isTesting}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isTesting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isTesting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                测试中...
              </span>
            ) : (
              '开始测试'
            )}
          </button>
        </div>

        {/* 测试结果 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">测试结果</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">点击"开始测试"按钮开始测试...</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="font-mono text-sm">
                    {result.startsWith('✓') && (
                      <span className="text-green-600 mr-1">✓</span>
                    )}
                    {result.startsWith('✗') && (
                      <span className="text-red-600 mr-1">✗</span>
                    )}
                    {result.startsWith('❌') && (
                      <span className="text-red-600 mr-1">❌</span>
                    )}
                    {result.startsWith('🎉') && (
                      <span className="text-yellow-500 mr-1">🎉</span>
                    )}
                    <span className={result.startsWith('✗') || result.startsWith('❌') ? 'text-red-600' : 'text-gray-800'}>
                      {result.replace(/^[✓✗❌🎉]\s*/, '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 测试说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">测试流程说明</h3>
          <ul className="text-blue-700 space-y-1">
            <li>1. 获取初始风险状态</li>
            <li>2. 添加第一笔亏损记录（应该正常添加）</li>
            <li>3. 验证风险状态（连续亏损次数应为1，未触发风险）</li>
            <li>4. 添加第二笔亏损记录（应该触发风险警告）</li>
            <li>5. 验证风险状态（连续亏损次数应为2，触发风险警告）</li>
            <li>6. 尝试添加第三笔记录（应该被拒绝）</li>
            <li>7. 重置风险状态</li>
            <li>8. 验证重置后的状态</li>
          </ul>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}