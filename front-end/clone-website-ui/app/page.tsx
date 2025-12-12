'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import Footer from "@/components/footer"
import LanguageDetectionModal from "@/components/LanguageDetectionModal"

const VoiceCallButton = dynamic(() => import('@/components/VoiceCallButton'), { ssr: false });
const AounChatButton = dynamic(() => import('@/components/AounChatButton'), { ssr: false });
const LifeEventBundles = dynamic(() => import('@/components/LifeEventBundles'), { ssr: false });
const HealthCheckModal = dynamic(() => import('@/components/HealthCheckModal'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [userNationality, setUserNationality] = useState<string | null>(null);
  const [showHealthCheck, setShowHealthCheck] = useState(false);

  useEffect(() => {
    // 🎯 CASE 1: Proactive Language Detection Demo
    // Check if user is logged in and if language modal should be shown
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('demo_logged_in');
      const userDataStr = localStorage.getItem('demo_user');
      
      if (!loggedIn || !userDataStr) {
        // Not logged in -> redirect to login
        router.push('/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      
      // Check if this is first login AND non-Arabic nationality
      if (
        userData.isFirstLogin &&
        userData.nationality !== 'Saudi Arabia' &&
        !userData.preferredLanguage
      ) {
        setUserNationality(userData.nationality);
        // Show language modal after a brief delay for better UX
        setTimeout(() => setShowLanguageModal(true), 1000);
      }
    }
  }, [router]);

  const handleLanguageSelect = (languageCode: string) => {
    console.log('🌍 [Language Selected]:', languageCode);
    
    // Save preference
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('demo_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.preferredLanguage = languageCode;
        userData.isFirstLogin = false; // Don't show again
        localStorage.setItem('demo_user', JSON.stringify(userData));
      }
    }
    
    // Close modal
    setShowLanguageModal(false);
    
    // In a real app, this would trigger i18n change
    // For demo, just log it
    console.log('✅ Language saved! In production, UI would switch to:', languageCode);
  };

  const handleSkipLanguage = () => {
    console.log('⏭️ [Language Modal] Skipped');
    
    // Mark as not first login
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('demo_user');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.isFirstLogin = false;
        localStorage.setItem('demo_user', JSON.stringify(userData));
      }
    }
    
    setShowLanguageModal(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-row gap-6 px-6 py-6 max-w-[1800px] mx-auto">
        <RightSidebar />
        <div className="flex-1 space-y-6">
          <SearchBar />
          <MainContent />
          
          {/* Health Check Button */}
          <div className="bg-gradient-to-r from-[#00663D] to-[#008850] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">فحص وضعك الحكومي الكامل</h3>
                <p className="text-white/90 text-base mb-4">
                  فحص شامل لجميع خدماتك الحكومية وتنبيهات قبل أن تصبح غرامة
                </p>
                <button
                  onClick={() => setShowHealthCheck(true)}
                  className="bg-white text-[#00663D] px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  ابدأ الفحص الآن
                </button>
              </div>
              <div className="ml-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Life Events Section */}
          <div className="bg-white rounded-lg border border-[#E4E4E7] p-6 shadow-md">
            <LifeEventBundles />
          </div>
        </div>
      </div>
      <Footer />
      
      <VoiceCallButton />
      <AounChatButton />

      {/* 🎯 CASE 1: Proactive Language Detection Modal */}
      {showLanguageModal && userNationality && (
        <LanguageDetectionModal
          userNationality={userNationality}
          onLanguageSelect={handleLanguageSelect}
          onSkip={handleSkipLanguage}
        />
      )}

      {/* Health Check Modal */}
      {showHealthCheck && (
        <HealthCheckModal
          isOpen={showHealthCheck}
          onClose={() => setShowHealthCheck(false)}
        />
      )}
    </div>
  )
}
