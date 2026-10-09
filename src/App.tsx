/**
 * Pinrra Durga Mandir — Official Website
 * Celebrating 118 Years in 2026
 * MAHAMAYA Durga Puja Committee • Brahman Para
 */

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageGate } from './components/LanguageGate';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HeritageSection } from './components/HeritageSection';
import { Countdown } from './components/Countdown';
import { PujaCalendar } from './components/PujaCalendar';
import { AboutMahamaya } from './components/AboutMahamaya';
import { FourDayExperience } from './components/FourDayExperience';
import { EventsSection } from './components/EventsSection';
import { CulturalPrograms } from './components/CulturalPrograms';
import { Announcements } from './components/Announcements';
import { GallerySection } from './components/GallerySection';
import { VideoGallery } from './components/VideoGallery';
import { HistorySection } from './components/HistorySection';
import { VisitSection } from './components/VisitSection';
import { CommitteeSection } from './components/CommitteeSection';
import { DigitalPujaExperience } from './components/DigitalPujaExperience';
import { Footer } from './components/Footer';

// Modals & Panels
import { SearchModal } from './components/SearchModal';
import { DownloadCalendarModal } from './components/DownloadCalendarModal';
import { PolicyModals } from './components/PolicyModals';
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));

/**
 * Authentic Maa Durga Website Background
 * Features the authentic temple Pratima across the entire site
 * with elegant atmospheric veils for light & dark modes.
 */
const MaaDurgaWebsiteBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Authentic Maa Durga Photo Background */}
      <img
        src="/real_maa_durga.jpg"
        alt=""
        className="w-full h-full object-cover object-center scale-100 transition-opacity duration-700 brightness-[0.92] dark:brightness-[0.35] contrast-[1.05]"
      />
      {/* Light mode sacred warm golden veil to keep all content 100% readable while clearly showing Maa Durga */}
      <div className="absolute inset-0 bg-[#FDFBF7]/80 dark:hidden" />
      {/* Dark mode sacred deep velvet veil */}
      <div className="absolute inset-0 hidden dark:block bg-[#12080B]/85" />
      {/* Sacred golden atmospheric vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0.12)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
};


const ReturnToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { language } = useApp();
  const isBn = language === 'bn';

  useEffect(() => {
    let frame = 0;
    let lastVisible = false;

    const updateVisibility = () => {
      frame = 0;
      const nextVisible = window.scrollY > 500;
      // Avoid scheduling React updates for every scroll event while dragging fast.
      if (nextVisible !== lastVisible) {
        lastVisible = nextVisible;
        setVisible(nextVisible);
      }
    };

    const handleScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateVisibility);
      }
    };

    updateVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={isBn ? 'উপরে ফিরে যান' : 'Return to top'}
      title={isBn ? 'উপরে ফিরে যান' : 'Return to top'}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#380B13]/95 px-3.5 py-2.5 text-xs font-semibold text-[#E5C158] shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#4A0E17] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 sm:bottom-6 sm:right-6"
    >
      <span aria-hidden="true">↑</span>
      <span>{isBn ? 'উপরে' : 'Top'}</span>
    </button>
  );
};

/** Lightweight reading progress indicator. Uses a ref and animation frames
 * so rapid scrollbar dragging does not trigger React re-renders. */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;

      bar.style.transform = `scaleX(${progress})`;
      bar.parentElement?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };

    const handleScrollOrResize = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(handleScrollOrResize)
        : null;
    resizeObserver?.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      resizeObserver?.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#9E1B32] via-[#D4AF37] to-[#FFE9A6] shadow-[0_0_8px_rgba(212,175,55,0.35)] motion-reduce:shadow-none"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
};

const startOpeningAnimation = () => {
  const loader = document.getElementById('site-opening');
  if (!loader) return;

  const finish = () => {
    window.setTimeout(() => {
      loader.classList.add('opening-exit');

      window.setTimeout(() => {
        loader.remove();
      }, 450);
    }, 500);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
  }
};

startOpeningAnimation();

