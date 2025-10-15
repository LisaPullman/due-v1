import type { Transaction, RiskStatus, Settings, ApiResponse } from './types';

// Vercel KV 集成 - 支持真实 KV 和 Mock 模式
let kv: any;

// 尝试导入真实的 Vercel KV
try {
  // @ts-ignore - 动态导入 Vercel KV
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
  console.log('✅ 使用真实的 Vercel KV 服务');
} catch (error) {
  console.log('⚠️  使用 Mock KV 服务（开发环境）');

  // Mock KV 实现
  class MockKV {
    private storage: Record<string, any> = {};

    async get(key: string): Promise<any> {
      return this.storage[key] || null;
    }

    async set(key: string, value: any): Promise<void> {
      this.storage[key] = value;
    }

    async del(key: string): Promise<void> {
      delete this.storage[key];
    }
  }

  kv = new MockKV();
}

export class KVService {
  // 交易记录操作
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await kv.get('transactions');
      return transactions || [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  static async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    try {
      const transactions = await this.getTransactions();
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      transactions.push(newTransaction);
      await kv.set('transactions', transactions);

      // 检查风险状态
      await this.checkRiskStatus(newTransaction);

      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const transactions = await this.getTransactions();
      const index = transactions.findIndex(t => t.id === id);

      if (index === -1) return null;

      transactions[index] = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await kv.set('transactions', transactions);
      return transactions[index];
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      await kv.set('transactions', filteredTransactions);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // 风险状态操作
  static async getRiskStatus(): Promise<RiskStatus> {
    try {
      const riskStatus = await kv.get('riskStatus');
      return riskStatus || {
        isInRisk: false,
        consecutiveLosses: 0,
      };
    } catch (error) {
      console.error('Error getting risk status:', error);
      return {
        isInRisk: false,
        consecutiveLosses: 0,
      };
    }
  }

  static async updateRiskStatus(status: RiskStatus): Promise<void> {
    try {
      await kv.set('riskStatus', status);
    } catch (error) {
      console.error('Error updating risk status:', error);
      throw error;
    }
  }

  // 设置操作
  static async getSettings(): Promise<Settings> {
    try {
      const settings = await kv.get('settings');
      return settings || {
        currency: '¥',
        riskAlertEnabled: true,
        theme: 'light',
        autoBackup: true,
        dataRetentionDays: 365,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        currency: '¥',
        riskAlertEnabled: true,
        theme: 'light',
        autoBackup: true,
        dataRetentionDays: 365,
      };
    }
  }

  static async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    try {
      const currentSettings = await this.getSettings();
      const newSettings = { ...currentSettings, ...updates };
      await kv.set('settings', newSettings);
      return newSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // 风险检查逻辑
  private static async checkRiskStatus(newTransaction: Transaction): Promise<void> {
    try {
      if (newTransaction.type === 'profit') {
        // 盈利交易，重置风险状态
        await this.updateRiskStatus({
          isInRisk: false,
          consecutiveLosses: 0,
        });
        return;
      }

      // 亏损交易，检查风险状态
      const currentRiskStatus = await this.getRiskStatus();
      const newConsecutiveLosses = currentRiskStatus.consecutiveLosses + 1;

      if (newConsecutiveLosses >= 2) {
        // 触发风险警告
        await this.updateRiskStatus({
          isInRisk: true,
          consecutiveLosses: newConsecutiveLosses,
          riskStartTime: new Date().toISOString(),
          lastRiskDate: new Date().toISOString(),
        });
      } else {
        // 更新连续亏损次数
        await this.updateRiskStatus({
          ...currentRiskStatus,
          consecutiveLosses: newConsecutiveLosses,
        });
      }
    } catch (error) {
      console.error('Error checking risk status:', error);
    }
  }

  // 检查是否需要重置风险状态（第二天自动重置）
  static async checkAndResetRiskStatus(): Promise<RiskStatus> {
    try {
      const riskStatus = await this.getRiskStatus();

      if (riskStatus.isInRisk && riskStatus.riskStartTime) {
        const riskStartTime = new Date(riskStatus.riskStartTime);
        const now = new Date();
        
        // 获取风险开始日期（只考虑日期，不考虑时间）
        const riskDate = new Date(riskStartTime.getFullYear(), riskStartTime.getMonth(), riskStartTime.getDate());
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // 计算日期差异
        const daysDiff = Math.floor((currentDate.getTime() - riskDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff >= 1) {
          // 第二天自动重置
          const newStatus = {
            isInRisk: false,
            consecutiveLosses: 0,
            lastRiskDate: riskStatus.lastRiskDate,
          };
          await this.updateRiskStatus(newStatus);
          return newStatus;
        }
      }

      return riskStatus;
    } catch (error) {
      console.error('Error checking and resetting risk status:', error);
      return await this.getRiskStatus();
    }
  }

  // 手动重置风险状态
  static async resetRiskStatus(): Promise<void> {
    try {
      await this.updateRiskStatus({
        isInRisk: false,
        consecutiveLosses: 0,
      });
    } catch (error) {
      console.error('Error resetting risk status:', error);
      throw error;
    }
  }

  // 获取统计数据
  static async getStatistics(period: 'daily' | 'weekly' | 'monthly', date?: string): Promise<any> {
    try {
      const transactions = await this.getTransactions();
      const today = date ? new Date(date) : new Date();

      let filteredTransactions = transactions;

      if (period === 'daily') {
        const targetDate = today.toISOString().split('T')[0];
        filteredTransactions = transactions.filter(t => t.date === targetDate);
      } else if (period === 'weekly') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        filteredTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });
      } else if (period === 'monthly') {
        const targetMonth = today.getMonth();
        const targetYear = today.getFullYear();

        filteredTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === targetMonth && transactionDate.getFullYear() === targetYear;
        });
      }

      const totalProfit = filteredTransactions
        .filter(t => t.type === 'profit')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalLoss = filteredTransactions
        .filter(t => t.type === 'loss')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const profitTransactions = filteredTransactions.filter(t => t.type === 'profit').length;
      const lossTransactions = filteredTransactions.filter(t => t.type === 'loss').length;

      return {
        period,
        totalProfit,
        totalLoss,
        netProfit: totalProfit - totalLoss,
        transactionCount: filteredTransactions.length,
        profitTransactions,
        lossTransactions,
        averageProfit: profitTransactions > 0 ? totalProfit / profitTransactions : 0,
        averageLoss: lossTransactions > 0 ? totalLoss / lossTransactions : 0,
        profitRate: filteredTransactions.length > 0 ? (profitTransactions / filteredTransactions.length) * 100 : 0,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  // 数据重置功能 - 一键归零所有数据
  static async resetAllData(): Promise<void> {
    try {
      // 清空所有交易记录
      await kv.set('transactions', []);
      
      // 重置风险状态
      await kv.set('riskStatus', {
        isInRisk: false,
        consecutiveLosses: 0,
      });
      
      // 重置设置为默认值
      await kv.set('settings', {
        currency: '¥',
        riskAlertEnabled: true,
        theme: 'light',
        autoBackup: true,
        dataRetentionDays: 365,
      });
      
      // 记录重置时间
      await this.recordResetTime();
      
      console.log('✅ 所有数据已重置为初始状态');
    } catch (error) {
      console.error('Error resetting all data:', error);
      throw error;
    }
  }

  // 获取系统数据概览
  static async getSystemOverview(): Promise<{
    transactionCount: number;
    riskStatus: RiskStatus;
    settings: Settings;
    lastResetTime?: string;
  }> {
    try {
      const transactions = await this.getTransactions();
      const riskStatus = await this.getRiskStatus();
      const settings = await this.getSettings();
      const lastResetTime = await kv.get('lastResetTime');

      return {
        transactionCount: transactions.length,
        riskStatus,
        settings,
        lastResetTime: lastResetTime || undefined,
      };
    } catch (error) {
      console.error('Error getting system overview:', error);
      throw error;
    }
  }

  // 记录重置时间
  static async recordResetTime(): Promise<void> {
    try {
      await kv.set('lastResetTime', new Date().toISOString());
    } catch (error) {
      console.error('Error recording reset time:', error);
    }
  }
}