import { Zap, Eye, HelpCircle, DollarSign } from "lucide-react"

export default function RightSidebar() {
  const sidebarItems = [
    {
      icon: Zap,
      label: "الخدمات الإلكترونية",
      isActive: true,
    },
    {
      icon: Eye,
      label: "التقاويم",
      isActive: false,
    },
    {
      icon: HelpCircle,
      label: "استفسارات أبشر",
      isActive: false,
    },
    {
      icon: DollarSign,
      label: "المدفوعات الحكومية",
      isActive: false,
    },
  ]

  return (
    <div className="w-full lg:w-80 space-y-4">
      {sidebarItems.map((item, index) => (
        <button
          key={index}
          className={`w-full flex flex-row-reverse items-center justify-start gap-5 px-6 py-6 rounded-xl border-r-4 transition-all duration-300 group hover:scale-105 hover:shadow-xl ${
            item.isActive
              ? "bg-white border-r-[#00663D] shadow-lg hover:bg-[#F0F9F5]"
              : "bg-[#F7F7F7] border-r-[#E4E4E7] hover:bg-white hover:border-r-[#00663D]"
          }`}
        >
          <span className={`font-bold text-base flex-1 text-right transition-colors duration-300 ${
            item.isActive ? "text-[#000000]" : "text-[#4A4A4A] group-hover:text-[#00663D]"
          }`}>
            {item.label}
          </span>
          <item.icon className={`w-7 h-7 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 ${
            item.isActive ? "text-[#00663D]" : "text-[#4A4A4A] group-hover:text-[#00663D]"
          }`} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}
