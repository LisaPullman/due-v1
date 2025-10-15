'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RiskStatus } from '@/lib/types';
import GrayOverlay from './GrayOverlay';
import RiskFloatingAlert from './RiskFloatingAlert';

interface RiskContextType {
  riskStatus: RiskStatus | null;
  isRiskActive: boolean;
  refreshRiskStatus: () => Promise<void>;
  showFloatingAlert: boolean;
  setShowFloatingAlert: (show: boolean) => void;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export function useRisk() {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
}

interface RiskProviderProps {
  children: React.ReactNode;
}

export default function RiskProvider({ children }: RiskProviderProps) {
  const [riskStatus, setRiskStatus] = useState<RiskStatus | null>(null);
  const [showFloatingAlert, setShowFloatingAlert] = useState(false);
  const [isRiskActive, setIsRiskActive] = useState(false);

  // 获取风险状态
  const fetchRiskStatus = async () => {
    try {
      const response = await fetch('/api/risk');
      const data = await response.json();
      if (data.success) {
        const newRiskStatus = data.data;
        setRiskStatus(newRiskStatus);
        
        // 检查是否需要显示浮动提醒
        if (newRiskStatus.isInRisk && !isRiskActive) {
          setShowFloatingAlert(true);
          setIsRiskActive(true);
        } else if (!newRiskStatus.isInRisk && isRiskActive) {
          setShowFloatingAlert(false);
          setIsRiskActive(false);
        }
      }
    } catch (error) {
      console.error('Error fetching risk status:', error);
    }
  };

  // 刷新风险状态
  const refreshRiskStatus = async () => {
    await fetchRiskStatus();
  };

  // 定期检查风险状态
  useEffect(() => {
    fetchRiskStatus();
    
    // 每30秒检查一次风险状态
    const interval = setInterval(fetchRiskStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // 监听风险状态变化
  useEffect(() => {
    if (riskStatus?.isInRisk && !isRiskActive) {
      setIsRiskActive(true);
      setShowFloatingAlert(true);
    } else if (!riskStatus?.isInRisk && isRiskActive) {
      setIsRiskActive(false);
      setShowFloatingAlert(false);
    }
  }, [riskStatus?.isInRisk]);

  const contextValue: RiskContextType = {
    riskStatus,
    isRiskActive,
    refreshRiskStatus,
    showFloatingAlert,
    setShowFloatingAlert,
  };

  return (
    <RiskContext.Provider value={contextValue}>
      <GrayOverlay isActive={isRiskActive}>
        {children}
      </GrayOverlay>
      
      {/* 浮动风险提醒 */}
      <RiskFloatingAlert
        isVisible={showFloatingAlert}
        riskStartTime={riskStatus?.riskStartTime}
        onClose={() => setShowFloatingAlert(false)}
      />
    </RiskContext.Provider>
  );
}
