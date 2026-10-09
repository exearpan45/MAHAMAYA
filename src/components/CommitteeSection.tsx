import React from 'react';
import { useApp } from '../context/AppContext';
import { UsersRound, HeartHandshake, CalendarDays, Sparkles } from 'lucide-react';

export const CommitteeSection: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  const values = isBn
    ? [
        { icon: HeartHandshake, title: 'সেবা ও ভক্তি', text: 'মায়ের পূজা ও ভক্তদের অভ্যর্থনায় আন্তরিকতা।' },
        { icon: UsersRound, title: 'সম্মিলিত উদ্যোগ', text: 'স্থানীয় মানুষের অংশগ্রহণে ঐতিহ্যকে এগিয়ে নেওয়া।' },
        { icon: CalendarDays, title: 'উৎসবের আয়োজন', text: 'পূজা, সাংস্কৃতিক অনুষ্ঠান ও প্রয়োজনীয় বিজ্ঞপ্তির সমন্বয়।' },
      ]
    : [
        { icon: HeartHandshake, title: 'Service & devotion', text: 'Welcoming devotees with care and helping preserve the spirit of worship.' },
        { icon: UsersRound, title: 'Community effort', text: 'Keeping a shared local tradition alive through collective participation.' },
        { icon: CalendarDays, title: 'Festival coordination', text: 'Bringing puja observances, cultural programmes, and useful notices together.' },
      ];

  return (
    <section id="committee" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 backdrop-blur-[1px]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9E1B32] dark:text-[#E5C158]">
            <UsersRound className="h-4 w-4" />
            {isBn ? 'আমাদের সমিতি' : 'The people behind the Puja'}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#4A0E17] dark:text-[#FBF6EF] sm:text-4xl md:text-5xl">
            {isBn ? 'মহামায়া দুর্গোৎসব সমিতি' : settings.committeeName_en}
          </h2>
          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300 sm:text-base">
            {isBn
              ? 'পিন্দ্রা দুর্গা মন্দিরের ঐতিহ্য, ভক্তি ও সাম্প্রদায়িক সম্প্রীতি ধরে রাখতে সমিতি ও স্থানীয় মানুষের সম্মিলিত উদ্যোগ।'
              : 'A community-led effort to preserve the heritage of Pinrra Durga Mandir and bring people together through devotion, service, and celebration.'}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/35 bg-[#FFFDF9] p-6 shadow-xl dark:bg-[#1A0C11] sm:p-9">
          <div aria-hidden="true" className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-[#D4AF37]/20" />
          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#9E1B32]/10 text-[#9E1B32] dark:bg-[#D4AF37]/10 dark:text-[#E5C158]">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#4A0E17] dark:text-[#FFE9A6]">
              {isBn ? settings.committeeName_bn : settings.committeeName_en}
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              {isBn
                ? 'সকলের সহযোগিতা, দায়িত্ববোধ ও আন্তরিকতায় শারদোৎসব সুন্দরভাবে উদযাপিত হয়।'
                : 'The festival is made possible by shared responsibility, local participation, and the goodwill of the community.'}
            </p>
          </div>

          <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[#D4AF37]/20 bg-white/70 p-5 dark:bg-black/15">
                <Icon className="mb-3 h-5 w-5 text-[#B8860B] dark:text-[#E5C158]" />
                <h4 className="font-bold text-[#4A0E17] dark:text-[#FFE9A6]">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-neutral-500">
            {isBn ? 'কমিটির সদস্যদের নাম ও দায়িত্ব আনুষ্ঠানিকভাবে নিশ্চিত হলে এখানে প্রকাশ করা যাবে।' : 'Individual committee names and roles can be added once officially confirmed.'}
          </p>
        </div>
      </div>
    </section>
  );
};
