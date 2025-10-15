'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, MessageSquare, AlertTriangle } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { getCurrentDate, isValidAmount } from '@/lib/utils';
import { useRisk } from './RiskProvider';

interface TransactionFormProps {
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loading?: boolean;
}

export default function TransactionForm({ onSubmit, loading }: TransactionFormProps) {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'profit' | 'loss'>('profit');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 安全地获取风险状态
  let riskStatus = null;
  let isRiskActive = false;
  let refreshRiskStatus = () => {};
  
  try {
    const riskContext = useRisk();
    riskStatus = riskContext.riskStatus;
    isRiskActive = riskContext.isRiskActive;
    refreshRiskStatus = riskContext.refreshRiskStatus;
  } catch (error) {
    // 如果没有RiskProvider，使用默认值
    console.warn('TransactionForm: RiskProvider not found, using default values');
  }

  useEffect(() => {
    // 自动填充当前日期
    setDate(getCurrentDate());
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = '请选择日期';
    }

    if (!amount || !isValidAmount(amount)) {
      newErrors.amount = '请输入有效金额';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 检查风险状态
    if (isRiskActive) {
      setErrors({ submit: '系统处于风险状态，暂时无法录入交易' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const formData = {
      date,
      amount: parseFloat(amount),
      type,
      description: description.trim(),
    };

    onSubmit(formData);

    // 重置表单
    setAmount('');
    setDescription('');
    setErrors({});
    
    // 刷新风险状态
    refreshRiskStatus();
  };

  const handleAmountChange = (value: string) => {
    // 只允许数字和小数点
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === '') {
      setAmount(value);
      if (errors.amount) {
        setErrors({ ...errors, amount: '' });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-6 md:mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">录入交易记录</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 日期选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              交易日期
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) {
                    setErrors({ ...errors, date: '' });
                  }
                }}
                className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-orange-400'
                }`}
                required
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.date}
              </p>
            )}
          </div>

          {/* 金额输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              交易金额
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-orange-400'
                }`}
                required
              />
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        {/* 交易类型选择 */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            交易类型
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              type === 'profit'
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
            }`}>
              <input
                type="radio"
                value="profit"
                checked={type === 'profit'}
                onChange={(e) => setType(e.target.value as 'profit' | 'loss')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <span className="text-green-600 font-semibold">盈利</span>
              </div>
              {type === 'profit' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </label>

            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              type === 'loss'
                ? 'border-red-500 bg-red-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-25'
            }`}>
              <input
                type="radio"
                value="loss"
                checked={type === 'loss'}
                onChange={(e) => setType(e.target.value as 'profit' | 'loss')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">📉</div>
                <span className="text-red-600 font-semibold">亏损</span>
              </div>
              {type === 'loss' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* 备注输入 */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            备注说明（可选）
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-center pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加备注说明..."
              rows={3}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none hover:border-orange-400"
            />
          </div>
        </div>

        {/* 风险状态提醒 */}
        {isRiskActive && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-red-800 font-medium">交易已暂停</h3>
                <p className="text-red-700 text-sm mt-1">
                  连续亏损触发风险保护，请明天再来录入交易
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 错误消息 */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading || isRiskActive}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            isRiskActive
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : type === 'profit'
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              提交中...
            </span>
          ) : isRiskActive ? (
            <span className="flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              交易已暂停
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              添加{type === 'profit' ? '盈利' : '亏损'}记录
            </span>
          )}
        </button>
      </form>
    </div>
  );
}