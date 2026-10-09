import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertTriangle, AlertCircle, Info, Calendar } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { language, announcements } = useApp();
  const isBn = language === 'bn';

  const now = Date.now();
  const activeAnnouncements = announcements.filter((a) => a.active && (!a.expiresAt || new Date(a.expiresAt).getTime() > now));

  return (
    <section id="announcements" className="py-20 bg-[#F7F2E8]/80 dark:bg-[#12080B]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 border-t border-[#D4AF37]/20 backdrop-blur-[1px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Bell className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'জরুরি বিজ্ঞপ্তি' : 'Official Notices'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? 'মন্দির ও পূজা কমিটির ঘোষণা' : 'Announcements & Updates'}
          </h2>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-sans">
            {isBn
              ? 'মহামায়া দুর্গোৎসব সমিতি কর্তৃক প্রকাশিত গুরুত্বপূর্ণ সংবাদ, সময়সূচী ও নির্দেশিকা।'
              : 'Direct notices, schedules, and official circulars published by the MAHAMAYA committee.'}
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {activeAnnouncements.map((ann) => {
            const formattedDate = new Date(ann.date + 'T00:00:00').toLocaleDateString(
              isBn ? 'bn-IN' : 'en-US',
              { day: 'numeric', month: 'short', year: 'numeric' }
            );

            let priorityBadge = null;
            if (ann.priority === 'Urgent') {
              priorityBadge = (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{isBn ? 'জরুরি' : 'Urgent'}</span>
                </span>
              );
            } else if (ann.priority === 'Important') {
              priorityBadge = (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <AlertCircle className="w-3 h-3" />
                  <span>{isBn ? 'গুরুত্বপূর্ণ' : 'Important'}</span>
                </span>
              );
            } else {
              priorityBadge = (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-200/50 dark:bg-neutral-800 px-2 py-0.5 rounded">
                  <Info className="w-3 h-3" />
                  <span>{isBn ? 'বিজ্ঞপ্তি' : 'Notice'}</span>
                </span>
              );
            }

            return (
              <div
                key={ann.id}
                className={`p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border shadow-sm transition space-y-3 ${
                  ann.priority === 'Urgent'
                    ? 'border-rose-400/40 dark:border-rose-500/30'
                    : ann.priority === 'Important'
                    ? 'border-amber-400/40 dark:border-amber-500/30'
                    : 'border-[#D4AF37]/30'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {priorityBadge}
                    <div className="flex items-center gap-1 text-xs text-neutral-400 font-sans">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                  {isBn ? ann.title_bn : ann.title_en}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                  {isBn ? ann.description_bn : ann.description_en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
