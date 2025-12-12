'use client';

import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import VoiceCallPanel from './VoiceCallPanel';

interface VoiceCallButtonProps {
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

export default function VoiceCallButton({
  onSendMessage,
  className = '',
}: VoiceCallButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating voice call button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-[#00663D] to-[#004A2C] hover:from-[#004A2C] hover:to-[#003420] text-white rounded-full flex items-center justify-center transition-all duration-500 hover:scale-125 hover:rotate-12 z-40 border-2 border-white shadow-2xl hover:shadow-[#00663D]/50 animate-pulse hover:animate-none ${className}`}
        title="مكالمة صوتية مع عون"
      >
        <Phone className="w-7 h-7 transition-transform duration-300 hover:scale-110" />
      </button>

      {/* Voice call panel modal */}
      {isOpen && (
        <VoiceCallPanel
          onClose={() => setIsOpen(false)}
          onSendMessage={onSendMessage}
        />
      )}
    </>
  );
}

