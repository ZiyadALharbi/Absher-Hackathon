'use client';

import dynamic from 'next/dynamic';
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import Footer from "@/components/footer"

const VoiceCallButton = dynamic(() => import('@/components/VoiceCallButton'), { ssr: false });
const AounChatButton = dynamic(() => import('@/components/AounChatButton'), { ssr: false });
const LifeEventBundles = dynamic(() => import('@/components/LifeEventBundles'), { ssr: false });

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-row gap-6 px-6 py-6 max-w-[1800px] mx-auto">
        <RightSidebar />
        <div className="flex-1 space-y-6">
          <SearchBar />
          <MainContent />
          
          {/* Life Events Section */}
          <div className="bg-white rounded-lg border border-[#E4E4E7] p-6 shadow-md">
            <LifeEventBundles />
          </div>
        </div>
      </div>
      <Footer />
      
      <VoiceCallButton />
      <AounChatButton />
    </div>
  )
}
