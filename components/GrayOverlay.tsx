'use client';

import React from 'react';

interface GrayOverlayProps {
  isActive: boolean;
  children: React.ReactNode;
}

export default function GrayOverlay({ isActive, children }: GrayOverlayProps) {
  return (
    <div className={`transition-all duration-500 ${
      isActive 
        ? 'grayscale brightness-75 contrast-75' 
        : 'grayscale-0 brightness-100 contrast-100'
    }`}>
      {children}
    </div>
  );
}