const MainLayout: React.FC = () => {
  const { hasChosenLanguage, activeView, apiError, language, currentUser, setActiveView } = useApp();

  useEffect(() => {
    const lang = language === 'bn' ? 'bn' : 'en';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
  }, [language]);


  // 1. First-time Language Gate Screen
  if (!hasChosenLanguage) {
    return <LanguageGate />;
  }

  // 2. Dedicated Views
  if (activeView === 'admin') {
    return (
      <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <MaaDurgaWebsiteBackground />
        <div className="relative z-10">
          {apiError && <div role="alert" className="fixed top-24 right-4 z-[60] max-w-sm rounded-xl border border-rose-400/40 bg-rose-50 dark:bg-rose-950/90 px-4 py-3 text-xs text-rose-700 dark:text-rose-200 shadow-lg">{apiError}</div>}
          <Header forceEnglish />
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#12080B]/80 px-5 py-4 text-sm text-[#E5C158] shadow-xl backdrop-blur-md">
                  Loading admin panel...
                </div>
              </div>
            }
          >
            <AdminDashboard />
          </Suspense>
          <Footer />
          <PolicyModals />
        </div>
      </div>
    );
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/gallery') {
    return (
      <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <MaaDurgaWebsiteBackground />
        <div className="relative z-10">
          {apiError && <div role="alert" className="fixed top-24 right-4 z-[60] max-w-sm rounded-xl border border-rose-400/40 bg-rose-50 dark:bg-rose-950/90 px-4 py-3 text-xs text-rose-700 dark:text-rose-200 shadow-lg">{apiError}</div>}
          <Header />
          <main id="main-content" tabIndex={-1}>
            <GallerySection />
          </main>
          <Footer />
          <PolicyModals />
        </div>
      </div>
    );
  }

  if (activeView === 'profile') {
    return (
      <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        <MaaDurgaWebsiteBackground />
        <div className="relative z-10">
          {apiError && <div role="alert" className="fixed top-24 right-4 z-[60] max-w-sm rounded-xl border border-rose-400/40 bg-rose-50 dark:bg-rose-950/90 px-4 py-3 text-xs text-rose-700 dark:text-rose-200 shadow-lg">{apiError}</div>}
          <Header />
          <Footer/>
          <PolicyModals />
        </div>
      </div>
    );
  }

  // 3. Main Landing Experience
  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <MaaDurgaWebsiteBackground />
      <div className="relative z-10">
        {apiError && <div role="alert" className="fixed top-24 right-4 z-[60] max-w-sm rounded-xl border border-rose-400/40 bg-rose-50 dark:bg-rose-950/90 px-4 py-3 text-xs text-rose-700 dark:text-rose-200 shadow-lg">{apiError}</div>}
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg border border-[#D4AF37]/50 bg-[#12080B] px-4 py-3 text-sm font-semibold text-[#FFE9A6] shadow-xl transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          {language === 'bn' ? 'মূল বিষয়বস্তুতে যান' : 'Skip to main content'}
        </a>
        <ScrollProgress />
        <Header />
        {currentUser && ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role) && (
          <div role="status" className="relative z-20 mx-auto mt-3 flex max-w-7xl flex-col gap-2 rounded-2xl border border-amber-400/50 bg-[#FFF8E8] px-4 py-3 text-sm text-[#6B3D00] shadow-md dark:bg-[#2A160A] dark:text-[#F6D98B] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong>{language === 'bn' ? 'অ্যাডমিন প্রিভিউ মোড' : 'Admin Preview Mode'}</strong>
              <span className="ml-1">{language === 'bn' ? 'আপনি সম্পাদকের বর্তমান খসড়া দেখছেন। এটি এখনও লাইভে প্রকাশিত হয়নি।' : 'You are viewing the current editor draft. These changes are not live yet.'}</span>
            </div>
            <button type="button" onClick={() => setActiveView('admin')} className="shrink-0 rounded-xl bg-[#9E1B32] px-4 py-2 text-xs font-bold text-white hover:bg-[#7F1528] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              {language === 'bn' ? 'অ্যাডমিনে ফিরুন' : 'Return to Admin'}
            </button>
          </div>
        )}
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <HeritageSection />
          <Countdown />
          <PujaCalendar />
          <AboutMahamaya />
          <DigitalPujaExperience />
          <FourDayExperience />
          <EventsSection />
          <CulturalPrograms />
          <Announcements />
          <GallerySection />
          <VideoGallery />
          <HistorySection />
          <VisitSection />
          <CommitteeSection />
        </main>
        <Footer />
        <ReturnToTop />

        {/* Global Modals */}
        <SearchModal />
        <DownloadCalendarModal />
        <PolicyModals />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
