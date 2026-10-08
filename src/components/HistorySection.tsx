import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Calendar, Landmark, Info } from 'lucide-react';

export const HistorySection: React.FC = () => {
  const { language, historyMilestones } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="history" className="py-20 bg-[#F7F2E8]/80 dark:bg-[#12080B]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 border-t border-[#D4AF37]/20 backdrop-blur-[1px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <History className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'ইতিহাস ও ঐতিহ্য' : 'Historic Milestones'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? 'পিন্দ্রা দুর্গা মন্দিরের ১১৮ বছরের পথচলা' : 'Chronicle of 118 Years'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
            {isBn
              ? 'ব্রাহ্মণ পাড়ার ব্রাহ্মণ গোস্বামী সমাজের নিষ্ঠা ও আন্তরিকতায় লালিত ১১৮ বছরের সর্বজনীন শারদোৎসব।'
              : 'The sacred 118-year legacy of Pinrra Durga Mandir, organized with collective faith by the Brahman Goswami community and MAHAMAYA committee.'}
          </p>
        </div>

        {/* Visual Timeline */}
        <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 sm:ml-32 space-y-10 py-4">
          {historyMilestones.map((m, idx) => (
            <div key={m.id || idx} className="relative pl-6 sm:pl-8 group">
              
              {/* Year marker on the left for sm+ screens */}
              <div className="hidden sm:block absolute -left-36 top-0 text-right w-28">
                <span className="text-sm font-bold font-serif text-[#9E1B32] dark:text-[#E5C158]">
                  {m.year}
                </span>
              </div>

              {/* Node dot on the timeline axis */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FFFDF9] dark:bg-[#1A0C11] border-2 border-[#9E1B32] dark:border-[#E5C158] group-hover:scale-125 transition-transform" />

              {/* Timeline Entry Card */}
              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4 shadow-sm hover:border-[#9E1B32] dark:hover:border-[#E5C158] transition">
                
                {/* Year visible on mobile */}
                <span className="sm:hidden text-xs font-bold font-serif text-[#9E1B32] dark:text-[#E5C158] block">
                  {m.year}
                </span>

                <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                  {isBn ? m.title_bn : m.title_en}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                  {isBn ? m.description_bn : m.description_en}
                </p>

                {m.image && (
                  <div className="rounded-xl overflow-hidden max-h-56 mt-3 border border-neutral-200 dark:border-neutral-800">
                    <img
                      src={m.image}
                      alt={isBn ? m.title_bn : m.title_en}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Committee verified history note */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1 text-xs text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Info className="w-4 h-4" />
            <span>{isBn ? 'কমিটি সংরক্ষিত তথ্য' : 'Verified Committee Record'}</span>
          </div>
          <p className="font-bengali leading-relaxed">
            {isBn
              ? 'পূজার প্রাচীন নথিপত্র, ফটোগ্রাফ ও অন্যান্য ঐতিহাসিক বিবরণ কমিটি কর্তৃক নিয়মিতভাবে সংগৃহীত ও আপডেট করা হচ্ছে।'
              : 'Historical archival documents and oral histories are continually documented and updated directly by the MAHAMAYA committee.'}
          </p>
        </div>
      </div>
    </section>
  );
};
