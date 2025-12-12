'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertTriangle, XCircle, Shield, FileText, Car, Clock, TrendingUp } from 'lucide-react';
import documentsData from '@/data/documents.json';
import vehiclesData from '@/data/vehicles.json';
import violationsData from '@/data/violations.json';
import profileData from '@/data/profile.json';

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScanStep {
  id: string;
  name: string;
  status: 'pending' | 'scanning' | 'completed' | 'error';
}

export default function HealthCheckModal({ isOpen, onClose }: HealthCheckModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [scanSteps, setScanSteps] = useState<ScanStep[]>([
    { id: 'profile', name: 'فحص البيانات الشخصية', status: 'pending' },
    { id: 'documents', name: 'فحص الوثائق الرسمية', status: 'pending' },
    { id: 'vehicles', name: 'فحص المركبات والتأمين', status: 'pending' },
    { id: 'violations', name: 'فحص المخالفات والغرامات', status: 'pending' },
    { id: 'analysis', name: 'تحليل النتائج', status: 'pending' },
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setProgress(0);
      setCurrentStep(0);
      setResults(null);
      
      // Reset steps
      setScanSteps([
        { id: 'profile', name: 'فحص البيانات الشخصية', status: 'pending' },
        { id: 'documents', name: 'فحص الوثائق الرسمية', status: 'pending' },
        { id: 'vehicles', name: 'فحص المركبات والتأمين', status: 'pending' },
        { id: 'violations', name: 'فحص المخالفات والغرامات', status: 'pending' },
        { id: 'analysis', name: 'تحليل النتائج', status: 'pending' },
      ]);

      // Simulate scanning with steps
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < scanSteps.length) {
          // Mark previous step as completed
          if (stepIndex > 0) {
            setScanSteps(prev => 
              prev.map((step, idx) => 
                idx === stepIndex - 1 
                  ? { ...step, status: 'completed' as const }
                  : step
              )
            );
          }
          
          // Mark current step as scanning
          setScanSteps(prev => 
            prev.map((step, idx) => 
              idx === stepIndex 
                ? { ...step, status: 'scanning' as const }
                : step
            )
          );
          
          setCurrentStep(stepIndex);
          setProgress(((stepIndex + 1) / scanSteps.length) * 100);
          stepIndex++;
        } else {
          clearInterval(stepInterval);
          setIsScanning(false);
          
          // Calculate results
          const criticalIssues: any[] = [];
          const warnings: any[] = [];
          let totalFines = 0;
          
          // Check documents
          if (documentsData.nationalId.status === 'warning') {
            warnings.push({
              type: 'document',
              title: 'الهوية الوطنية',
              message: `تنتهي خلال ${documentsData.nationalId.daysUntilExpiry} أيام - تجديد فوري مطلوب`,
              daysLeft: documentsData.nationalId.daysUntilExpiry,
            });
          }
          
          // Check vehicles
          vehiclesData.forEach((vehicle) => {
            if (vehicle.insurance.status === 'critical') {
              criticalIssues.push({
                type: 'vehicle',
                title: `تأمين ${vehicle.plateNumber}`,
                message: 'التأمين منتهي - قد تتعرض لغرامة!',
                vehicle: vehicle,
              });
            } else if (vehicle.insurance.status === 'warning') {
              warnings.push({
                type: 'vehicle',
                title: `تأمين ${vehicle.plateNumber}`,
                message: `ينتهي خلال ${vehicle.insurance.daysUntilExpiry} أيام`,
                vehicle: vehicle,
              });
            }
          });
          
          // Calculate total fines
          violationsData.forEach((violation: any) => {
            if (violation.status === 'pending') {
              totalFines += violation.amount;
            }
          });
          
          setResults({
            profile: profileData,
            documents: documentsData,
            vehicles: vehiclesData,
            violations: violationsData,
            criticalIssues,
            warnings,
            totalFines,
            summary: {
              totalDocuments: 3,
              validDocuments: documentsData.drivingLicense.status === 'valid' && documentsData.passport.status === 'valid' ? 2 : 1,
              totalVehicles: vehiclesData.length,
              vehiclesWithIssues: vehiclesData.filter(v => v.insurance.status !== 'valid').length,
              pendingViolations: violationsData.filter((v: any) => v.status === 'pending').length,
            },
          });
        }
      }, 800);

      return () => clearInterval(stepInterval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-[#00663D]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#856404]" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-[#721c24]" />;
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-[#00663D] text-white p-5 flex justify-between items-center border-b-2 border-[#004A2C]">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold">فحص الوضع الحكومي الكامل</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)] bg-gray-50">
          {isScanning ? (
            <div className="text-center py-12">
              {/* Aoun Avatar */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#00663D] shadow-lg bg-white p-1">
                    <img 
                      src="/aoun.png" 
                      alt="عون" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback to text if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = 'w-24 h-24 bg-[#00663D] rounded-full flex items-center justify-center shadow-md';
                          parent.innerHTML = '<span class="text-3xl text-white font-bold">ع</span>';
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-base font-semibold text-[#00663D] mt-3">عون يفحص معلوماتك...</p>
              </div>

              <Loader2 className="w-12 h-12 text-[#00663D] animate-spin mx-auto mb-6" />
              
              {/* Scanning Steps */}
              <div className="space-y-2 mb-6 max-w-md mx-auto">
                {scanSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      step.status === 'scanning'
                        ? 'bg-[#00663D]/10 border-r-4 border-[#00663D]'
                        : step.status === 'completed'
                        ? 'bg-white border border-gray-200'
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {step.status === 'scanning' && (
                      <Loader2 className="w-4 h-4 text-[#00663D] animate-spin" />
                    )}
                    {step.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-[#00663D]" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span
                      className={`flex-1 text-right text-sm ${
                        step.status === 'scanning'
                          ? 'font-semibold text-[#00663D]'
                          : step.status === 'completed'
                          ? 'text-gray-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00663D] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}%</p>
              </div>
            </div>
          ) : results && (
            <div className="space-y-5">
              {/* User Info Header */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#00663D] rounded-full flex items-center justify-center">
                    <span className="text-xl text-white font-bold">
                      {results.profile.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{results.profile.name}</h3>
                    <p className="text-sm text-gray-600">الهوية الوطنية: {results.profile.nationalId}</p>
                    <p className="text-xs text-gray-500">{results.profile.city} • {results.profile.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Critical Alerts */}
              {results.criticalIssues.length > 0 && (
                <div className="bg-white border-r-4 border-[#721c24] rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-[#721c24]" />
                    <h3 className="text-base font-bold text-gray-900">تنبيهات حرجة - تحتاج إجراء فوري</h3>
                  </div>
                  <div className="space-y-2">
                    {results.criticalIssues.map((issue: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="font-semibold text-gray-900 text-sm">{issue.title}</p>
                        <p className="text-xs text-gray-700 mt-1">{issue.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div className="bg-white border-r-4 border-[#856404] rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-[#856404]" />
                    <h3 className="text-base font-bold text-gray-900">تحذيرات - انتبه قبل أن تصبح غرامة</h3>
                  </div>
                  <div className="space-y-2">
                    {results.warnings.map((warning: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="font-semibold text-gray-900 text-sm">{warning.title}</p>
                        <p className="text-xs text-gray-700 mt-1">{warning.message}</p>
                        {warning.daysLeft && (
                          <p className="text-xs text-[#856404] mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            متبقي {warning.daysLeft} يوم فقط
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#00663D]" />
                    <span className="text-xs text-gray-600">الوثائق</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {results.summary.validDocuments}/{results.summary.totalDocuments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">سارية المفعول</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-[#00663D]" />
                    <span className="text-xs text-gray-600">المركبات</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {results.summary.totalVehicles - results.summary.vehiclesWithIssues}/{results.summary.totalVehicles}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">بحالة جيدة</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#856404]" />
                    <span className="text-xs text-gray-600">المخالفات</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {results.summary.pendingViolations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">قيد المعالجة</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#721c24]" />
                    <span className="text-xs text-gray-600">الغرامات</span>
                  </div>
                  <p className="text-xl font-bold text-[#721c24]">
                    {results.totalFines} ر.س
                  </p>
                  <p className="text-xs text-gray-500 mt-1">إجمالي المستحقة</p>
                </div>
              </div>

              {/* Detailed Report */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00663D]" />
                  التقرير التفصيلي
                </h3>
                
                {/* Documents */}
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">الوثائق الرسمية</h4>
                  <div className="space-y-2">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(results.documents.nationalId.status)}
                          <div>
                            <p className="font-semibold text-sm text-gray-900">الهوية الوطنية</p>
                            <p className="text-xs text-gray-600">رقم: {results.documents.nationalId.number}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-medium ${
                            results.documents.nationalId.status === 'warning' ? 'text-[#856404]' : 
                            results.documents.nationalId.status === 'critical' ? 'text-[#721c24]' : 
                            'text-[#00663D]'
                          }`}>
                            {results.documents.nationalId.status === 'warning' 
                              ? `تنتهي خلال ${results.documents.nationalId.daysUntilExpiry} أيام`
                              : getStatusText(results.documents.nationalId.status)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">ينتهي: {new Date(results.documents.nationalId.expiryDate).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(results.documents.drivingLicense.status)}
                          <div>
                            <p className="font-semibold text-sm text-gray-900">رخصة القيادة</p>
                            <p className="text-xs text-gray-600">رقم: {results.documents.drivingLicense.number}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-medium ${
                            results.documents.drivingLicense.status === 'warning' ? 'text-[#856404]' : 
                            results.documents.drivingLicense.status === 'critical' ? 'text-[#721c24]' : 
                            'text-[#00663D]'
                          }`}>
                            {getStatusText(results.documents.drivingLicense.status)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">ينتهي: {new Date(results.documents.drivingLicense.expiryDate).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicles */}
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">المركبات</h4>
                  <div className="space-y-3">
                    {results.vehicles.map((vehicle: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-sm text-gray-900 mb-3">
                          {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                        </h5>
                        
                        <div className="space-y-2">
                          <div className="bg-white rounded p-3 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(vehicle.insurance.status)}
                                <span className="text-xs font-medium text-gray-700">التأمين</span>
                              </div>
                              <div className="text-left">
                                <p className={`text-xs font-medium ${
                                  vehicle.insurance.status === 'warning' ? 'text-[#856404]' : 
                                  vehicle.insurance.status === 'critical' ? 'text-[#721c24]' : 
                                  'text-[#00663D]'
                                }`}>
                                  {vehicle.insurance.status === 'critical' 
                                    ? 'منتهي - يحتاج تجديد فوري' 
                                    : vehicle.insurance.status === 'warning'
                                    ? `ينتهي خلال ${vehicle.insurance.daysUntilExpiry} أيام`
                                    : getStatusText(vehicle.insurance.status)}
                                </p>
                                {vehicle.insurance.expiryDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    ينتهي: {new Date(vehicle.insurance.expiryDate).toLocaleDateString('ar-SA')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded p-3 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(vehicle.registration.status)}
                                <span className="text-xs font-medium text-gray-700">التسجيل</span>
                              </div>
                              <div className="text-left">
                                <p className={`text-xs font-medium ${
                                  vehicle.registration.status === 'warning' ? 'text-[#856404]' : 
                                  vehicle.registration.status === 'critical' ? 'text-[#721c24]' : 
                                  'text-[#00663D]'
                                }`}>
                                  {getStatusText(vehicle.registration.status)}
                                </p>
                                {vehicle.registration.expiryDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    ينتهي: {new Date(vehicle.registration.expiryDate).toLocaleDateString('ar-SA')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Violations */}
                {results.violations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">المخالفات المرورية</h4>
                    <div className="space-y-2">
                      {results.violations.map((violation: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{violation.description}</p>
                              <p className="text-xs text-gray-600 mt-1">{violation.location}</p>
                              <p className="text-xs text-gray-500 mt-1">{new Date(violation.date).toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div className="text-left">
                              <p className="text-base font-bold text-[#721c24]">{violation.amount} ر.س</p>
                              <p className="text-xs text-gray-500">قيد المعالجة</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#00663D] hover:bg-[#004A2C] text-white py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm"
                >
                  فهمت، شكراً عون
                </button>
                {results.totalFines > 0 && (
                  <button
                    onClick={() => {
                      // Navigate to violations page or payment
                      window.location.href = '/violations';
                    }}
                    className="flex-1 bg-[#721c24] hover:bg-[#5a1519] text-white py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm"
                  >
                    سداد الغرامات ({results.totalFines} ر.س)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
