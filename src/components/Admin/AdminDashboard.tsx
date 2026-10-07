import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CalendarDays,
  Music,
  Bell,
  Image as ImageIcon,
  History,
  Users,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Shield,
  ArrowLeft,
  Sparkles,
  LogOut,
} from 'lucide-react';
import {
  UserRole,
  EventCategory,
  EventStatus,
  AnnouncementPriority,
  GalleryCategory,
  PujaDay,
  PujaYear,
  EventItem,
  Announcement,
  HistoryMilestone,
  CulturalProgramItem,
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    currentUser,
    setActiveView,
    settings,
    updateSettings,
    setRealMaaDurgaPhoto,
    pujaYears,
    currentPujaYear,
    updatePujaYear,
    addPujaYear,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    gallery,
    deleteGalleryPhoto,
    toggleFeaturePhoto,
    historyMilestones,
    addHistoryMilestone,
    deleteHistoryMilestone,
    culturalPrograms,
    addCulturalProgram,
    deleteCulturalProgram,
    users,
    updateUserRole,
    exportDataJSON,
    importDataJSON,
    resetToDefault,
    logout,
  } = useApp();

  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'calendar'
    | 'countdown'
    | 'events'
    | 'cultural'
    | 'announcements'
    | 'gallery'
    | 'history'
    | 'users'
    | 'settings'
  >('overview');

  // Verify access: Normal users are strictly blocked
  if (!currentUser || currentUser.role === 'USER') {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <Shield className="w-12 h-12 mx-auto text-rose-500" />
        <h2 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
          {isBn ? 'অননুমোদিত প্রবেশ' : 'Unauthorized Access'}
        </h2>
        <p className="text-xs text-neutral-500">
          {isBn
            ? 'শুধুমাত্র অনুমোদিত কমিটি অ্যাডমিনিস্ট্রেটরদের এই প্যানেলে প্রবেশাধিকার রয়েছে।'
            : 'Only approved temple committee administrators may access this management console.'}
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#9E1B32] text-white"
        >
          {isBn ? 'নীড়পাতায় ফিরুন' : 'Return to Website'}
        </button>
      </div>
    );
  }

  // State for new Event form
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-18');
  const [newEventStartTime, setNewEventStartTime] = useState('09:00 AM');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('Durga Puja');
  const [newEventDesc, setNewEventDesc] = useState('');

  // State for new Announcement form
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnDesc, setNewAnnDesc] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<AnnouncementPriority>('Normal');

  // State for new Milestone form
  const [newHistYear, setNewHistYear] = useState('');
  const [newHistTitle, setNewHistTitle] = useState('');
  const [newHistDesc, setNewHistDesc] = useState('');

  // State for new Cultural Program form
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newProgPerformer, setNewProgPerformer] = useState('');
  const [newProgDate, setNewProgDate] = useState('2026-10-18');
  const [newProgTime, setNewProgTime] = useState('06:30 PM');

  // JSON Import notification
  const [importNotice, setImportNotice] = useState('');

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pinrra-durga-mandir-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportNotice(isBn ? 'সফলভাবে ডেটা রিস্টোর করা হয়েছে!' : 'Data restored successfully!');
      } else {
        setImportNotice(isBn ? 'ভুল ফরম্যাট! ব্যাকআপ ফাইলটি সঠিক নয়।' : 'Invalid backup JSON file.');
      }
      setTimeout(() => setImportNotice(''), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#12080B] text-neutral-900 dark:text-neutral-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-[#9E1B32]/15 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
              title={isBn ? 'ওয়েবসাইটে ফিরুন' : 'Back to Website'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#9E1B32] dark:text-[#E5C158]" />
                <h1 className="text-xl sm:text-2xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                  {isBn ? 'মন্দির কমিটি অ্যাডমিন পোর্টাল' : 'Temple Administration Portal'}
                </h1>
              </div>
              <p className="text-xs text-neutral-500">
                {currentUser.name} • <span className="font-semibold text-[#9E1B32] dark:text-[#E5C158]">{currentUser.role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? 'ব্যাকআপ JSON' : 'Export JSON'}</span>
            </button>

            <button
              onClick={() => {
                logout();
                setActiveView('home');
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 bg-rose-50/90 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title={isBn ? 'লগআউট করুন' : 'Log Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগআউট' : 'Log Out'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { id: 'overview', label_bn: 'সারসংক্ষেপ', label_en: 'Overview', icon: LayoutDashboard },
            { id: 'calendar', label_bn: 'পূজা পঞ্জিকা', label_en: 'Puja Calendar', icon: Calendar },
            { id: 'countdown', label_bn: 'কাউন্টডাউন ও বছর', label_en: 'Countdown & Year', icon: Clock },
            { id: 'events', label_bn: 'অনুষ্ঠান ও ভোগ', label_en: 'Events & Bhog', icon: CalendarDays },
            { id: 'cultural', label_bn: 'সাংস্কৃতিক সন্ধ্যা', label_en: 'Cultural Programs', icon: Music },
            { id: 'announcements', label_bn: 'বিজ্ঞপ্তি ফলক', label_en: 'Notices', icon: Bell },
            { id: 'gallery', label_bn: 'চিত্রশালা নিয়ন্ত্রণ', label_en: 'Gallery Moderation', icon: ImageIcon },
            { id: 'history', label_bn: 'ইতিহাস ও মাইলফলক', label_en: 'History', icon: History },
            { id: 'users', label_bn: 'ব্যবহারকারী ও রোল', label_en: 'Users & Roles', icon: Users },
            { id: 'settings', label_bn: 'ওয়েবসাইট সেটিংস', label_en: 'Site Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-[#9E1B32] text-white shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{isBn ? tab.label_bn : tab.label_en}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-1">
                <span className="text-xs text-neutral-500 font-sans">{isBn ? 'নিবন্ধিত ভক্ত' : 'Registered Users'}</span>
                <p className="text-2xl font-bold font-mono text-[#9E1B32] dark:text-[#E5C158]">{users.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-1">
                <span className="text-xs text-neutral-500 font-sans">{isBn ? 'চিত্রশালায় ছবি' : 'Total Photos'}</span>
                <p className="text-2xl font-bold font-mono text-[#9E1B32] dark:text-[#E5C158]">{gallery.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-1">
                <span className="text-xs text-neutral-500 font-sans">{isBn ? 'অনুষ্ঠান সূচি' : 'Total Events'}</span>
                <p className="text-2xl font-bold font-mono text-[#9E1B32] dark:text-[#E5C158]">{events.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-sm space-y-1">
                <span className="text-xs text-neutral-500 font-sans">{isBn ? 'সক্রিয় বিজ্ঞপ্তি' : 'Announcements'}</span>
                <p className="text-2xl font-bold font-mono text-[#9E1B32] dark:text-[#E5C158]">{announcements.filter(a => a.active).length}</p>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
                <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isBn ? 'উৎসব স্থিতি ও বছর' : 'Puja Edition & Year'}</span>
                </h3>
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <p>বর্তমান শারদোৎসব: <strong className="text-neutral-900 dark:text-neutral-100">{settings.currentYear} ({settings.currentEdition}তম বর্ষ)</strong></p>
                  <p>মহা ষষ্ঠীর তারিখ: <strong className="text-neutral-900 dark:text-neutral-100">{currentPujaYear.shasthiDate}</strong></p>
                  <p>বিজয়া দশমীর তারিখ: <strong className="text-neutral-900 dark:text-neutral-100">{currentPujaYear.dashamiDate}</strong></p>
                  <p>টপ অ্যানাউন্সমেন্ট বার: <strong className="text-neutral-900 dark:text-neutral-100">{settings.topBannerEnabled ? 'চালু (Enabled)' : 'বন্ধ (Disabled)'}</strong></p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
                <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#9E1B32] dark:text-[#E5C158]" />
                  <span>{isBn ? 'কমিটি নিরাপত্তা ও নিয়মাবলী' : 'Safety & Integrity'}</span>
                </h3>
                <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc list-inside">
                  <li>কোনো সাধারণ ব্যবহারকারী নিজে নিজে অ্যাডমিন হতে পারে না।</li>
                  <li>কোনো অনুদান ব্যবস্থা, ব্যাংক অ্যাকাউন্ট বা বিজ্ঞাপন যুক্ত নেই।</li>
                  <li>সকল ডেটা সম্পূর্ণ ব্যাকআপযোগ্য ও অফলাইনে সুরক্ষিত।</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PUJA CALENDAR ================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                  {currentPujaYear.year} শ্রী শ্রী শারদীয়া দুর্গাপূজা পঞ্জিকা
                </h3>
                <p className="text-xs text-neutral-500 font-sans">
                  {isBn ? 'প্রতিটি তিথির আচার ও সময়সূচী সম্পাদনা করুন।' : 'Edit dates, rituals, and timings for each day.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentPujaYear.days.map((day, dIdx) => (
                <div
                  key={day.id || dIdx}
                  className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 block">তারিখ (YYYY-MM-DD)</label>
                      <input
                        type="text"
                        value={day.date}
                        onChange={(e) => {
                          const updatedDays = [...currentPujaYear.days];
                          updatedDays[dIdx] = { ...day, date: e.target.value };
                          updatePujaYear({ ...currentPujaYear, days: updatedDays });
                        }}
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 block">বাংলা তিথি / তারিখ</label>
                      <input
                        type="text"
                        value={day.bengaliDate}
                        onChange={(e) => {
                          const updatedDays = [...currentPujaYear.days];
                          updatedDays[dIdx] = { ...day, bengaliDate: e.target.value };
                          updatePujaYear({ ...currentPujaYear, days: updatedDays });
                        }}
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 block">তিথির নাম (বাংলা)</label>
                      <input
                        type="text"
                        value={day.dayName_bn}
                        onChange={(e) => {
                          const updatedDays = [...currentPujaYear.days];
                          updatedDays[dIdx] = { ...day, dayName_bn: e.target.value };
                          updatePujaYear({ ...currentPujaYear, days: updatedDays });
                        }}
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent font-bengali"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 block">আচার ও অনুষ্ঠান (কমা দিয়ে পৃথক)</label>
                      <input
                        type="text"
                        value={day.rituals_bn.join(', ')}
                        onChange={(e) => {
                          const updatedDays = [...currentPujaYear.days];
                          updatedDays[dIdx] = {
                            ...day,
                            rituals_bn: e.target.value.split(',').map((s) => s.trim()),
                            rituals_en: e.target.value.split(',').map((s) => s.trim()),
                          };
                          updatePujaYear({ ...currentPujaYear, days: updatedDays });
                        }}
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent font-bengali"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-500 block">ভোগ বিতরণ সময়সূচী</label>
                      <input
                        type="text"
                        value={day.bhogTimings || ''}
                        placeholder="যেমন: 01:00 PM - 03:00 PM"
                        onChange={(e) => {
                          const updatedDays = [...currentPujaYear.days];
                          updatedDays[dIdx] = { ...day, bhogTimings: e.target.value };
                          updatePujaYear({ ...currentPujaYear, days: updatedDays });
                        }}
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: COUNTDOWN & YEAR ================= */}
        {activeTab === 'countdown' && (
          <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'কাউন্টডাউন ও উৎসব বছর কনফিগারেশন' : 'Countdown Target & Years Configuration'}
            </h3>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isBn ? 'বর্তমান পূজার বছর' : 'Current Active Year'}
                </label>
                <input
                  type="number"
                  value={settings.currentYear}
                  onChange={(e) => updateSettings({ currentYear: parseInt(e.target.value, 10) || 2026 })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isBn ? 'বর্তমান বর্ষ সংখ্যা (সংস্করণ)' : 'Celebration Edition (e.g. 118)'}
                </label>
                <input
                  type="number"
                  value={settings.currentEdition}
                  onChange={(e) => updateSettings({ currentEdition: parseInt(e.target.value, 10) || 118 })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isBn ? 'মহা ষষ্ঠীর শুরুর তারিখ (কাউন্টডাউন টার্গেট)' : 'Maha Shasthi Date (Countdown Target)'}
                </label>
                <input
                  type="date"
                  value={currentPujaYear.shasthiDate}
                  onChange={(e) => updatePujaYear({ ...currentPujaYear, shasthiDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {isBn ? 'বিজয়া দশমীর সমাপ্তি তারিখ' : 'Vijaya Dashami Concluding Date'}
                </label>
                <input
                  type="date"
                  value={currentPujaYear.dashamiDate}
                  onChange={(e) => updatePujaYear({ ...currentPujaYear, dashamiDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: EVENTS & BHOG ================= */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Create New Event Form */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#9E1B32]" />
                <span>{isBn ? 'নতুন অনুষ্ঠান সংযোজন' : 'Add New Event or Bhog Schedule'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">শিরোনাম / Title</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="যেমন: ভোগ বিতরণ"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">তারিখ / Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">সময় / Start Time</label>
                  <input
                    type="text"
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">বিভাগ / Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFFDF9] dark:bg-[#1A0C11]"
                  >
                    <option value="Durga Puja">Durga Puja</option>
                    <option value="Bhog">Bhog</option>
                    <option value="Puja Ritual">Puja Ritual</option>
                    <option value="Cultural Program">Cultural Program</option>
                    <option value="Community Event">Community Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 block">বিবরণ / Description</label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="বিস্তারিত বিবরণ..."
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <button
                onClick={() => {
                  if (!newEventTitle.trim()) return;
                  addEvent({
                    year: settings.currentYear,
                    title_en: newEventTitle,
                    title_bn: newEventTitle,
                    description_en: newEventDesc || 'Event details',
                    description_bn: newEventDesc || 'অনুষ্ঠানের বিবরণ',
                    date: newEventDate,
                    startTime: newEventStartTime,
                    endTime: '',
                    category: newEventCategory,
                    status: 'Upcoming',
                    location: 'Pinrra Durga Mandir',
                  });
                  setNewEventTitle('');
                  setNewEventDesc('');
                }}
                className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'অনুষ্ঠান যুক্ত করুন' : 'Add Event'}
              </button>
            </div>

            {/* Existing Events List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {isBn ? 'বর্তমান অনুষ্ঠান তালিকা' : 'Active Events List'} ({events.length})
              </h4>
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF] font-bengali">
                      {evt.title_bn}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {evt.date} • {evt.startTime} • {evt.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CULTURAL PROGRAMS ================= */}
        {activeTab === 'cultural' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <Music className="w-4 h-4 text-[#E56717]" />
                <span>{isBn ? 'সাংস্কৃতিক অনুষ্ঠান সংযোজন' : 'Add Cultural Performance'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">অনুষ্ঠানের নাম</label>
                  <input
                    type="text"
                    value={newProgTitle}
                    onChange={(e) => setNewProgTitle(e.target.value)}
                    placeholder="যেমন: ভক্তিমূলক সঙ্গীত সন্ধ্যা"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">শিল্পী / দল</label>
                  <input
                    type="text"
                    value={newProgPerformer}
                    onChange={(e) => setNewProgPerformer(e.target.value)}
                    placeholder="শিল্পীর নাম..."
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">তারিখ</label>
                  <input
                    type="date"
                    value={newProgDate}
                    onChange={(e) => setNewProgDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">সময়</label>
                  <input
                    type="text"
                    value={newProgTime}
                    onChange={(e) => setNewProgTime(e.target.value)}
                    placeholder="06:30 PM"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!newProgTitle.trim()) return;
                  addCulturalProgram({
                    year: settings.currentYear,
                    title_en: newProgTitle,
                    title_bn: newProgTitle,
                    performer_en: newProgPerformer || 'Local Artists',
                    performer_bn: newProgPerformer || 'স্থানীয় শিল্পীবৃন্দ',
                    date: newProgDate,
                    time: newProgTime,
                    description_en: 'Cultural program organized by MAHAMAYA committee.',
                    description_bn: 'মহামায়া সমিতি কর্তৃক আয়োজিত সাংস্কৃতিক অনুষ্ঠান।',
                    location: 'Pinrra Durga Mandap Stage',
                    status: 'Upcoming',
                  });
                  setNewProgTitle('');
                  setNewProgPerformer('');
                }}
                className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'সাংস্কৃতিক সূচি যুক্ত করুন' : 'Add Program'}
              </button>
            </div>

            {culturalPrograms.length === 0 ? (
              <p className="text-xs text-neutral-500">
                {isBn
                  ? 'বর্তমানে কোনো অনুষ্ঠান যোগ করা নেই (ওয়েবসাইটে সততাপূর্ণ খালি স্টেট প্রদর্শিত হচ্ছে)।'
                  : 'Currently no cultural programs added. Honest empty state is shown on website.'}
              </p>
            ) : (
              <div className="space-y-3">
                {culturalPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF]">{prog.title_bn}</p>
                      <p className="text-[11px] text-neutral-500">{prog.date} • {prog.time} • {prog.performer_bn}</p>
                    </div>
                    <button
                      onClick={() => deleteCulturalProgram(prog.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: ANNOUNCEMENTS ================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Create Announcement Form */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E56717]" />
                <span>{isBn ? 'নতুন বিজ্ঞপ্তি প্রকাশ' : 'Publish New Notice'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-500 block">বিজ্ঞপ্তির শিরোনাম / Title</label>
                  <input
                    type="text"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="যেমন: ভোগ বিতরণের বিশেষ বিজ্ঞপ্তি"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">গুরুত্ব / Priority</label>
                  <select
                    value={newAnnPriority}
                    onChange={(e) => setNewAnnPriority(e.target.value as AnnouncementPriority)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFFDF9] dark:bg-[#1A0C11]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 block">বিজ্ঞপ্তির বিষয়বস্তু / Notice Body</label>
                <textarea
                  rows={3}
                  value={newAnnDesc}
                  onChange={(e) => setNewAnnDesc(e.target.value)}
                  placeholder="বিজ্ঞপ্তির পূর্ণাঙ্গ বিবরণ..."
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <button
                onClick={() => {
                  if (!newAnnTitle.trim()) return;
                  addAnnouncement({
                    title_en: newAnnTitle,
                    title_bn: newAnnTitle,
                    description_en: newAnnDesc || 'Official committee announcement',
                    description_bn: newAnnDesc || 'কমিটির পক্ষ থেকে বিজ্ঞপ্তি',
                    date: new Date().toISOString().split('T')[0],
                    priority: newAnnPriority,
                    active: true,
                    showInTopBanner: false,
                  });
                  setNewAnnTitle('');
                  setNewAnnDesc('');
                }}
                className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'বিজ্ঞপ্তি প্রকাশ করুন' : 'Publish Notice'}
              </button>
            </div>

            {/* Existing Announcements List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {isBn ? 'বিজ্ঞপ্তি তালিকা' : 'Notices List'} ({announcements.length})
              </h4>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                        {ann.priority}
                      </span>
                      <p className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF] font-bengali">
                        {ann.title_bn}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{ann.description_bn}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateAnnouncement(ann.id, { active: !ann.active })}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer ${
                        ann.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {ann.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: GALLERY MODERATION ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'চিত্রশালা নিয়ন্ত্রণ ও মডারেশন' : 'Gallery Moderation & Review'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isBn
                  ? 'ভক্তদের আপলোডকৃত ছবি পর্যালোচনা করুন, অনুপযুক্ত ছবি মুছুন বা হোমপেজে প্রদর্শনের জন্য Featured করুন।'
                  : 'Review uploaded photos, feature them on the homepage, or delete inappropriate submissions.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 flex flex-col justify-between"
                >
                  <div className="h-36 w-full bg-neutral-900 relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title_en}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">
                      {photo.category}
                    </div>
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF] truncate">
                        {photo.title_en}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {photo.uploaderName} ({photo.pujaYear})
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <button
                        onClick={() => toggleFeaturePhoto(photo.id)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded cursor-pointer ${
                          photo.featured
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {photo.featured ? 'Featured' : 'Make Featured'}
                      </button>

                      <button
                        onClick={() => deleteGalleryPhoto(photo.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title={isBn ? 'ছবিটি অবিলম্বে অপসারণ করুন' : 'Remove photo immediately'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#9E1B32]" />
                <span>{isBn ? 'নতুন ঐতিহাসিক মাইলফলক সংযোজন' : 'Add Historical Milestone'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block">সাল / Year</label>
                  <input
                    type="text"
                    value={newHistYear}
                    onChange={(e) => setNewHistYear(e.target.value)}
                    placeholder="যেমন: ১৯৫০"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-500 block">শিরোনাম / Title</label>
                  <input
                    type="text"
                    value={newHistTitle}
                    onChange={(e) => setNewHistTitle(e.target.value)}
                    placeholder="মাইলফলকের নাম..."
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 block">বিবরণ / Description</label>
                <textarea
                  rows={2}
                  value={newHistDesc}
                  onChange={(e) => setNewHistDesc(e.target.value)}
                  placeholder="ঐতিহাসিক বিবরণ..."
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              <button
                onClick={() => {
                  if (!newHistYear.trim() || !newHistTitle.trim()) return;
                  addHistoryMilestone({
                    year: newHistYear,
                    title_en: newHistTitle,
                    title_bn: newHistTitle,
                    description_en: newHistDesc || 'Milestone verified by committee.',
                    description_bn: newHistDesc || 'কমিটি কর্তৃক যাচাইকৃত ঐতিহাসিক তথ্য।',
                  });
                  setNewHistYear('');
                  setNewHistTitle('');
                  setNewHistDesc('');
                }}
                className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold cursor-pointer"
              >
                {isBn ? 'মাইলফলক যুক্ত করুন' : 'Add Milestone'}
              </button>
            </div>

            <div className="space-y-3">
              {historyMilestones.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#9E1B32] dark:text-[#E5C158]">{h.year}</span>
                    <p className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF]">{h.title_bn}</p>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{h.description_bn}</p>
                  </div>
                  <button
                    onClick={() => deleteHistoryMilestone(h.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: USERS & ROLES ================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'ব্যবহারকারী ব্যবস্থাপনা ও রোল নির্ধারণ' : 'Users & Access Control'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isBn
                  ? 'নিবন্ধিত সদস্যদের দায়িত্ব প্রদান করুন (সুপার অ্যাডমিন, অ্যাডমিন, কন্টেন্ট ম্যানেজার, মডারেটর)।'
                  : 'Assign verified roles to authorized committee members.'}
              </p>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="p-3 font-semibold">নাম / Name</th>
                    <th className="p-3 font-semibold">ইমেইল / Email</th>
                    <th className="p-3 font-semibold">বর্তমান রোল / Role</th>
                    <th className="p-3 font-semibold text-right">রোল পরিবর্তন / Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      <td className="p-3 font-medium text-neutral-900 dark:text-neutral-100">{u.name}</td>
                      <td className="p-3 text-neutral-500 font-mono text-[11px]">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 text-[#9E1B32] dark:text-[#E5C158]">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-transparent"
                        >
                          <option value="USER">USER</option>
                          <option value="GALLERY_MODERATOR">GALLERY_MODERATOR</option>
                          <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 10: SITE SETTINGS & BACKUP ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-2xl animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'ওয়েবসাইট ব্র্যান্ডিং ও ব্যানার' : 'Branding & Announcement Bar'}
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  টপ ব্যানার অন/অফ (Top Banner Toggle)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="bannerToggle"
                    checked={settings.topBannerEnabled}
                    onChange={(e) => updateSettings({ topBannerEnabled: e.target.checked })}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="bannerToggle" className="text-xs text-neutral-600 dark:text-neutral-300 cursor-pointer">
                    হোমপেজের শীর্ষে ঘোষণা ব্যানার চালু রাখুন
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  ব্যানার টেক্সট (বাংলা)
                </label>
                <input
                  type="text"
                  value={settings.topBannerText_bn}
                  onChange={(e) => updateSettings({ topBannerText_bn: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent font-bengali"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={settings.mapsUrl}
                  onChange={(e) => updateSettings({ mapsUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>

              {/* Official Real Deity Photo Uploader */}
              <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  {isBn ? 'মন্দিরের মূল প্রতিমার বাস্তব ছবি (Official Deity Photo)' : 'Official Deity Photograph (Real Idol Photo)'}
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-neutral-900 shrink-0">
                    <img
                      src={settings.heroDeityImage}
                      alt="Real Idol"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setRealMaaDurgaPhoto(ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#9E1B32] file:text-white cursor-pointer"
                    />
                    <p className="text-[11px] text-neutral-400">
                      {isBn
                        ? 'আপনার ডিভাইস থেকে প্রদত্ত বাস্তব ছবি (WhatsApp Image 2026-10-07 at 5.18.03 PM.jpeg) নির্বাচন করুন।'
                        : 'Select the authentic photograph (WhatsApp Image 2026-10-07 at 5.18.03 PM.jpeg) from your device.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backup, Restore & Reset */}
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 space-y-4">
              <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
                {isBn ? 'ব্যাকআপ ও সিস্টেম রিস্টোর' : 'Backup & Restore Database'}
              </h3>

              {importNotice && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 text-center font-medium">
                  {importNotice}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? 'ব্যাকআপ ডাউনলোড (JSON)' : 'Download Backup (JSON)'}</span>
                </button>

                <label className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{isBn ? 'ব্যাকআপ রিস্টোর' : 'Restore from JSON'}</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm(isBn ? 'আপনি কি আদি ডিফল্ট তথ্যে ফিরে যেতে চান?' : 'Reset all data to default?')) {
                      resetToDefault();
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-50 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isBn ? 'ডিফল্ট রিসেট' : 'Reset to Default'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
