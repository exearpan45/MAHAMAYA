import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Sun, HeartHandshake } from 'lucide-react';

export const AboutMahamaya: React.FC = () => {
  const { language, settings } = useApp();
  const isBn = language === 'bn';

  return (
    <section id="about" className="py-20 bg-[#F7F2E8]/80 dark:bg-[#12080B]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 border-t border-b border-[#D4AF37]/20 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Sparkles className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'শ্রী শ্রী মহামায়া স্বরূপ' : 'Deity of the Temple'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? settings.aboutHeading_bn : settings.aboutHeading_en}
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-sans">
            {isBn ? settings.aboutIntro_bn : settings.aboutIntro_en}
          </p>
        </div>

        {/* Visual & Contextual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Authentic Pratima Image Feature */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-neutral-900 aspect-[4/3]">
              <img onError={(event) => { if (new URL(event.currentTarget.src).pathname !== '/real_maa_durga.jpg') event.currentTarget.src = '/real_maa_durga.jpg'; }}
                src={settings.heroDeityImage}
                alt={isBn ? 'পিন্দ্রা দুর্গা মন্দিরে মা দুর্গার ডাকের সাজ' : 'Maa Durga Daaker Saaj pratima'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider">
                  {isBn ? 'ডাকের সাজে সপরিবার দেবী প্রতিমা' : 'Traditional Daaker Saaj Pratima'}
                </p>
                <p className="text-[11px] text-neutral-300 font-sans">
                  {isBn ? 'পিন্দ্রা দুর্গা মন্দির, ব্রাহ্মণ পাড়া' : 'Pinrra Durga Mandir, Brahman Para'}
                </p>
              </div>
            </div>
          </div>

          {/* Descriptive Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#E56717]" />
                <span>{isBn ? settings.aboutFamilyHeading_bn : settings.aboutFamilyHeading_en}</span>
              </h3>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                {isBn ? settings.aboutFamilyText_bn : settings.aboutFamilyText_en}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#9E1B32] dark:text-[#E5C158]" />
                <span>{isBn ? settings.aboutCommunityHeading_bn : settings.aboutCommunityHeading_en}</span>
              </h3>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                {isBn ? settings.aboutCommunityText_bn : settings.aboutCommunityText_en}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
