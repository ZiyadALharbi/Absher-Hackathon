import { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon;
  label: string;
}

export default function ServiceCard({ icon: Icon, label }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      {/* Icon Circle */}
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-[#E4E4E7] group-hover:border-[#00663D] group-hover:bg-gradient-to-br group-hover:from-[#F0F9F5] group-hover:to-white transition-all duration-500 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-xl group-hover:shadow-[#00663D]/20">
        <Icon className="w-16 h-16 text-[#00663D] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" strokeWidth={2} />
      </div>

      {/* Label Button */}
      <button className="w-full bg-gradient-to-r from-[#00663D] to-[#004A2C] hover:from-[#004A2C] hover:to-[#003420] text-white font-bold py-4 px-5 rounded-xl text-base transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#00663D]/30 hover:-translate-y-0.5 active:scale-95">
        {label}
      </button>
    </div>
  )
}
