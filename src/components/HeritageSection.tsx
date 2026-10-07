import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Users, Flame, Landmark } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="heritage" className="py-20 bg-[#F7F2E8]/80 dark:bg-[#12080B]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 border-t border-b border-[#D4AF37]/20 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Landmark className="w-4 h-4" />
            <span>{isBn ? 'ঐতিহ্যের এক শতক পেরিয়ে' : 'Over a Century of Heritage'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? '১১৮ বছরের শ্রদ্ধা ও ঐতিহ্য' : '118 Years of Devotion'}
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
            {isBn
              ? '১৯০৮ সাল থেকে ২০২৬ — ব্রাহ্মণ পাড়ার ব্রাহ্মণ গোস্বামী সম্প্রদায়ের সম্মিলিত ভক্তি ও নিষ্ঠায় পিন্দ্রা দুর্গা মন্দির উদযাপন করছে শারদোৎসবের গৌরবময় ১১৮তম বর্ষ।'
              : 'Completing 118 years in 2026, the Durga Puja at Pinrra Durga Mandir has been sustained by the devotion of the Brahman Goswami community of Brahman Para.'}
          </p>
        </div>

        {/* Core Verified Truth Cards (No Inventions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 118 Years in 2026 */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 shadow-sm space-y-4 hover:border-[#D4AF37] transition">
            <div className="w-12 h-12 rounded-xl bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
              <Flame className="w-6 h-6 text-[#9E1B32] dark:text-[#E5C158]" />
            </div>
            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? '১১৮তম বর্ষের ধারাবাহিকতা' : '118th Year Milestone'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {isBn
                ? '২০২৬ সালে এই পূজানুষ্ঠানটি ১১৮ বছর পূর্ণ করছে। এক শতকেরও বেশি সময় ধরে দেবীর পূজা নিরবচ্ছিন্ন ও নিষ্ঠা সহকারে পরিচালিত হয়ে আসছে।'
                : 'The Durga Puja is completing 118 years in 2026. For more than a century, traditions have been preserved with unbroken devotion.'}
            </p>
          </div>

          {/* Card 2: Community Legacy (No Single Founder) */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 shadow-sm space-y-4 hover:border-[#D4AF37] transition">
            <div className="w-12 h-12 rounded-xl bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
              <Users className="w-6 h-6 text-[#9E1B32] dark:text-[#E5C158]" />
            </div>
            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'ব্রাহ্মণ গোস্বামী সমাজ' : 'Community Heritage'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {isBn
                ? 'এই পূজা ব্রাহ্মণ পাড়ার ব্রাহ্মণ গোস্বামী সম্প্রদায়ের সঙ্গে সুদীর্ঘকাল ধরে যুক্ত। এই পূজার কোনো একক প্রতিষ্ঠাতা নেই; এটি একটি যৌথ পারিবারিক ও সামাজিক ঐতিহ্য।'
                : 'This Puja has been closely associated with the Brahman Goswami community of Brahman Para. There is no single founder; it is a shared community tradition.'}
            </p>
          </div>

          {/* Card 3: Organizing Committee */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 shadow-sm space-y-4 hover:border-[#D4AF37] transition">
            <div className="w-12 h-12 rounded-xl bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
              <ShieldCheck className="w-6 h-6 text-[#9E1B32] dark:text-[#E5C158]" />
            </div>
            <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? settings.committeeName_bn : settings.committeeName_en}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {isBn
                ? 'বর্তমান সময়ে এই পূজা পরিচালনার সার্বিক দায়িত্বে রয়েছে মহামায়া দুর্গোৎসব সমিতি। সম্পূর্ণ অলাভজনকভাবে সকল কার্যক্রম পরিচালিত হয়।'
                : 'The Puja is organized by the MAHAMAYA Durga Puja Committee, upholding solemnity, hospitality, and cultural values entirely as a non-profit.'}
            </p>
          </div>
        </div>

        {/* Committee Record Transparency Notice */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center text-xs text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {isBn
            ? 'নোট: মন্দিরের বিস্তারিত ঐতিহাসিক বিবরণ, প্রাচীন আলোকচিত্র ও গুরুত্বপূর্ণ মাইলফলক কমিটি কর্তৃক যাচাইয়ের পর সংযোজিত হবে।'
            : 'Note: Detailed historical archives, photographs, and records will be added directly by the committee as verified.'}
        </div>
      </div>
    </section>
  );
};
