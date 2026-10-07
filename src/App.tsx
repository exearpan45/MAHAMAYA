/**
 * Pinrra Durga Mandir — Official Website
 * Celebrating 118 Years in 2026
 * MAHAMAYA Durga Puja Committee • Brahman Para
 */

import React from 'react';
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
import { HistorySection } from './components/HistorySection';
import { VisitSection } from './components/VisitSection';
import { Footer } from './components/Footer';

// Modals & Panels
import { AuthModal } from './components/AuthModal';
import { UploadModal } from './components/UploadModal';
import { SearchModal } from './components/SearchModal';
import { DownloadCalendarModal } from './components/DownloadCalendarModal';
import { PolicyModals } from './components/PolicyModals';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/Admin/AdminDashboard';

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
      <div className="absolute inset-0 bg-[#FDFBF7]/80 backdrop-blur-[2px] transition-colors duration-200 dark:hidden" />
      {/* Dark mode sacred deep velvet veil */}
      <div className="absolute inset-0 hidden dark:block bg-[#12080B]/85 backdrop-blur-[2px] transition-colors duration-200" />
      {/* Sacred golden atmospheric vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0.18)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { hasChosenLanguage, activeView } = useApp();

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
          <Header />
          <AdminDashboard />
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
          <Header />
          <UserProfile />
          <Footer />
          <UploadModal />
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
        <Header />
        <main id="main-content">
          <Hero />
          <HeritageSection />
          <Countdown />
          <PujaCalendar />
          <AboutMahamaya />
          <FourDayExperience />
          <EventsSection />
          <CulturalPrograms />
          <Announcements />
          <GallerySection />
          <HistorySection />
          <VisitSection />
        </main>
        <Footer />

        {/* Global Modals */}
        <AuthModal />
        <UploadModal />
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
