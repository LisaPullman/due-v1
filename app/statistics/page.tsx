'use client';

import { useState, useEffect } from 'react';
import FoxAILogo from '@/components/FoxAILogo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface StatisticsData {
  period: string;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  transactionCount: number;
  profitTransactions: number;
  lossTransactions: number;
  averageProfit: number;
  averageLoss: number;
  profitRate: number;
}

const COLORS = ['#10B981', '#EF4444']; // Green for profit, Red for loss

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<StatisticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/statistics?period=${selectedPeriod}`);
      const data = await response.json();
      if (data.success) {
        setStatistics([data.data]);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentStats = statistics[0];

  // 准备图表数据
  const pieData = currentStats ? [
    { name: '盈利', value: currentStats.profitTransactions, color: COLORS[0] },
    { name: '亏损', value: currentStats.lossTransactions, color: COLORS[1] }
  ] : [];

  const barData = currentStats ? [
    { name: '总盈利', value: currentStats.totalProfit, color: COLORS[0] },
    { name: '总亏损', value: currentStats.totalLoss, color: COLORS[1] },
    { name: '净收益', value: currentStats.netProfit, color: currentStats.netProfit >= 0 ? COLORS[0] : COLORS[1] }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* FoxAI Logo */}
        <FoxAILogo />

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">统计分析</h1>
          <p className="text-gray-600">查看您的交易数据统计</p>
        </div>

        {/* 时间段选择 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {[{ value: 'daily', label: '日统计' }, { value: 'weekly', label: '周统计' }, { value: 'monthly', label: '月统计' }].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedPeriod === option.value
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : currentStats ? (
          <div className="space-y-8">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总盈利</p>
                    <p className="text-2xl font-bold text-green-600">¥{currentStats.totalProfit.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">↗</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总亏损</p>
                    <p className="text-2xl font-bold text-red-600">¥{currentStats.totalLoss.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl">↘</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">净收益</p>
                    <p className={`text-2xl font-bold ${currentStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ¥{currentStats.netProfit.toFixed(2)}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={currentStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {currentStats.netProfit >= 0 ? '📈' : '📉'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">交易次数</p>
                    <p className="text-2xl font-bold text-gray-800">{currentStats.transactionCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 盈亏对比柱状图 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">盈亏对比</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `¥${value}`} />
                    <Bar dataKey="value" fill="#FF6B35" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 交易类型分布饼图 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">交易分布</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 详细统计信息 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">详细统计</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">平均盈利</p>
                  <p className="text-xl font-bold text-green-600">¥{currentStats.averageProfit.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">平均亏损</p>
                  <p className="text-xl font-bold text-red-600">¥{currentStats.averageLoss.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">胜率</p>
                  <p className={`text-xl font-bold ${currentStats.profitRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentStats.profitRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">暂无统计数据</div>
            <p className="text-gray-400 mt-2">请先添加一些交易记录</p>
          </div>
        )}

        {/* 返回首页按钮 */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}