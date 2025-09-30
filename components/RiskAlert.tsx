'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { formatRemainingTime, getRemainingTime } from '@/lib/utils';

interface RiskStatus {
  isInRisk: boolean;
  consecutiveLosses: number;
  riskStartTime?: string;
  lastRiskDate?: string;
}

interface RiskAlertProps {
  riskStatus: RiskStatus;
  onReset?: () => void;
}

export default function RiskAlert({ riskStatus, onReset }: RiskAlertProps) {
  const [remainingTime, setRemainingTime] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (!riskStatus.isInRisk || !riskStatus.riskStartTime) return;

    const updateRemainingTime = () => {
      const timeData = getRemainingTime(riskStatus.riskStartTime!);

      if (timeData.totalMs <= 0) {
        setRemainingTime('');
        return;
      }

      setRemainingTime(formatRemainingTime(timeData.hours, timeData.minutes, timeData.seconds));
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [riskStatus]);

  if (!riskStatus.isInRisk || !showAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-red-500 transform animate-pulse">
        {/* 关闭按钮 */}
        <button
          onClick={() => setShowAlert(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-6">
          {/* 大号警告图标 */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6 md:p-8 shadow-lg">
              <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-red-600 animate-bounce" />
            </div>
          </div>

          {/* 巨幅中文警告文字 */}
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4 leading-tight tracking-wide">
            ⚠️ 风险警告
          </h2>

          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              连续亏损 {riskStatus.consecutiveLosses} 次！
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 md:p-6 rounded-lg">
              <p className="text-lg md:text-xl text-yellow-800 font-medium leading-relaxed">
                🛑 24小时内无法录入新的交易记录
              </p>
              <p className="text-sm md:text-base text-yellow-700 mt-2">
                建议您停止交易，休息调整，避免情绪化决策
              </p>
            </div>

            {remainingTime && (
              <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
                <span className="text-lg md:text-xl font-mono text-gray-700">
                  剩余时间: {remainingTime}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => setShowAlert(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              我知道了
            </button>

            {onReset && (
              <button
                onClick={() => {
                  setShowAlert(false);
                  onReset();
                }}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                手动重置
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            24小时后将自动解除限制
          </p>
        </div>
      </div>
    </div>
  );
}