'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AounChat from './AounChat';

interface AounChatButtonProps {
  className?: string;
}

export default function AounChatButton({
  className = '',
}: AounChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-24 w-16 h-16 bg-gradient-to-br from-[#00663D] to-[#004A2C] hover:from-[#004A2C] hover:to-[#003420] text-white rounded-full flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 z-40 border-2 border-white shadow-2xl hover:shadow-[#00663D]/50 animate-pulse hover:animate-none ${className}`}
        title="محادثة مع عون - المساعد الذكي"
      >
        <MessageCircle className="w-7 h-7 transition-transform duration-300 hover:scale-110" />
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#00663D] to-[#004A2C] text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">عون</h2>
                  <p className="text-sm text-white/90">المساعد الذكي للخدمات الحكومية</p>
                </div>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-hidden">
              <AounChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

