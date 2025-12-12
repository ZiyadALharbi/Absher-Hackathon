import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="bg-white rounded-xl border-2 border-[#E4E4E7] p-6 mb-6 hover:border-[#00663D] hover:shadow-2xl hover:shadow-[#00663D]/20 transition-all duration-500 hover:scale-[1.02] group">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[#00663D] font-bold text-xl flex items-center gap-3">
          <Search className="w-7 h-7 transition-all duration-500 group-hover:scale-125 group-hover:rotate-90" strokeWidth={2.5} />
          <span>بحث</span>
        </div>
        <input
          type="text"
          placeholder="ابحث عن خدمة أو معلومة..."
          className="flex-1 outline-none text-base text-[#000000] font-semibold placeholder:text-[#4A4A4A] text-right bg-[#F7F7F7] rounded-lg px-5 py-3 focus:bg-white focus:ring-2 focus:ring-[#00663D] focus:shadow-lg transition-all duration-300"
        />
      </div>
    </div>
  )
}
