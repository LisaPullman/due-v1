'use client';

import { useState } from 'react';
import { ArrowLeft, Database, AlertTriangle } from 'lucide-react';
import FoxAILogo from '@/components/FoxAILogo';
import DataResetPanel from '@/components/DataResetPanel';

export default function ResetPage() {
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleResetComplete = () => {
    setResetCompleted(true);
    // 3秒后自动跳转回首页
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回首页
              </a>
            </div>
            <FoxAILogo />
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Database className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">数据管理中心</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            管理您的FoxAI记账软件数据，包括查看系统状态和执行数据重置操作。
            请谨慎使用数据重置功能，该操作将永久删除所有数据。
          </p>
        </div>

        {/* 重置完成提示 */}
        {resetCompleted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-400 mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-green-800 font-medium">数据重置成功！</h3>
                <p className="text-green-700 text-sm mt-1">
                  所有数据已归零，系统将在3秒后自动跳转到首页...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 警告提示 */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-yellow-800 font-medium mb-1">重要提醒</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 数据重置操作是<strong>不可逆</strong>的，请确保您真的需要清空所有数据</li>
                <li>• 建议在重置前导出重要数据（如有需要）</li>
                <li>• 重置后系统将恢复到初始状态，所有设置将回到默认值</li>
                <li>• 如果您只是想测试功能，建议使用测试页面而不是重置数据</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 数据重置面板 */}
        <DataResetPanel onResetComplete={handleResetComplete} />

        {/* 其他操作 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/statistics"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">📊</span>
              <h3 className="font-semibold text-gray-800">查看统计</h3>
            </div>
            <p className="text-gray-600 text-sm">
              查看详细的数据分析和统计报告
            </p>
          </a>

          <a
            href="/test"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🧪</span>
              <h3 className="font-semibold text-gray-800">功能测试</h3>
            </div>
            <p className="text-gray-600 text-sm">
              测试系统功能而不影响真实数据
            </p>
          </a>

          <a
            href="/"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🏠</span>
              <h3 className="font-semibold text-gray-800">返回首页</h3>
            </div>
            <p className="text-gray-600 text-sm">
              回到主界面继续记账操作
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
