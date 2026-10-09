import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Calendar, Landmark } from 'lucide-react';

export const DownloadCalendarModal: React.FC = () => {
  const { language, downloadModalOpen, setDownloadModalOpen, currentPujaYear, settings } = useApp();
  const isBn = language === 'bn';

  if (!downloadModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white text-neutral-900 border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between no-print border-b pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E1B32]">
            <Calendar className="w-4 h-4" />
            <span>{isBn ? 'মুদ্রণ ও সংরক্ষণ সংস্করণ' : 'Print & Download Version'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold flex items-center gap-1.5 shadow hover:bg-[#800020] transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save as PDF'}</span>
            </button>
            <button
              onClick={() => setDownloadModalOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div id="calendar-print-root" className="space-y-6 print:space-y-4">
          
          {/* Header Banner */}
          <div className="text-center space-y-2 border-b-2 border-[#9E1B32] pb-6">
            <p className="text-xs tracking-widest text-[#9E1B32] font-semibold">
              ॥ শ্রী শ্রী দুর্গায়ৈ নমঃ ॥
            </p>
            <h1 className="text-3xl font-extrabold font-bengali text-[#4A0E17]">
              {settings.templeName_bn}
            </h1>
            <p className="text-lg font-display text-neutral-700 font-semibold">
              {settings.templeName_en}
            </p>
            <p className="text-xs uppercase font-medium text-neutral-500">
              {settings.committeeName_bn} • শারদোৎসবের {currentPujaYear.edition}তম বর্ষ ({currentPujaYear.year})
            </p>
            <p className="text-[11px] text-neutral-500">
              ব্রাহ্মণ পাড়া, পিন্দ্রা • অলাভজনক সর্বজনীন শারদোৎসব
            </p>
          </div>

          {/* Puja Days Schedule Table */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-bengali text-[#9E1B32] text-center uppercase tracking-wide">
              {isBn
                ? `${currentPujaYear.year} সালের শ্রী শ্রী শারদীয়া দুর্গাপূজার অনুমোদিত নির্ঘণ্ট`
                : `Official Durga Puja Timetable — ${currentPujaYear.year}`}
            </h2>

            <div className="border border-neutral-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-300">
                    <th className="p-3 font-bold text-neutral-700">তারিখ / Date</th>
                    <th className="p-3 font-bold text-neutral-700">তিথি / Day</th>
                    <th className="p-3 font-bold text-neutral-700">পূজা ও প্রধান আচার / Rituals</th>
                    <th className="p-3 font-bold text-neutral-700">সময়সূচী / Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {currentPujaYear.days.map((day, idx) => (
                    <tr key={day.id || idx} className="hover:bg-neutral-50">
                      <td className="p-3 font-medium whitespace-nowrap">
                        <div className="font-semibold text-[#9E1B32]">{day.date}</div>
                        <div className="text-[10px] text-neutral-500">{day.bengaliDate}</div>
                      </td>
                      <td className="p-3 font-bold font-bengali whitespace-nowrap">
                        {isBn ? day.dayName_bn : day.dayName_en}
                      </td>
                      <td className="p-3 space-y-1">
                        <ul className="list-disc list-inside space-y-0.5 text-neutral-700">
                          {(isBn ? day.rituals_bn : day.rituals_en).map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                        {day.bhogTimings && (
                          <div className="text-[11px] font-semibold text-emerald-800">
                            ভোগ বিতরণ: {day.bhogTimings}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-neutral-600 whitespace-nowrap">
                        {day.startTime || 'নির্ঘণ্ট সাপেক্ষে'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Note in Print */}
          <div className="text-center pt-4 border-t border-neutral-200 text-[11px] text-neutral-500 space-y-1">
            <p>
              পূজার নির্ঘণ্ট ও ভোগের সময়সূচী আবহাওয়া ও পঞ্জিকার তিথি সাপেক্ষে সমন্বয়যোগ্য।
            </p>
            <p className="font-sans">
              অফিসিয়াল ওয়েবসাইট: mahamaya-bsm.pages.dev • গুগল ম্যাপস: maps.app.goo.gl/w5C1sACBhUxz5t1w6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
