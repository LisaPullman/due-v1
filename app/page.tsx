'use client';

import { useState, useEffect } from 'react';
import FoxAILogo from '@/components/FoxAILogo';
import TransactionForm from '@/components/TransactionForm';
import RiskAlert from '@/components/RiskAlert';
import MobileNav from '@/components/MobileNav';
import ToastContainer, { toast } from '@/components/Toast';
import { RiskStatus } from '@/lib/types';

export default function Home() {
  const [riskStatus, setRiskStatus] = useState<RiskStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [todayStats, setTodayStats] = useState({ profit: 0, loss: 0, net: 0 });

  useEffect(() => {
    fetchRiskStatus();
    fetchTodayStatistics();
  }, []);

  const fetchRiskStatus = async () => {
    try {
      const response = await fetch('/api/risk');
      const data = await response.json();
      if (data.success) {
        setRiskStatus(data.data);
      } else {
        toast.error('获取风险状态失败', data.error?.message);
      }
    } catch (error) {
      console.error('Error fetching risk status:', error);
      toast.error('网络错误', '无法连接到服务器');
    }
  };

  const fetchTodayStatistics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/statistics?period=daily&date=${today}`);
      const data = await response.json();
      if (data.success) {
        setTodayStats({
          profit: data.data.totalProfit,
          loss: data.data.totalLoss,
          net: data.data.netProfit
        });
      }
    } catch (error) {
      console.error('Error fetching today statistics:', error);
    }
  };

  const handleTransactionSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('成功', data.message);
        // 重新获取风险状态和统计数据
        await fetchRiskStatus();
        await fetchTodayStatistics();
      } else {
        if (data.error?.code === 'RISK_WARNING') {
          toast.warning('风险警告', data.error.message);
        } else {
          toast.error('添加记录失败', data.error?.message);
        }
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('提交失败', '请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRisk = async () => {
    try {
      const response = await fetch('/api/risk?action=reset', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        await fetchRiskStatus();
        toast.success('成功', '风险状态已重置');
      } else {
        toast.error('重置失败', data.error?.message);
      }
    } catch (error) {
      console.error('Error resetting risk status:', error);
      toast.error('重置失败', '网络连接错误');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <ToastContainer />
      <MobileNav />

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* FoxAI Logo */}
        <FoxAILogo />

        {/* 风险警告 */}
        {riskStatus?.isInRisk && showAlert && (
          <RiskAlert
            riskStatus={riskStatus}
            onReset={handleResetRisk}
          />
        )}

        {/* 主要内容 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* 交易录入表单 - 左侧 */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <TransactionForm
                onSubmit={handleTransactionSubmit}
                loading={loading}
              />
            </div>
          </div>

          {/* 中间内容区域 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 今日统计卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                今日统计
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">今日盈利</p>
                      <p className="text-2xl font-bold text-green-600">¥{todayStats.profit.toFixed(2)}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">↗</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">今日亏损</p>
                      <p className="text-2xl font-bold text-red-600">¥{todayStats.loss.toFixed(2)}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">↘</span>
                    </div>
                  </div>
                </div>

                <div className={`bg-gradient-to-r rounded-lg p-4 border ${
                  todayStats.net >= 0
                    ? 'from-green-50 to-green-100 border-green-200'
                    : 'from-red-50 to-red-100 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        todayStats.net >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        今日净收益
                      </p>
                      <p className={`text-2xl font-bold ${
                        todayStats.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ¥{todayStats.net.toFixed(2)}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      todayStats.net >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <span className="text-white text-lg">
                        {todayStats.net >= 0 ? '📈' : '📉'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 风险状态卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                风险状态
              </h2>
              <div className={`p-6 rounded-xl border-2 ${
                riskStatus?.isInRisk
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-4 ${
                      riskStatus?.isInRisk ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`} />
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        riskStatus?.isInRisk ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {riskStatus?.isInRisk ? '风险警告中' : '正常状态'}
                      </h3>
                      {riskStatus?.consecutiveLosses > 0 && (
                        <p className={`text-sm mt-1 ${
                          riskStatus?.isInRisk ? 'text-red-600' : 'text-green-600'
                        }`}>
                          连续亏损: {riskStatus.consecutiveLosses} 次
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {riskStatus?.isInRisk ? (
                      <button
                        onClick={() => setShowAlert(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        查看警告
                      </button>
                    ) : (
                      <div className="text-green-600">
                        <span className="text-2xl">✅</span>
                        <p className="text-sm font-medium">交易正常</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 快速操作区域 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                快速操作
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/statistics'}
                  className="group flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold">详细统计</h3>
                    <p className="text-sm opacity-90">查看完整数据分析</p>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = '/history'}
                  className="group flex items-center justify-center p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📜</div>
                    <h3 className="font-semibold">历史记录</h3>
                    <p className="text-sm opacity-90">查看所有交易</p>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = '/test'}
                  className="group flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🧪</div>
                    <h3 className="font-semibold">测试功能</h3>
                    <p className="text-sm opacity-90">测试系统功能</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}