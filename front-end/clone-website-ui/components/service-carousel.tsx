"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plane, BarChart3, Handshake, FileText, ClipboardCheck, LucideIcon } from "lucide-react"

interface CarouselItem {
  icon: LucideIcon;
  label: string;
  badge: string | null;
}

export default function ServiceCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselItems: CarouselItem[] = [
    {
      icon: Plane,
      label: "إيقاف الخدمات وعودة السفر",
      badge: null,
    },
    {
      icon: BarChart3,
      label: "مزايا الوحدات الإلكترونية",
      badge: null,
    },
    {
      icon: Handshake,
      label: "مشاركة الشركات",
      badge: null,
    },
    {
      icon: FileText,
      label: "تقارير أبشر",
      badge: "جديد",
    },
    {
      icon: ClipboardCheck,
      label: "إعداد شهادة حسن سلوك",
      badge: "جديد",
    },
  ]

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 border border-[#E4E4E7]">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-[#E4E4E7]"></div>
          <h2 className="text-xl font-bold text-[#000000]">خدمات أخرى</h2>
          <div className="flex-1 h-px bg-[#E4E4E7]"></div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-all duration-200"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className={`w-5 h-5 ${currentSlide === 0 ? 'text-[#E4E4E7]' : 'text-[#00663D]'}`} />
        </button>

        {/* Service Items */}
        <div className="flex-1 grid grid-cols-4 gap-4">
          {carouselItems.slice(currentSlide, currentSlide + 4).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-[#E4E4E7] rounded-xl p-5 flex flex-col items-center gap-3 relative hover:bg-gradient-to-br hover:from-white hover:to-[#F0F9F5] hover:border-[#00663D] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#00663D]/20 hover:-translate-y-2 group"
              >
                {item.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg animate-pulse">
                    {item.badge}
                  </div>
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-[#F7F7F7] to-white rounded-full flex items-center justify-center border-2 border-[#E4E4E7] group-hover:border-[#00663D] transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                  <IconComponent className="w-10 h-10 text-[#00663D] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-[#4A4A4A] group-hover:text-[#00663D] text-center min-h-[36px] flex items-center transition-colors duration-300">{item.label}</p>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setCurrentSlide(Math.min(carouselItems.length - 4, currentSlide + 1))}
          className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-all duration-200"
          disabled={currentSlide >= carouselItems.length - 4}
        >
          <ChevronRight className={`w-5 h-5 ${currentSlide >= carouselItems.length - 4 ? 'text-[#E4E4E7]' : 'text-[#00663D]'}`} />
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.ceil(carouselItems.length / 4) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              currentSlide === index ? "w-6 bg-[#00663D]" : "w-1.5 bg-[#E4E4E7] hover:bg-[#008850]"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
