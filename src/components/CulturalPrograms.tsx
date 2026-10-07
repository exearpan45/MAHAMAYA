import React from 'react';
import { useApp } from '../context/AppContext';
import { Music, Clock, MapPin, Calendar, Sparkles } from 'lucide-react';

export const CulturalPrograms: React.FC = () => {
  const { language, culturalPrograms } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="cultural" className="py-16 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Music className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'সাংস্কৃতিক সন্ধ্যা' : 'Cultural Programs'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
            {isBn ? 'ঐতিহ্যবাহী সাংস্কৃতিক অনুষ্ঠান' : 'Cultural Evenings & Music'}
          </h2>
        </div>

        {/* Empty State / Notice when no programs configured yet */}
        {culturalPrograms.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-dashed border-[#D4AF37]/40 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Music className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn
                  ? 'সাংস্কৃতিক অনুষ্ঠানের বিবরণ শীঘ্রই প্রকাশ করা হবে'
                  : 'Cultural program details will be announced soon'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
                {isBn
                  ? 'পূজা কমিটির পক্ষ থেকে সাংস্কৃতিক সূচি, শিল্পীবৃন্দের বিবরণ ও সময়সূচী চূড়ান্ত হওয়ার পর এখানে সংযোজন করা হবে।'
                  : 'Program schedules, artist information, and performance timings will be officially published here by the MAHAMAYA committee.'}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-[#9E1B32] dark:text-[#E5C158] font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'কমিটি কর্তৃক আপডেটযোগ্য' : 'Configurable by Committee'}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {culturalPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#9E1B32] dark:text-[#E5C158]" />
                    <span>{prog.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E56717]" />
                    <span>{prog.time}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                  {isBn ? prog.title_bn : prog.title_en}
                </h3>

                <p className="text-xs text-[#9E1B32] dark:text-[#E5C158] font-medium">
                  {isBn ? `শিল্পী: ${prog.performer_bn}` : `Performer: ${prog.performer_en}`}
                </p>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans">
                  {isBn ? prog.description_bn : prog.description_en}
                </p>

                <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-1 border-t border-neutral-100 dark:border-neutral-800">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{prog.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
