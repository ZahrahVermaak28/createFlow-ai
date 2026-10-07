import React from 'react';
import { GeneratorTab } from '../types';

interface TabNavProps {
  activeTab: GeneratorTab;
  onTabChange: (tab: GeneratorTab) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: GeneratorTab; label: string; icon: string }[] = [
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'code', label: 'Code', icon: '💻' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 -mt-7 relative z-20 mb-8">
      {/* Large white rounded container */}
      <div className="bg-white p-2 rounded-2xl sm:rounded-3xl border border-[#8B6FE8]/25 shadow-xl shadow-[#5B3FD6]/10 grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 sm:px-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'gradient-brand text-white shadow-md shadow-[#5B3FD6]/25 scale-[1.01]'
                  : 'bg-white text-[#1F1F2E] hover:bg-[#F8F7FC] hover:text-[#5B3FD6]'
              }`}
            >
              <span className="text-lg sm:text-xl shrink-0">{tab.icon}</span>
              <span className="tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

