'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface DemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSteps = [
  {
    title: 'مرحباً بك في عرض عون',
    description: 'سنأخذك في جولة سريعة لتجربة قدرات عون - المساعد الذكي للخدمات الحكومية',
    tips: [
      'استخدم الأزرار للتنقل بين الميزات',
      'جرّب الأمثلة المقترحة',
      'جميع البيانات تجريبية'
    ]
  },
  {
    title: 'الميزة 1: المحادثة الذكية',
    description: 'اسأل عون عن أي خدمة حكومية',
    examples: [
      'أبغى أعرف مخالفاتي',
      'متى تنتهي هويتي؟',
      'وين أجدد رخصة القيادة؟'
    ]
  },
  {
    title: 'الميزة 2: التشخيص الشامل',
    description: 'اضغط على "تشخيص حالتي الحكومية" لفحص جميع وثائقك ومركباتك',
    tips: [
      'يفحص الهوية الوطنية',
      'يفحص رخصة القيادة',
      'يفحص تأمين المركبات',
      'يعطيك تنبيهات مبكرة'
    ]
  },
  {
    title: 'الميزة 3: حزم الأحداث الحياتية',
    description: 'أتمتة جميع الإجراءات الحكومية لحدث معين',
    examples: [
      'حزمة الزواج: تحديث الحالة + ربط السجلات',
      'حزمة شراء سيارة: نقل ملكية + تأمين + تسجيل'
    ]
  },
  {
    title: 'الميزة 4: المساعد الصوتي',
    description: 'اضغط على زر الهاتف الأخضر للتحدث مع عون',
    tips: [
      'تقنية تحويل الصوت لنص (STT)',
      'تقنية تحويل النص لصوت (TTS)',
      'دعم اللغة العربية الكامل'
    ]
  }
];

export default function DemoGuide({ isOpen, onClose }: DemoGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        {/* Header */}
        <div className="bg-[#00663D] text-white p-5 flex justify-between items-center rounded-t-lg shadow-lg">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">دليل العرض التوضيحي</h2>
        </div>

        {/* Content */}
        <div className="p-8" dir="rtl">
          <div className="mb-6">
            <span className="text-sm text-[#00663D] font-semibold">
              الخطوة {currentStep + 1} من {demoSteps.length}
            </span>
            <h3 className="text-2xl font-bold text-[#000000] mt-2 mb-3">{step.title}</h3>
            <p className="text-[#4A4A4A] text-lg">{step.description}</p>
          </div>

          {step.tips && (
            <div className="bg-[#F7F7F7] rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-[#000000] mb-2">نصائح:</h4>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="text-[#4A4A4A] text-sm flex items-start gap-2">
                    <span className="text-[#00663D] shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.examples && (
            <div className="bg-[#F7F7F7] rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-[#000000] mb-2">أمثلة:</h4>
              <div className="space-y-2">
                {step.examples.map((example, index) => (
                  <div key={index} className="bg-white rounded p-3 text-sm text-[#4A4A4A] border border-[#E4E4E7]">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentStep ? 'w-8 bg-[#00D392]' : 'w-2 bg-[#E4E4E7]'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 bg-[#F7F7F7] hover:bg-[#E4E4E7] text-[#000000] py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>
            )}
            {currentStep < demoSteps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex-1 bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                التالي
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                ابدأ التجربة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

