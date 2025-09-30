'use client';

import { useState } from 'react';
import { Menu, X, Home, BarChart3, Settings, TestTube } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: '首页' },
    { href: '/statistics', icon: BarChart3, label: '统计' },
    { href: '/test', icon: TestTube, label: '测试' },
    { href: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="md:hidden">
      {/* 汉堡菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg border border-gray-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 导航菜单 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-2xl p-4 min-w-[200px] border border-gray-200">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    <span className="text-gray-800 font-medium group-hover:text-orange-600">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}