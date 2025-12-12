"use client"
import { Calendar, Users, UsersRound, Car, Laptop } from "lucide-react"
import ServiceCard from "./service-card"
import ServiceCarousel from "./service-carousel"

export default function MainContent() {
  const mainServices = [
    { icon: Calendar, label: "مواعيد" },
    { icon: Users, label: "العمالة" },
    { icon: UsersRound, label: "أفراد الأسرة" },
    { icon: Car, label: "المركبات" },
    { icon: Laptop, label: "خدماتي" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#00663D] text-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-right">مرحباً بك في منصة أبشر</h2>
        <p className="text-white/90 text-lg text-right">منصة الخدمات الإلكترونية لوزارة الداخلية - المملكة العربية السعودية</p>
      </div>

      {/* Main Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {mainServices.map((service, index) => (
          <ServiceCard key={index} icon={service.icon} label={service.label} />
        ))}
      </div>

      {/* Services Carousel */}
      <ServiceCarousel />
    </div>
  )
}
