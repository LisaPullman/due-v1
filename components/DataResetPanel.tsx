'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, RefreshCw, Database, Clock, Settings } from 'lucide-react';

interface SystemOverview {
  transactionCount: number;
  riskStatus: {
    isInRisk: boolean;
    consecutiveLosses: number;
    riskStartTime?: string;
    lastRiskDate?: string;
  };
  settings: {
    currency: string;
    riskAlertEnabled: boolean;
    theme: string;
    autoBackup: boolean;
    dataRetentionDays: number;
  };
  lastResetTime?: string;
}

interface DataResetPanelProps {
  onResetComplete?: () => void;
}

export default function DataResetPanel({ onResetComplete }: DataResetPanelProps) {
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 获取系统概览
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reset');
      const result = await response.json();
      
      if (result.success) {
        setOverview(result.data);
      } else {
        setMessage({ type: 'error', text: result.error?.message || '获取系统信息失败' });
      }
    } catch (error) {
      console.error('Error fetching overview:', error);
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  // 执行数据重置
  const handleReset = async () => {
    if (confirmCode !== 'RESET_ALL_DATA') {
      setMessage({ type: 'error', text: '确认码错误，请输入 RESET_ALL_DATA' });
      return;
    }

    try {
      setIsResetting(true);
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset',
          confirmCode: confirmCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '数据重置成功！所有数据已归零' });
        setShowConfirmDialog(false);
        setConfirmCode('');
        await fetchOverview(); // 刷新概览
        onResetComplete?.();
      } else {
        setMessage({ type: 'error', text: result.error?.message || '重置失败' });
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setIsResetting(false);
    }
  };

  // 格式化时间
  const formatTime = (timeString?: string) => {
    if (!timeString) return '从未重置';
    return new Date(timeString).toLocaleString('zh-CN');
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // 清除消息
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mr-2" />
          <span className="text-gray-600">加载系统信息中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 标题 */}
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-orange-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">数据管理中心</h2>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* 系统概览 */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium text-gray-700">数据统计</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {overview.transactionCount} 条交易记录
            </div>
            <div className="text-sm text-gray-600 mt-1">
              风险状态: {overview.riskStatus.isInRisk ? '⚠️ 风险中' : '✅ 正常'}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium text-gray-700">重置记录</span>
            </div>
            <div className="text-sm text-gray-900">
              上次重置: {formatTime(overview.lastResetTime)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              系统设置: {overview.settings.currency} | {overview.settings.theme}
            </div>
          </div>
        </div>
      )}

      {/* 危险操作区域 */}
      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
        <div className="flex items-center mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="font-bold text-red-700">危险操作区域</span>
        </div>
        
        <div className="mb-4">
          <p className="text-red-700 text-sm mb-2">
            <strong>⚠️ 警告：</strong>此操作将永久删除所有数据，包括：
          </p>
          <ul className="text-red-600 text-sm ml-4 space-y-1">
            <li>• 所有交易记录</li>
            <li>• 风险状态和历史</li>
            <li>• 个人设置偏好</li>
            <li>• 统计数据缓存</li>
          </ul>
        </div>

        <button
          onClick={() => setShowConfirmDialog(true)}
          disabled={isResetting}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isResetting ? '重置中...' : '一键归零所有数据'}
        </button>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">确认数据重置</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                您即将删除所有数据，此操作<strong>无法撤销</strong>！
              </p>
              <p className="text-sm text-gray-600 mb-3">
                请输入确认码 <code className="bg-gray-100 px-2 py-1 rounded">RESET_ALL_DATA</code> 来确认操作：
              </p>
              <input
                type="text"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="输入确认码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmCode('');
                  setMessage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting || confirmCode !== 'RESET_ALL_DATA'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? '重置中...' : '确认重置'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刷新按钮 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </button>
      </div>
    </div>
  );
}
