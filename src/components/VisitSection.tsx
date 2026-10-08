import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ExternalLink, Navigation, Compass, AlertCircle } from 'lucide-react';

export const VisitSection: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="visit" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <MapPin className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'মন্দির দর্শন ও দিকনির্দেশ' : 'Temple Location'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? settings.visitHeading_bn : settings.visitHeading_en}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans">
            {isBn ? settings.visitIntro_bn : settings.visitIntro_en}
          </p>
        </div>

        {/* Location Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Address & Identity Details */}
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 text-xs font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider">
                {isBn ? 'ঐতিহাসিক মন্দির' : 'Sanctuary of Mahamaya'}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'পিন্দ্রা দুর্গা মন্দির' : 'Pinrra Durga Mandir'}
              </h3>

              <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300 font-sans">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {isBn ? 'ব্রাহ্মণ পাড়া, পিন্দ্রা' : 'Brahman Para, Pinrra'}
                </p>
                <p>
                  {isBn ? 'মহামায়া দুর্গোৎসব সমিতি' : 'Organized by MAHAMAYA Durga Puja Committee'}
                </p>
                <p className="text-xs text-neutral-500">
                  {isBn ? '১১৮ বছরের ঐতিহ্যবাহী পূজা' : '118 Years Continuous Puja Heritage'}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#7A1224] hover:from-[#B81D39] hover:to-[#8E152A] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#FFD700]" />
                  <span>{isBn ? 'গুগল ম্যাপে দেখুন (Open in Google Maps)' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Visual Location Frame with direct map trigger */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-neutral-900 aspect-video flex flex-col items-center justify-center p-6 text-center text-white space-y-3 group shadow-inner">
              <div className="w-14 h-14 rounded-full bg-[#9E1B32]/30 border border-[#D4AF37]/50 flex items-center justify-center text-[#FFD700] group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>

              <p className="text-base font-bold font-bengali text-[#FFD700]">
                {isBn ? 'সরাসরি গুগল ম্যাপে স্থান দর্শন' : 'View Location on Google Maps'}
              </p>

              <p className="text-xs text-neutral-300 max-w-xs font-sans">
                {isBn
                  ? 'গুগল ম্যাপস অ্যাপ্লিকেশনের মাধ্যমে নির্ভুল নেভিগেশন ও রুট খুঁজুন।'
                  : 'Tap to get accurate GPS turn-by-turn directions directly in your maps app.'}
              </p>

              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs font-medium text-[#FFD700] underline flex items-center gap-1"
              >
                <span>maps.app.goo.gl/w5C1sACBhUxz5t1w6</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Committee Note on Directions */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
            <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="font-bengali leading-relaxed">
              {isBn
                ? 'পথনির্দেশ ও উৎসবকালীন যানবাহন চলাচলের নির্দিষ্ট নির্দেশনা কমিটি কর্তৃক নিকটবর্তী সময়ে বিজ্ঞপ্তি ফলকে জানানো হবে।'
                : 'Specific route advisories and festive traffic guidelines will be updated on the notice board by the committee.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
