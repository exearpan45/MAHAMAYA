import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MapPin,
  ExternalLink,
  Shield,
  Heart,
  Globe,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    settings,
    setActiveView,
    setActivePolicyModal,
    currentPujaYear,
  } = useApp();

  const isBn = language === 'bn';

  const handleNavClick = (id: string) => {
    setActiveView('home');
    setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 60);
  };

  return (
    <footer className="bg-[#140609] text-neutral-300 border-t border-[#D4AF37]/30 pt-16 pb-12 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Temple Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#9E1B32] to-[#E56717] shrink-0">
                <div className="w-full h-full rounded-full bg-[#1A0B10] flex items-center justify-center border border-[#D4AF37]/40">
                  <span className="text-lg font-serif font-bold text-[#D4AF37]">মা</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold font-bengali text-white leading-tight">
                  {settings.templeName_bn}
                </h3>
                <p className="text-xs font-display text-[#E5C158] font-semibold">
                  {settings.templeName_en}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              {isBn
                ? 'ব্রাহ্মণ পাড়ার ব্রাহ্মণ গোস্বামী সম্প্রদায়ের ঐতিহ্যবাহী শারদোৎসব। ১৯০৮ সাল থেকে নিরবচ্ছিন্ন ভক্তি ও সৌহার্দ্যের ১১৮তম বর্ষ।'
                : 'Historic community Durga Puja associated with the Brahman Goswami community of Brahman Para, celebrating 118 years in 2026.'}
            </p>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#FFD700] bg-[#220B13] px-3 py-1 rounded-md border border-[#D4AF37]/30">
              <Sparkles className="w-3 h-3 text-[#E56717]" />
              <span>{settings.committeeName_bn}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] border-b border-neutral-800 pb-2">
              {isBn ? 'ওয়েবসাইট সূচি' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'নীড়পাতা' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('puja')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? '২০২৬ পূজা পঞ্জিকা' : '2026 Puja Schedule'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'মহামায়া স্বরূপ' : 'About Maa Durga'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('events')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'অনুষ্ঠান ও ভোগ' : 'Events & Bhog'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'চিত্রশালা' : 'Gallery'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('history')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? '১১৮ বছরের ইতিহাস' : '118 Years History'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Non-Profit & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] border-b border-neutral-800 pb-2">
              {isBn ? 'নীতিমালা ও অলাভজনক পরিচয়' : 'Non-Profit & Policies'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'ব্যবহারের শর্তাবলী (Terms of Use)' : 'Terms of Use'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('disclaimer')}
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'দায়মুক্তি বিবৃতি (Disclaimer)' : 'Disclaimer'}
                </button>
              </li>
              <li>
                <button
                  className="hover:text-[#FFD700] transition cursor-pointer"
                >
                  {isBn ? 'কমিউনিটি আপলোড নীতি' : 'Community Upload Policy'}
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-neutral-400 bg-[#1D090E] p-2.5 rounded-lg border border-[#D4AF37]/20 flex items-start gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                {isBn
                  ? 'এই ওয়েবসাইট কোনো অনুদান বা চাঁদা গ্রহণ করে না।'
                  : 'This website does not accept donations or solicit funds.'}
              </span>
            </div>
          </div>

          {/* Col 4: Location & Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] border-b border-neutral-800 pb-2">
              {isBn ? 'অবস্থান ও সেটিংস' : 'Location & Settings'}
            </h4>

            <p className="text-xs text-neutral-400">
              {isBn ? 'পিন্দ্রা দুর্গা মন্দির, ব্রাহ্মণ পাড়া' : 'Pinrra Durga Mandir, Brahman Para'}
            </p>

            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#FFD700] hover:underline"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E56717]" />
              <span>{isBn ? 'গুগল ম্যাপে খুলুন' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="pt-4 flex items-center gap-3">
              {/* Language switcher */}
              <div className="flex items-center rounded-lg border border-[#D4AF37]/30 p-0.5 text-xs bg-neutral-900">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 rounded font-bengali ${
                    language === 'bn' ? 'bg-[#9E1B32] text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded font-sans ${
                    language === 'en' ? 'bg-[#9E1B32] text-white font-bold' : 'text-neutral-400'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-[#D4AF37]/30 text-neutral-400 hover:text-white"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FFD700]" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 text-center sm:text-left">
          <div>
            <p>
              © {currentPujaYear.year} {settings.templeName_bn} • {settings.committeeName_bn}. All rights reserved.
            </p>
            <p className="text-[11px] text-neutral-500 pt-0.5">
              118 Years of Community Durga Puja (1908–2026) • Non-Profit Devotional Portal
            </p>
          </div>

          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span>Built with devotion for the Brahman Para community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
