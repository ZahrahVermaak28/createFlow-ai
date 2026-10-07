import React from 'react';
import { Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { RecentItem, GeneratorTab } from '../types';

interface RecentGenerationsProps {
  items: RecentItem[];
  onClearHistory: () => void;
  onSelectItem: (item: RecentItem) => void;
}

export const RecentGenerations: React.FC<RecentGenerationsProps> = ({
  items,
  onClearHistory,
  onSelectItem,
}) => {
  const getTabBadge = (type: GeneratorTab) => {
    switch (type) {
      case 'text':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B6FE8]/15 text-[#5B3FD6]">
            <span>📝</span> Text
          </span>
        );
      case 'image':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E76F8A]/15 text-[#E76F8A]">
            <span>🖼️</span> Image
          </span>
        );
      case 'code':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5B3FD6]/15 text-[#5B3FD6]">
            <span>💻</span> Code
          </span>
        );
    }
  };

  const formatTimestamp = (ts: number) => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#5B3FD6]" />
          <h3 className="text-xl font-bold text-[#1F1F2E]">Recent Generations</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
            {items.length}/5
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-50"
            title="Clear all saved history"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white/60 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
          <p className="text-sm text-slate-500 font-medium">
            No recent generations yet. Generate some text, images, or code to see them here!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-card-soft transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer hover:border-[#8B6FE8]/40"
            >
              <div className="flex items-start sm:items-center gap-3 overflow-hidden">
                <div className="shrink-0 pt-0.5 sm:pt-0">
                  {getTabBadge(item.type)}
                </div>
                <p className="text-sm font-medium text-[#1F1F2E] truncate group-hover:text-[#5B3FD6] transition-colors max-w-md">
                  &ldquo;{item.prompt}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs text-slate-400">
                <span className="font-medium">{formatTimestamp(item.timestamp)}</span>
                <span className="inline-flex items-center gap-1 text-[#5B3FD6] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
