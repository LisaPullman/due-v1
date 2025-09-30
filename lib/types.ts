// 交易记录接口
export interface Transaction {
  id: string;                    // 唯一标识符
  date: string;                  // 交易日期 (YYYY-MM-DD)
  amount: number;                // 金额 (正数为盈利，负数为亏损)
  type: 'profit' | 'loss';       // 交易类型
  description?: string;          // 备注说明
  createdAt: string;            // 创建时间戳
  updatedAt: string;            // 更新时间戳
}

// 用户设置接口
export interface Settings {
  currency: string;              // 货币单位 (默认: '¥')
  riskAlertEnabled: boolean;     // 风险提醒开关
  theme: 'light' | 'dark';       // 主题模式
  autoBackup: boolean;           // 自动备份开关
  dataRetentionDays: number;     // 数据保留天数
}

// 风险状态接口
export interface RiskStatus {
  isInRisk: boolean;             // 是否处于风险状态
  riskStartTime?: string;        // 风险开始时间
  consecutiveLosses: number;     // 连续亏损次数
  lastRiskDate?: string;         // 上次风险日期
}

// 统计响应接口
export interface StatisticsResponse {
  period: string;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  transactionCount: number;
  profitTransactions: number;
  lossTransactions: number;
  averageProfit: number;
  averageLoss: number;
  profitRate: number; // 盈利率
}

// API标准响应接口
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// 日期范围接口
export interface DateRange {
  startDate: string;
  endDate: string;
}

// 时间范围接口
export interface TimeRange {
  label: string;
  value: string;
}

// 图表数据接口
export interface ChartData {
  date: string;
  profit: number;
  loss: number;
  net: number;
}

// 交易表单数据接口
export interface TransactionFormData {
  date: string;
  amount: number;
  type: 'profit' | 'loss';
  description?: string;
}