import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ExternalLink, Navigation, Compass, AlertCircle, CheckCircle2, Route } from 'lucide-react';

const ALTERNATE_MAP_URL = 'https://maps.app.goo.gl/X52P5RKuM9J54jsl9';

export const VisitSection: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  const visitTips = isBn
    ? [
        'রওনা হওয়ার আগে গুগল ম্যাপে পথ দেখে নিন।',
        'উৎসবকালীন যাতায়াত সংক্রান্ত কমিটির বিজ্ঞপ্তি অনুসরণ করুন।',
        'মন্দির প্রাঙ্গণ পরিষ্কার রাখুন এবং অন্য ভক্তদের সুবিধার কথা ভাবুন।',
      ]
    : [
        'Check your route in Maps before leaving.',
        'Follow committee notices for festival-time travel guidance.',
        'Help keep the temple grounds clean and welcoming for everyone.',
      ];

  return (
    <section id="visit" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <MapPin className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'মন্দির দর্শন ও দিকনির্দেশ' : 'Plan Your Visit'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? settings.visitHeading_bn : settings.visitHeading_en}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans">
            {isBn ? settings.visitIntro_bn : settings.visitIntro_en}
          </p>
        </div>

        <div className="rounded-3xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-9 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 text-xs font-semibold text-[#9E1B32] dark:text-[#E5C158]">
                <Compass className="w-4 h-4" />
                {isBn ? 'ঐতিহাসিক মন্দির' : 'A heritage of devotion'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'পিন্দ্রা দুর্গা মন্দির' : 'Pinrra Durga Mandir'}
              </h3>
              <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300 font-sans">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {isBn ? 'ব্রাহ্মণ পাড়া, পিন্দ্রা' : 'Brahman Para, Pinrra'}
                </p>
                <p>{isBn ? 'মহামায়া দুর্গোৎসব সমিতি' : 'MAHAMAYA Durga Puja Committee'}</p>
                <p className="text-xs text-neutral-500">{isBn ? '২০২৬ সালে ১১৮তম বর্ষ' : '118th year in 2026'}</p>
              </div>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#7A1224] hover:from-[#B81D39] hover:to-[#8E152A] px-5 py-3 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-[#1A0C11]"
              >
                <Navigation className="w-4 h-4 text-[#FFD700]" />
                <span>{isBn ? 'গুগল ম্যাপে পথ দেখুন' : 'Get directions'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            <div className="relative min-h-64 bg-gradient-to-br from-[#2A0B12] via-[#45111B] to-[#160A0E] p-6 sm:p-9 flex flex-col justify-center gap-5 overflow-hidden">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-[#D4AF37]/20" />
              <div aria-hidden="true" className="absolute -right-2 -top-2 h-32 w-32 rounded-full border border-[#D4AF37]/20" />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#FFD700]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#FFE9A6]">{isBn ? 'ম্যাপের লিংক' : 'Choose a map link'}</h4>
                  <p className="text-xs text-neutral-300">{isBn ? 'যে লিংকটি আপনার ডিভাইসে ভালো কাজ করে সেটি ব্যবহার করুন।' : 'Use whichever link works best on your device.'}</p>
                </div>
              </div>
              <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="relative flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <span className="flex items-center gap-2"><Route className="w-4 h-4 text-[#E5C158]" />{isBn ? 'প্রধান ম্যাপ লিংক' : 'Primary map link'}</span>
                <ExternalLink className="w-4 h-4 shrink-0 text-[#E5C158]" />
              </a>
              <a href={ALTERNATE_MAP_URL} target="_blank" rel="noopener noreferrer" className="relative flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <span className="flex items-center gap-2"><Compass className="w-4 h-4 text-[#E5C158]" />{isBn ? 'বিকল্প ম্যাপ লিংক' : 'Alternative map link'}</span>
                <ExternalLink className="w-4 h-4 shrink-0 text-[#E5C158]" />
              </a>
            </div>
          </div>

          <div className="border-t border-[#D4AF37]/20 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-6">
            <div>
              <h4 className="text-lg font-bold text-[#4A0E17] dark:text-[#FFE9A6]">{isBn ? 'দর্শনের আগে মনে রাখুন' : 'A few helpful reminders'}</h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{isBn ? 'সবার জন্য সুন্দর ও স্বাচ্ছন্দ্যময় দর্শন নিশ্চিত করতে ছোট কিছু কথা।' : 'A few small steps can make the visit smoother for everyone.'}</p>
            </div>
            <ul className="space-y-3">
              {visitTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B] dark:text-[#E5C158]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 sm:p-5 text-sm text-neutral-600 dark:text-neutral-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B8860B] dark:text-[#D4AF37]" />
          <p className="leading-relaxed">
            {isBn
              ? 'পথনির্দেশ ও উৎসবকালীন যানবাহন চলাচলের নির্দিষ্ট নির্দেশনা কমিটি কর্তৃক বিজ্ঞপ্তি ফলকে জানানো হবে।'
              : 'Specific route advisories and festival-time traffic guidance will be shared by the committee through official notices.'}
          </p>
        </div>
      </div>
    </section>
  );
};
