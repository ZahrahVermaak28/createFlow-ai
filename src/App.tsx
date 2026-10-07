/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GeneratorTab, RecentItem, ToastMessage, TextTone, TextLength, ImageStyle, CodeLanguage } from './types';
import { Header } from './components/Header';
import { TabNav } from './components/TabNav';
import { TextGenerator } from './components/TextGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { CodeGenerator } from './components/CodeGenerator';
import { RecentGenerations } from './components/RecentGenerations';
import { ToastContainer } from './components/Toast';

const LOCAL_STORAGE_KEY = 'createflow_recent_generations';

export default function App() {
  const [activeTab, setActiveTab] = useState<GeneratorTab>('text');
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load latest 5 history items from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentItems(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.error('Failed to load recent history from localStorage:', e);
    }
  }, []);

  // Toast system
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save new generation to localStorage (max 5 items)
  const handleGenerationSuccess = (
    type: GeneratorTab,
    prompt: string,
    result: string,
    metadata?: {
      tone?: TextTone;
      length?: TextLength;
      style?: ImageStyle;
      language?: CodeLanguage;
    }
  ) => {
    const newItem: RecentItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      prompt,
      result,
      timestamp: Date.now(),
      metadata,
    };

    setRecentItems((prev) => {
      // Filter out duplicate identical prompts of the same type if present, keep newest
      const filtered = prev.filter((item) => !(item.type === type && item.prompt === prompt));
      const updated = [newItem, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return updated;
    });
  };

  // Clear history
  const handleClearHistory = () => {
    setRecentItems([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('Generation history cleared.', 'info');
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  // Selecting a recent item switches tab
  const handleSelectRecentItem = (item: RecentItem) => {
    setActiveTab(item.type);
    showToast(`Switched to ${item.type} generator for: "${item.prompt.slice(0, 30)}..."`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1F2E] flex flex-col justify-between selection:bg-[#8B6FE8]/25 selection:text-[#5B3FD6] relative overflow-x-hidden">
      {/* Subtle blurred purple/pink gradient shapes in background for soft fading effect */}
      <div className="fixed top-28 -left-32 w-80 h-80 rounded-full bg-[#8B6FE8]/8 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-96 -right-32 w-96 h-96 rounded-full bg-[#E76F8A]/8 blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-32 left-1/3 w-80 h-80 rounded-full bg-[#F5A889]/8 blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div>
        <Header />

        {/* 3 Large Tab Buttons */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Only one generator displays at a time */}
        <main className="px-4 pb-12">
          {activeTab === 'text' && (
            <TextGenerator
              onSuccess={(prompt, result, metadata) =>
                handleGenerationSuccess('text', prompt, result, metadata)
              }
              showToast={showToast}
            />
          )}

          {activeTab === 'image' && (
            <ImageGenerator
              onSuccess={(prompt, result, metadata) =>
                handleGenerationSuccess('image', prompt, result, metadata)
              }
              showToast={showToast}
            />
          )}

          {activeTab === 'code' && (
            <CodeGenerator
              onSuccess={(prompt, result, metadata) =>
                handleGenerationSuccess('code', prompt, result, metadata)
              }
              showToast={showToast}
            />
          )}

          {/* Recent Generations (Bottom of page, localStorage 5 items) */}
          <RecentGenerations
            items={recentItems}
            onClearHistory={handleClearHistory}
            onSelectItem={handleSelectRecentItem}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-12 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-500">
            CreateFlow AI
          </p>
          <p>
            Text &bull; Images &bull; Code &bull; Powered by AI
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
