'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import violationsData from '@/data/violations.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export default function AounChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحباً، أنا عون، المساعد الذكي للخدمات الحكومية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleViolationPayment = (violationId: string) => {
    const violation = violationsData.find(v => v.id === violationId);
    if (violation) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ تم سداد المخالفة ${violationId} بمبلغ ${violation.amount} ريال بنجاح.\n\nشكراً لك على استخدام خدمات أبشر.`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleViolationAppeal = (violationId: string) => {
    const violation = violationsData.find(v => v.id === violationId);
    if (violation) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📋 تم تقديم اعتراض على المخالفة ${violationId}\n\n⏳ سيتم مراجعة اعتراضك خلال 7 أيام عمل.\n\n📞 سيتم التواصل معك عبر الرسائل النصية والبريد الإلكتروني.\n\nرقم الاعتراض: ${Math.floor(Math.random() * 900000) + 100000}`,
        timestamp: new Date(),
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call the real AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        data: data.data,
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى التأكد من إضافة GROQ_API_KEY في ملف .env.local',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      {/* No header - will be provided by parent */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7F7] rounded-t-lg">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-[#00663D] text-white'
                    : 'bg-white text-[#000000] border border-[#E4E4E7]'
                }`}
                dir="rtl"
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/80' : 'text-[#4A4A4A]'}`}>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Show violations if available */}
            {message.data && Array.isArray(message.data) && (
              <div className="mt-2 space-y-2">
                {message.data.map((violation: any) => (
                  <div key={violation.id} className="bg-white rounded-xl p-4 border-2 border-[#E4E4E7] hover:border-[#00663D] transition-all duration-300 hover:shadow-lg" dir="rtl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-[#000000] text-base">{violation.description}</p>
                        <p className="text-xs text-[#4A4A4A] mt-1">📍 {violation.location}</p>
                        <p className="text-xs text-[#4A4A4A]">📅 {violation.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-[#DC2626]">{violation.amount} ريال</p>
                        <p className="text-xs text-[#4A4A4A] mt-1">رقم: {violation.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViolationPayment(violation.id)}
                        className="flex-1 bg-gradient-to-r from-[#00663D] to-[#004A2C] hover:from-[#004A2C] hover:to-[#003420] text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                      >
                        💳 سداد المخالفة
                      </button>
                      <button
                        onClick={() => handleViolationAppeal(violation.id)}
                        className="flex-1 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                      >
                        📋 اعتراض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 border border-[#E4E4E7]">
              <Loader2 className="w-5 h-5 text-[#00663D] animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#E4E4E7] bg-white rounded-b-lg">
        <div className="flex gap-2" dir="rtl">
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 bg-[#00663D] hover:bg-[#004A2C] text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا... (مثال: أبغى أعرف مخالفاتي)"
            className="flex-1 px-4 py-3 bg-[#F7F7F7] border border-[#E4E4E7] rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#00663D] text-[#000000] placeholder:text-[#4A4A4A]"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

