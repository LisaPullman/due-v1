'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

interface RiskFloatingAlertProps {
  isVisible: boolean;
  riskStartTime?: string;
  onClose?: () => void;
}

export default function RiskFloatingAlert({ 
  isVisible, 
  riskStartTime, 
  onClose 
}: RiskFloatingAlertProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isClosing, setIsClosing] = useState(false);

  // 计算剩余时间
  useEffect(() => {
    if (!riskStartTime || !isVisible) return;

    const updateTimer = () => {
      const startTime = new Date(riskStartTime);
      const now = new Date();
      
      // 计算到第二天0点的时间
      const tomorrow = new Date(startTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const remaining = tomorrow.getTime() - now.getTime();

      if (remaining <= 0) {
        setTimeRemaining('风险期已结束');
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}小时 ${minutes}分钟 ${seconds}秒`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [riskStartTime, isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      
      {/* 浮动警告窗口 */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-red-500 p-8 max-w-md w-full mx-4 relative overflow-hidden">
          {/* 动态背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-50" />
          
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* 警告图标 */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              {/* 脉冲动画环 */}
              <div className="absolute inset-0 w-20 h-20 border-4 border-red-300 rounded-full animate-ping opacity-75" />
            </div>
          </div>

          {/* 主要提醒文字 */}
          <div className="text-center mb-6 relative z-10">
            <h2 className="text-2xl font-bold text-red-600 mb-3 leading-tight">
              ⚠️ 风险提醒 ⚠️
            </h2>
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-4">
              <p className="text-xl font-bold text-red-800 leading-relaxed">
                你的思路错了，请调整思路
              </p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              连续亏损已触发风险保护机制<br />
              系统将暂停交易功能24小时
            </p>
          </div>

          {/* 倒计时显示 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">剩余冷静时间</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 font-mono">
                {timeRemaining}
              </div>
            </div>
          </div>

          {/* 建议文字 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative z-10">
            <h3 className="font-semibold text-blue-800 mb-2">💡 建议</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 冷静分析最近的交易决策</li>
              <li>• 回顾和调整交易策略</li>
              <li>• 学习风险管理知识</li>
              <li>• 24小时后重新开始交易</li>
            </ul>
          </div>

          {/* 底部动作按钮 */}
          <div className="mt-6 flex justify-center relative z-10">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
