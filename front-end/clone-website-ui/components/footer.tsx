import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white mt-12 py-10 border-t-2 border-[#00663D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00663D]">عن أبشر</h3>
            <p className="text-[#F7F7F7] text-base leading-relaxed font-medium">
              منصة أبشر الإلكترونية تابعة لوزارة الداخلية في المملكة العربية السعودية، تقدم خدمات إلكترونية متنوعة للمواطنين والمقيمين.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00663D]">روابط سريعة</h3>
            <ul className="space-y-3 text-base">
              <li>
                <a href="#" className="text-[#F7F7F7] hover:text-[#00663D] transition-all duration-300 font-semibold hover:underline">
                  الخدمات الإلكترونية
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F7F7F7] hover:text-[#00663D] transition-all duration-300 font-semibold hover:underline">
                  دليل الخدمات
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F7F7F7] hover:text-[#00663D] transition-all duration-300 font-semibold hover:underline">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F7F7F7] hover:text-[#00663D] transition-all duration-300 font-semibold hover:underline">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Logos */}
          <div className="flex flex-col items-center md:items-end gap-5">
            <Image
              src="/absher-logo.svg"
              alt="أبشر"
              width={140}
              height={70}
              className="h-12 w-auto brightness-0 invert"
            />
            <Image
              src="/moi-2030-logos.png"
              alt="وزارة الداخلية - رؤية 2030"
              width={200}
              height={60}
              className="h-12 w-auto brightness-0 invert"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[#4A4A4A] text-center">
          <p className="text-[#F7F7F7] text-base font-semibold">
            © 2025 منصة أبشر - وزارة الداخلية - المملكة العربية السعودية
          </p>
          <p className="text-[#9CA3AF] text-sm mt-2 font-medium">
            جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  )
}

