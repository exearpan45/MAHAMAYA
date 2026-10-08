import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Music, Users, Sparkles, Heart } from 'lucide-react';

export const FourDayExperience: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="bhog" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Sparkles className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'চার দিনের উৎসব পরিক্রমা' : 'The Four-Day Experience'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? settings.bhogHeading_bn : settings.bhogHeading_en}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans">
            {isBn ? settings.bhogIntro_bn : settings.bhogIntro_en}
          </p>
        </div>

        {/* Four Experience Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Bhog on all four principal days */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-4 hover:border-[#9E1B32] transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Utensils className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'চার দিনেই মহাপ্রসাদ ভোগ' : 'Bhog on All Four Principal Days'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              {isBn
                ? 'পূজার প্রধান চার দিনেই আগত সকল ভক্তবৃন্দের মাঝে মায়ের পবিত্র ভোগ বিতরণ করা হয়। নির্দিষ্ট সময়সূচী ও নিয়মাবলী কমিটি কর্তৃক সময়োপযোগী করে জানানো হয়।'
                : 'Sacred Anna Bhog is prepared and distributed to all visiting devotees across all four principal days of Durga Puja. Timings are guided by committee notices.'}
            </p>
          </div>

          {/* Pillar 2: Cultural Programs & Dhak */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-4 hover:border-[#9E1B32] transition">
            <div className="w-12 h-12 rounded-xl bg-[#9E1B32]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
              <Music className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'সাংস্কৃতিক সন্ধ্যা ও আরতি' : 'Cultural Evenings & Arati'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              {isBn
                ? 'সন্ধ্যায় ধুনুচি নাচ, ঢাকের বোল ও ভক্তিমূলক সাংস্কৃতিক অনুষ্ঠান পরিবেশিত হয়। সম্পূর্ণ অরাজনৈতিক ও নির্মল আনন্দঘন পরিবেশে সবাই অংশগ্রহণ করেন।'
                : 'Evenings feature the resonance of Dhak, solemn sandhya arati, and family-friendly cultural gatherings celebrating Bengali tradition.'}
            </p>
          </div>

          {/* Pillar 3: Heartfelt Community Warmth */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-4 hover:border-[#9E1B32] transition">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Users className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'পারিবারিক ও সামাজিক ঐক্য' : 'Generational Community Unity'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              {isBn
                ? 'ব্রাহ্মণ পাড়া সহ পার্শ্ববর্তী এলাকার বহু মানুষ দূর-দূরান্ত থেকে এই চার দিনের উৎসবে শামিল হতে গ্রামে ফিরে আসেন।'
                : 'Generations of families and residents return to Brahman Para during these four auspicious days to partake in the warmth of home and heritage.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
