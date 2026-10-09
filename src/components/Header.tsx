import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  Search,
  Menu,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon,
  History,
  Bell,
  Info,
  Film,
  AlertTriangle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    isAudioPlaying,
    toggleAudio,
    setSearchModalOpen,
    setActiveView,
    activeView,
    settings,
    announcements,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dismissedNoticeId, setDismissedNoticeId] = useState<string | null>(null);
  const [showFloatingMusic, setShowFloatingMusic] = useState(() => typeof window === 'undefined' || window.scrollY <= 500);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const shouldShow = window.scrollY <= 500;
      setShowFloatingMusic((current) => current === shouldShow ? current : shouldShow);
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  const isBn = language === 'bn';
  const now = Date.now();
  const topNotice = announcements
    .filter((notice) => notice.active && notice.showInTopBanner && (!notice.expiresAt || new Date(notice.expiresAt).getTime() > now))
    .sort((a, b) => {
      const rank = { Urgent: 0, Important: 1, Normal: 2 };
      return rank[a.priority] - rank[b.priority] || b.date.localeCompare(a.date);
    })[0];
  const noticeId = topNotice?.id || 'site-settings-banner';
  const showTopNotice = (topNotice || settings.topBannerEnabled) && dismissedNoticeId !== noticeId;

  const navItems = [
    { id: 'home', label: isBn ? 'নীড়পাতা' : 'Home', icon: Sparkles },
    { id: 'about', label: isBn ? 'মহামায়া' : 'About', icon: Info },
    { id: 'puja', label: isBn ? 'পূজা পঞ্জিকা' : 'Puja', icon: Calendar },
    { id: 'events', label: isBn ? 'অনুষ্ঠান ও ভোগ' : 'Events', icon: Calendar },
    { id: 'gallery', label: isBn ? 'চিত্রশালা' : 'Gallery', icon: ImageIcon },
    { id: 'videos', label: isBn ? 'ভিডিও' : 'Videos', icon: Film },
    { id: 'history', label: isBn ? '১১৮ বছরের ইতিহাস' : 'History', icon: History },
    { id: 'announcements', label: isBn ? 'বিজ্ঞপ্তি' : 'Notices', icon: Bell },
    { id: 'visit', label: isBn ? 'মানচিত্র ও দর্শন' : 'Visit', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);

    if (id === 'admin' || id === 'profile') {
      setActiveView(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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
    }
  };

  return (
    <>
      {/* Dismissible, admin-managed notice banner */}
      {showTopNotice && (
        <div
          role={topNotice?.priority === 'Urgent' ? 'alert' : 'status'}
          className={`text-xs py-2 px-3 sm:px-4 text-center border-b shadow-inner flex items-center justify-center gap-2 ${
            topNotice?.priority === 'Urgent'
              ? 'bg-rose-950 text-rose-50 border-rose-400/40'
              : topNotice?.priority === 'Important'
                ? 'bg-amber-100 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100 border-amber-500/30'
                : 'bg-gradient-to-r from-[#800020] via-[#9E1B32] to-[#800020] text-amber-100 border-amber-500/20'
          }`}
        >
          {topNotice?.priority === 'Urgent'
            ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            : <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <span className="font-bengali font-medium min-w-0">
            {topNotice
              ? `${isBn ? topNotice.title_bn : topNotice.title_en}${(isBn ? topNotice.description_bn : topNotice.description_en) ? ` · ${isBn ? topNotice.description_bn : topNotice.description_en}` : ''}`
              : (isBn ? settings.topBannerText_bn : settings.topBannerText_en)}
          </span>
          <button
            type="button"
            onClick={() => setDismissedNoticeId(noticeId)}
            aria-label={isBn ? 'বিজ্ঞপ্তি বন্ধ করুন' : 'Dismiss notice'}
            title={isBn ? 'বন্ধ করুন' : 'Dismiss'}
            className="shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-current"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#150A0E]/90 backdrop-blur-md border-b border-[#D4AF37]/25 dark:border-[#D4AF37]/20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo / Temple Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer min-w-0 flex-1"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#9E1B32] to-[#E56717] shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
              <div className="w-full h-full rounded-full bg-[#380B13] flex items-center justify-center border border-[#D4AF37]/50">
                <span className="text-xl font-serif font-bold text-[#E5C158] select-none">মা</span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] leading-tight">
                  {isBn ? 'পিন্দ্রা দুর্গা মন্দির' : 'Pinrra Durga Mandir'}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider text-[#9E1B32] dark:text-[#E5C158] bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 px-2 py-0.5 rounded">
                  ১১৮ বর্ষ
                </span>
              </div>
              <p className="text-[11px] font-sans text-neutral-600 dark:text-neutral-400 font-medium truncate max-w-[210px] sm:max-w-xs">
                {isBn ? 'মহামায়া দুর্গোৎসব সমিতি' : 'MAHAMAYA Durga Puja Committee'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#9E1B32] dark:text-[#E5C158] bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-[#9E1B32] dark:hover:text-[#E5C158]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search website"
              className="hidden sm:inline-flex p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-[#9E1B32] dark:hover:text-[#E5C158] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={isBn ? 'অনুসন্ধান করুন' : 'Search Website'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Audio Ambient Toggle (OFF by default) */}
            <button
              onClick={toggleAudio}
              aria-label={isAudioPlaying ? 'Turn music off' : 'Turn devotional music on'}
              className={`hidden sm:inline-flex p-2 rounded-lg transition-colors cursor-pointer relative ${
                isAudioPlaying
                  ? 'text-[#9E1B32] dark:text-[#E5C158] bg-[#9E1B32]/15 dark:bg-[#E5C158]/15'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={
                isAudioPlaying
                  ? isBn
                    ? 'আবহ সঙ্গীত বন্ধ করুন'
                    : 'Pause Devotional Music'
                  : isBn
                  ? 'ভক্তিপূর্ণ আবহ সঙ্গীত চালান'
                  : 'Play Devotional Ambient Sound'
              }
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </>
              ) : (
                <VolumeX className="w-4 h-4 opacity-70" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-[#D4AF37]/35 p-0.5 text-xs bg-neutral-100/80 dark:bg-neutral-900/80">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded font-bengali font-semibold transition-colors cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#9E1B32] text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-sans font-semibold transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#9E1B32] text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                EN
              </button>
            </div>


            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] dark:bg-[#1A0C11] border-b border-[#D4AF37]/30 px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                {isBn ? 'অনুসন্ধান' : 'Search'}
              </button>

              <button
                onClick={toggleAudio}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isAudioPlaying
                    ? 'text-[#9E1B32] dark:text-[#E5C158] bg-[#9E1B32]/15 dark:bg-[#E5C158]/15'
                    : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {isAudioPlaying ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                {isAudioPlaying
                  ? (isBn ? 'সঙ্গীত বন্ধ' : 'Music Off')
                  : (isBn ? 'সঙ্গীত চালু' : 'Music On')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#9E1B32] dark:text-[#E5C158] bg-[#9E1B32]/15 dark:bg-[#E5C158]/15 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
           </div>
        )}
      </header>

      {/* Keep music control at the top; let Return to Top take its place while scrolling */}
      {showFloatingMusic && <button
        type="button"
        onClick={toggleAudio}
        aria-label={isAudioPlaying ? (isBn ? 'ভক্তিমূলক সঙ্গীত বন্ধ করুন' : 'Turn devotional music off') : (isBn ? 'ভক্তিমূলক সঙ্গীত চালু করুন' : 'Turn devotional music on')}
        aria-pressed={isAudioPlaying}
        title={isAudioPlaying ? (isBn ? 'সঙ্গীত বন্ধ করুন' : 'Turn music off') : (isBn ? 'সঙ্গীত চালু করুন' : 'Play devotional music')}
        className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[60] inline-flex items-center gap-2 rounded-full border px-4 py-3 shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-[#16090E] cursor-pointer ${isAudioPlaying ? 'border-emerald-400/70 bg-[#174B35] text-white hover:bg-[#205C42]' : 'border-[#F0D77A] bg-[#9E1B32] text-white hover:bg-[#7F1426]'}`}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          {isAudioPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          {isAudioPlaying && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-[#174B35]" />}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-bold">{isAudioPlaying ? (isBn ? 'সঙ্গীত চলছে' : 'Music Playing') : (isBn ? 'পূজার সঙ্গীত' : 'Puja Music')}</span>
          <span className="mt-0.5 text-[10px] opacity-85">{isAudioPlaying ? (isBn ? 'বন্ধ করতে চাপুন' : 'Tap to turn off') : (isBn ? 'শুনতে চাপুন' : 'Tap to listen')}</span>
        </span>
      </button>}
    </>
  );
};
