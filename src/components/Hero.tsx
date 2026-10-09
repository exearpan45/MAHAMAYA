import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, MapPin, ChevronDown, Compass, Camera } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, settings, setRealMaaDurgaPhoto, currentUser } = useApp();
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const canManagePhoto = currentUser && ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role);

  const handleRealPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void setRealMaaDurgaPhoto(file);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FFFDF9] dark:bg-[#180A0E] text-[#4A0E17] dark:text-[#FBF6EE] transition-colors duration-200">
      {/* Background authentic idol image with subtle ambient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroDeityImage}
          alt={isBn ? 'পিন্দ্রা দুর্গা মন্দিরে মা দুর্গার পবিত্র মূল প্রতিমা' : 'Real Maa Durga idol at Pinrra Durga Mandir'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out filter brightness-[0.78] contrast-[1.05] dark:brightness-[0.45] dark:contrast-[1.08]"
        />
        {/* Sacred gradient vignette for light & dark modes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/92 via-[#FFFDF9]/75 to-[#FFFDF9]/88 dark:from-[#12070A] dark:via-[#1A0B10]/70 dark:to-[#12070A]/85 transition-colors duration-200" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14)_0%,transparent_70%)]" />
      </div>

      {/* Real photo attribution & selector badge */}
      {canManagePhoto && <div className="absolute top-4 right-4 z-20">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleRealPhotoUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 text-[#9E1B32] dark:text-amber-200 border border-[#D4AF37]/50 text-[11px] backdrop-blur-md shadow transition cursor-pointer"
          title={isBn ? 'প্রদত্ত মূল প্রতিমার ছবি যুক্ত / পরিবর্তন করুন' : 'Update / Choose Real Temple Photo'}
        >
          <Camera className="w-3.5 h-3.5 text-[#E56717]" />
          <span>{isBn ? 'মূল প্রতিমার ছবি' : 'Real Temple Photo'}</span>
        </button>
      </div>}

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-from-left">
        
        {/* Sacred Sanskrit Invocation / Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-white/90 dark:bg-[#2B0B14]/80 backdrop-blur-sm text-xs sm:text-sm text-[#9E1B32] dark:text-[#E5C158] font-bengali tracking-widest shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E56717] animate-pulse" />
          <span>{isBn ? settings.heroKicker_bn : settings.heroKicker_en}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E56717] animate-pulse" />
        </div>

        {/* Temple Name Headings */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-bengali text-[#4A0E17] dark:text-white tracking-tight leading-tight drop-shadow-sm">
            {isBn ? 'পিন্দ্রা দুর্গা মন্দির' : 'Pinrra Durga Mandir'}
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-display text-[#9E1B32] dark:text-[#E5C158] font-semibold tracking-wide">
            {isBn ? 'Pinrra Durga Mandir' : 'পিন্দ্রা দুর্গা মন্দির'}
          </p>
        </div>

        {/* 118 Years Milestone & Organizing Committee */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1 text-sm sm:text-base font-semibold text-[#9E1B32] dark:text-[#FFD700] border-b border-[#D4AF37]/50 font-serif">
            {isBn
              ? 'শারদোৎসবের ১১৮তম গৌরবময় বর্ষ • ২০২৬'
              : 'Celebrating 118 Years of Durga Puja • 2026'}
          </div>
          
          <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-300 font-medium font-sans">
            {isBn ? 'মহামায়া দুর্গোৎসব সমিতি' : 'MAHAMAYA Durga Puja Committee'}
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans tracking-wide">
            {isBn
              ? 'ব্রাহ্মণ পাড়ার ব্রাহ্মণ গোস্বামী সমাজের দীর্ঘ ঐতিহ্যের অকৃত্রিম সর্বজনীন শারদোৎসব'
              : 'Historic community Durga Puja associated with the Brahman Goswami community of Brahman Para'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('heritage')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#9E1B32] via-[#B81D39] to-[#800020] text-white text-sm font-semibold shadow-xl shadow-[#9E1B32]/30 border border-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            {isBn ? 'পূজা ঐতিহ্য ও পরিক্রমা' : 'Explore Durga Puja'}
          </button>

          <button
            onClick={() => scrollToSection('puja')}
            className="px-5 py-3.5 rounded-xl bg-white/95 dark:bg-[#240E15]/90 hover:bg-neutral-50 dark:hover:bg-[#33141E] text-[#9E1B32] dark:text-[#E5C158] text-sm font-semibold border border-[#D4AF37]/50 shadow-sm transition cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#9E1B32] dark:text-[#E5C158]" />
            <span>{isBn ? '২০২৬ পূজা পঞ্জিকা' : '2026 Puja Schedule'}</span>
          </button>

          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3.5 rounded-xl bg-white/90 dark:bg-[#1A0C11]/80 hover:bg-neutral-50 dark:hover:bg-[#28131B] text-neutral-800 dark:text-neutral-200 text-sm font-medium border border-neutral-300 dark:border-neutral-700/80 shadow-sm transition cursor-pointer flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#E56717]" />
            <span>{isBn ? 'গুগল ম্যাপে অবস্থান' : 'View Location'}</span>
          </a>
        </div>

        {/* Non-Profit Clarification note */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            {isBn
              ? 'অলাভজনক সর্বজনীন ঐতিহ্যবাহী পূজা • কোনো অনুদান ব্যবস্থা নেই'
              : 'Non-Profit Community Durga Puja • No Donation or Monetization'}
          </span>
        </div>

        {/* Down indicator */}
        <div className="pt-8">
          <button
            onClick={() => scrollToSection('heritage')}
            className="text-neutral-400 hover:text-[#E5C158] transition-colors p-2 cursor-pointer"
            aria-label="Scroll down to heritage section"
          >
            <ChevronDown className="w-6 h-6 mx-auto animate-bounce opacity-80" />
          </button>
        </div>
      </div>
    </section>
  );
};
