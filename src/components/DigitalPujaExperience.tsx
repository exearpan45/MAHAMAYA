import React from 'react';
import { useApp } from '../context/AppContext';
import { Flower2, Heart, Sparkles } from 'lucide-react';

export const DigitalPujaExperience: React.FC = () => {
  const { language } = useApp();
  const isBn = language === 'bn';
  return (
    <section id="digital-puja" className="py-16 sm:py-20 bg-[#FFF9EF]/90 dark:bg-[#16090E]/90">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#8B172B] dark:text-[#E5C158]">
            <Sparkles className="h-4 w-4" />
            {isBn ? 'ভক্তি ও ঐতিহ্য' : 'Devotion & Heritage'}
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#4A0E17] dark:text-[#FBF6EF] sm:text-4xl">
            {isBn ? 'ডিজিটাল পূজা অভিজ্ঞতা' : 'A Digital Puja Experience'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
            {isBn ? 'মা দুর্গার আরাধনা শক্তি, সাহস, মমতা ও শুভের জয়কে স্মরণ করায়। পিন্দ্রা দুর্গা মন্দিরের ঐতিহ্য ও সম্প্রদায়ের সঙ্গে এই পবিত্র সময় ভাগ করে নিন।' : 'Durga Puja celebrates courage, compassion, renewal, and the triumph of good. Share this sacred season through the heritage and community of Pinrra Durga Mandir.'}
          </p>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#D4AF37]/35 bg-white/80 p-5 text-center dark:bg-[#211016]/80">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#9E1B32]/10 text-[#9E1B32] dark:bg-[#D4AF37]/10 dark:text-[#E5C158]"><Flower2 className="h-5 w-5" /></div>
            <h3 className="mt-3 font-bold text-[#4A0E17] dark:text-[#FBF6EF]">{isBn ? 'ভক্তি' : 'Devotion'}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{isBn ? 'প্রার্থনা, কৃতজ্ঞতা ও অন্তরের শান্তির সময়।' : 'A moment for prayer, gratitude, and inner peace.'}</p>
          </article>
          <article className="rounded-2xl border border-[#D4AF37]/35 bg-white/80 p-5 text-center dark:bg-[#211016]/80">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#9E1B32]/10 text-[#9E1B32] dark:bg-[#D4AF37]/10 dark:text-[#E5C158]"><Heart className="h-5 w-5" /></div>
            <h3 className="mt-3 font-bold text-[#4A0E17] dark:text-[#FBF6EF]">{isBn ? 'সম্প্রদায়' : 'Community'}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{isBn ? 'একসঙ্গে উদ্‌যাপন, ভাগ করে নেওয়া ও পাশে থাকার আনন্দ।' : 'The joy of celebrating, sharing, and caring for one another.'}</p>
          </article>
          <article className="rounded-2xl border border-[#D4AF37]/35 bg-white/80 p-5 text-center dark:bg-[#211016]/80">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#9E1B32]/10 text-[#9E1B32] dark:bg-[#D4AF37]/10 dark:text-[#E5C158]"><Sparkles className="h-5 w-5" /></div>
            <h3 className="mt-3 font-bold text-[#4A0E17] dark:text-[#FBF6EF]">{isBn ? 'নতুন সূচনা' : 'Renewal'}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{isBn ? 'আশা, সাহস ও শুভের পথে এগিয়ে চলার অনুপ্রেরণা।' : 'Inspiration to move forward with hope, courage, and goodness.'}</p>
          </article>
        </div>
        <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">{isBn ? 'শব্দ স্বয়ংক্রিয়ভাবে চালু হয় না।' : 'No audio plays automatically.'}</p>
      </div>
    </section>
  );
};
