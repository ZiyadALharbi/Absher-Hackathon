'use client';

import { useState, useEffect } from 'react';
import { Sparkles, FileSearch, HelpCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AounChat from '@/components/AounChat';
import HealthCheckModal from '@/components/HealthCheckModal';
import LifeEventBundles from '@/components/LifeEventBundles';
import VoiceCallButton from '@/components/VoiceCallButton';
import DemoGuide from '@/components/DemoGuide';

export default function AounPage() {
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  // Show demo guide on first load
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenAounGuide');
    if (!hasSeenGuide) {
      setTimeout(() => setShowDemoGuide(true), 1000);
      localStorage.setItem('hasSeenAounGuide', 'true');
    }
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <Header />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#00D392] to-[#009E6F] text-white rounded-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => setShowDemoGuide(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">دليل الاستخدام</span>
            </button>
            <div className="flex items-center gap-4">
              <Sparkles className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold text-right">عون - المساعد الذكي</h1>
                <p className="text-lg text-white/90 text-right">مساعدك الشخصي للخدمات الحكومية</p>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-right">
            نستخدم الذكاء الاصطناعي لفهم احتياجاتك وتقديم أفضل الحلول الحكومية بسرعة وسهولة
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowHealthCheck(true)}
            className="bg-white rounded-lg p-6 border border-[#E4E4E7] hover:border-[#00D392] transition-all duration-200 text-right group"
          >
            <div className="flex items-center justify-between">
              <FileSearch className="w-10 h-10 text-[#00D392] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-1">تشخيص حالتي الحكومية</h3>
                <p className="text-sm text-[#4A4A4A]">افحص جميع وثائقك ومركباتك</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white rounded-lg p-6 border border-[#E4E4E7] hover:border-[#00D392] transition-all duration-200 text-right group"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-10 h-10 text-[#00D392] group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-1">تحدث مع عون</h3>
                <p className="text-sm text-[#4A4A4A]">اسأل أي سؤال عن الخدمات الحكومية</p>
              </div>
            </div>
          </button>
        </div>

        {/* Life Event Bundles */}
        <LifeEventBundles />

        {/* Chat Section */}
        <div id="chat-section">
          <AounChat />
        </div>
      </div>

      <Footer />

      {/* Health Check Modal */}
      <HealthCheckModal isOpen={showHealthCheck} onClose={() => setShowHealthCheck(false)} />

      {/* Demo Guide */}
      <DemoGuide isOpen={showDemoGuide} onClose={() => setShowDemoGuide(false)} />

      {/* Voice Call Button */}
      <VoiceCallButton />
    </div>
  );
}

