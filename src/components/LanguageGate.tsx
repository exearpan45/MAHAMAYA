import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Sparkles, Compass } from 'lucide-react';

export const LanguageGate: React.FC = () => {
  const { setLanguage, setHasChosenLanguage } = useApp();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setHasChosenLanguage(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#180B0F] text-[#FBF6EE] px-4 overflow-hidden selection:bg-[#9E1B32] selection:text-white">
      {/* Background authentic idol image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/real_maa_durga.jpg"
          alt="Maa Durga Pratima"
          className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0508]/95 via-[#180B0F]/85 to-[#0F0508]/90" />
      </div>

      {/* Subtle traditional aura backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(158,27,50,0.28)_0%,rgba(15,6,8,0.95)_75%)] pointer-events-none" />

      {/* Decorative auspicious border frame */}
      <div className="relative max-w-lg w-full bg-[#200D13]/90 backdrop-blur-md border border-[#D4AF37]/35 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Sacred Sanskrit Inscription */}
        <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#D4AF37] uppercase font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#E56717] animate-pulse" />
          <span>॥ শ্রী শ্রী দুর্গায়ৈ নমঃ ॥</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E56717] animate-pulse" />
        </div>

        {/* Deity Emblem and Mandir Names */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#C41E3A] to-[#E56717] shadow-lg shadow-[#9E1B32]/40">
            <div className="w-full h-full rounded-full bg-[#180B0F] flex items-center justify-center border border-[#D4AF37]/40">
              <span className="text-2xl font-serif font-bold text-[#D4AF37] select-none">মা</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FBF6EE] font-bengali tracking-tight pt-2">
            পিন্দ্রা দুর্গা মন্দির
          </h1>
          <p className="text-xl sm:text-2xl font-display tracking-wide text-[#E5C158] font-semibold">
            Pinrra Durga Mandir
          </p>

          <p className="text-xs uppercase tracking-widest text-[#D4AF37]/90 pt-1">
            MAHAMAYA Durga Puja Committee • 118 Years
          </p>
        </div>

        {/* Language Selection Prompt */}
        <div className="pt-2 space-y-2 border-t border-[#D4AF37]/20">
          <p className="text-sm text-[#FBF6EE]/80 font-bengali">
            অনুগ্রহ করে আপনার ভাষা নির্বাচন করুন
          </p>
          <p className="text-xs text-[#FBF6EE]/60 font-sans tracking-wide">
            Please choose your language to enter
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => handleSelect('bn')}
            className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-[#9E1B32] to-[#731222] hover:from-[#B51E39] hover:to-[#851528] text-white border border-[#D4AF37]/40 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <span className="text-2xl font-bold font-bengali text-[#FFF9F0]">বাংলা</span>
            <span className="text-[11px] text-[#D4AF37] font-medium mt-1">প্রবেশ করুন</span>
          </button>

          <button
            onClick={() => handleSelect('en')}
            className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-[#2D121A] hover:bg-[#3D1823] text-white border border-[#D4AF37]/40 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <span className="text-2xl font-bold font-sans text-[#FFF9F0]">English</span>
            <span className="text-[11px] text-[#D4AF37] font-medium mt-1">Enter Website</span>
          </button>
        </div>

        {/* Non-Profit Badge */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#FBF6EE]/60">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Non-Profit Community Durga Puja • Brahman Para</span>
        </div>
      </div>
    </div>
  );
};
