'use client';

import { useState } from 'react';
import { Heart, Car, CheckCircle, Loader2 } from 'lucide-react';

export default function LifeEventBundles() {
  const [showMarriageForm, setShowMarriageForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [marriageData, setMarriageData] = useState({
    groomName: '',
    brideName: '',
    marriageDate: '',
  });

  const [carData, setCarData] = useState({
    plateNumber: '',
  });

  const marriageSteps = [
    'تحديث الحالة الاجتماعية',
    'ربط السجلات المدنية',
    'إبلاغ وزارة العدل',
    'تحديث بيانات الأسرة',
  ];

  const carSteps = [
    'نقل الملكية',
    'تحديث التأمين',
    'تسجيل المركبة',
    'إصدار الرخصة',
  ];

  const handleMarriageSubmit = () => {
    setIsProcessing(true);
    setProcessStep(0);
    setShowSuccess(false);

    const interval = setInterval(() => {
      setProcessStep(prev => {
        if (prev >= marriageSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          setShowSuccess(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleCarSubmit = () => {
    setIsProcessing(true);
    setProcessStep(0);
    setShowSuccess(false);

    const interval = setInterval(() => {
      setProcessStep(prev => {
        if (prev >= carSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          setShowSuccess(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold text-[#000000] mb-2">رحلات الحياة</h2>
        <p className="text-[#4A4A4A] text-base">نوحّد جميع خدماتك الحكومية في رحلة واحدة مرتبطة بحدث حياتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marriage Bundle */}
        <div className="bg-white rounded-xl p-6 border-2 border-[#E4E4E7] hover:border-[#00663D] hover:shadow-2xl hover:shadow-[#00663D]/20 transition-all duration-500 hover:-translate-y-2 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
              <Heart className="w-7 h-7 text-pink-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#000000] group-hover:text-[#00663D] transition-colors duration-300">حزمة الزواج</h3>
              <p className="text-sm text-[#4A4A4A]">إكمال جميع إجراءات الزواج</p>
            </div>
          </div>

          {!showMarriageForm ? (
            <button
              onClick={() => setShowMarriageForm(true)}
              className="w-full bg-gradient-to-r from-[#00663D] to-[#004A2C] hover:from-[#004A2C] hover:to-[#003420] text-white py-3 rounded-lg font-bold transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-[#00663D]/40 hover:-translate-y-1 active:scale-95"
            >
              ابدأ رحلة الزواج
            </button>
          ) : (
            <div className="space-y-4">
              {!isProcessing && !showSuccess && (
                <>
                  <input
                    type="text"
                    placeholder="اسم الزوج"
                    value={marriageData.groomName}
                    onChange={(e) => setMarriageData({ ...marriageData, groomName: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[#E4E4E7] rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#00D392]"
                  />
                  <input
                    type="text"
                    placeholder="اسم الزوجة"
                    value={marriageData.brideName}
                    onChange={(e) => setMarriageData({ ...marriageData, brideName: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[#E4E4E7] rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#00D392]"
                  />
                  <input
                    type="date"
                    value={marriageData.marriageDate}
                    onChange={(e) => setMarriageData({ ...marriageData, marriageDate: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[#E4E4E7] rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#00D392]"
                  />
                  <button
                    onClick={handleMarriageSubmit}
                    className="w-full bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    إكمال الإجراءات
                  </button>
                </>
              )}

              {isProcessing && (
                <div className="space-y-3">
                  {marriageSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {index < processStep ? (
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      ) : index === processStep ? (
                        <Loader2 className="w-5 h-5 text-[#00663D] animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#E4E4E7] rounded-full shrink-0" />
                      )}
                      <span className={`text-sm ${index <= processStep ? 'text-[#000000]' : 'text-[#4A4A4A]'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {showSuccess && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">تم إكمال جميع الإجراءات بنجاح</p>
                  <p className="text-sm text-green-700 mt-1">تم تحديث جميع البيانات الحكومية</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Car Purchase Bundle */}
        <div className="bg-white rounded-lg p-6 border border-[#E4E4E7] hover:border-[#00663D] transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#000000]">حزمة شراء سيارة</h3>
              <p className="text-sm text-[#4A4A4A]">إتمام جميع إجراءات الشراء</p>
            </div>
          </div>

          {!showCarForm ? (
            <button
              onClick={() => setShowCarForm(true)}
              className="w-full bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              ابدأ شراء السيارة
            </button>
          ) : (
            <div className="space-y-4">
              {!isProcessing && !showSuccess && (
                <>
                  <input
                    type="text"
                    placeholder="رقم اللوحة (مثال: أ ب ج 1234)"
                    value={carData.plateNumber}
                    onChange={(e) => setCarData({ plateNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F7F7] border border-[#E4E4E7] rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#00D392]"
                  />
                  <button
                    onClick={handleCarSubmit}
                    className="w-full bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    إكمال الإجراءات
                  </button>
                </>
              )}

              {isProcessing && (
                <div className="space-y-3">
                  {carSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {index < processStep ? (
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      ) : index === processStep ? (
                        <Loader2 className="w-5 h-5 text-[#00663D] animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-[#E4E4E7] rounded-full shrink-0" />
                      )}
                      <span className={`text-sm ${index <= processStep ? 'text-[#000000]' : 'text-[#4A4A4A]'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {showSuccess && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">تم إكمال جميع الإجراءات بنجاح</p>
                  <p className="text-sm text-green-700 mt-1">السيارة جاهزة للاستخدام</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

