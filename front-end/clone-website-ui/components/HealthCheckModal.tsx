'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import documentsData from '@/data/documents.json';
import vehiclesData from '@/data/vehicles.json';

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthCheckModal({ isOpen, onClose }: HealthCheckModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setProgress(0);
      setResults(null);

      // Simulate scanning
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            // Load results
            setResults({
              documents: documentsData,
              vehicles: vehiclesData,
            });
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'سارية';
      case 'warning':
        return 'تحذير';
      case 'critical':
        return 'منتهية';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-[#4A4A4A]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#00663D] text-white p-5 flex justify-between items-center shadow-lg">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-right">تشخيص حالتي الحكومية</h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {isScanning ? (
            <div className="text-center py-12" dir="rtl">
              <Loader2 className="w-16 h-16 text-[#00663D] animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#000000] mb-2">جاري فحص بياناتك...</h3>
              <p className="text-[#4A4A4A] mb-6">نقوم بمراجعة جميع خدماتك الحكومية</p>
              
              {/* Progress bar */}
              <div className="w-full max-w-md mx-auto">
                  <div className="h-2 bg-[#E4E4E7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00663D] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-[#4A4A4A] mt-2">{progress}%</p>
              </div>
            </div>
          ) : results && (
            <div className="space-y-6" dir="rtl">
              {/* Overall Status */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-200">
                <h3 className="text-lg font-bold text-[#000000] mb-2">الحالة العامة</h3>
                <p className="text-yellow-700">تحتاج إلى اهتمام - لديك بعض المشاكل التي تحتاج إلى حل</p>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-3">الوثائق</h3>
                <div className="space-y-3">
                  {/* National ID */}
                  <div className="bg-white rounded-lg p-4 border border-[#E4E4E7]">
                    <div className="flex justify-between items-start">
                      <div>
                        {getStatusIcon(results.documents.nationalId.status)}
                      </div>
                      <div className="flex-1 mr-3">
                        <h4 className="font-semibold text-[#000000]">الهوية الوطنية</h4>
                        <p className="text-sm text-[#4A4A4A]">رقم: {results.documents.nationalId.number}</p>
                        <p className={`text-sm font-medium ${getStatusColor(results.documents.nationalId.status)}`}>
                          {results.documents.nationalId.status === 'warning' 
                            ? `تنتهي خلال ${results.documents.nationalId.daysUntilExpiry} أيام`
                            : getStatusText(results.documents.nationalId.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driving License */}
                  <div className="bg-white rounded-lg p-4 border border-[#E4E4E7]">
                    <div className="flex justify-between items-start">
                      <div>
                        {getStatusIcon(results.documents.drivingLicense.status)}
                      </div>
                      <div className="flex-1 mr-3">
                        <h4 className="font-semibold text-[#000000]">رخصة القيادة</h4>
                        <p className="text-sm text-[#4A4A4A]">رقم: {results.documents.drivingLicense.number}</p>
                        <p className={`text-sm font-medium ${getStatusColor(results.documents.drivingLicense.status)}`}>
                          {getStatusText(results.documents.drivingLicense.status)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <h3 className="text-lg font-bold text-[#000000] mb-3">المركبات</h3>
                <div className="space-y-3">
                  {results.vehicles.map((vehicle: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-[#E4E4E7]">
                      <h4 className="font-semibold text-[#000000] mb-2">{vehicle.make} {vehicle.model} - {vehicle.plateNumber}</h4>
                      
                      {/* Insurance */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(vehicle.insurance.status)}
                          <span className="text-sm text-[#4A4A4A]">التأمين</span>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(vehicle.insurance.status)}`}>
                          {vehicle.insurance.status === 'critical' ? 'منتهي - يحتاج تجديد فوري!' : getStatusText(vehicle.insurance.status)}
                        </span>
                      </div>

                      {/* Registration */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(vehicle.registration.status)}
                          <span className="text-sm text-[#4A4A4A]">التسجيل</span>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(vehicle.registration.status)}`}>
                          {getStatusText(vehicle.registration.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold transition-all duration-200"
              >
                فهمت
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

