import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Language, User, UserRole, PujaYear, EventItem, Announcement, GalleryPhoto,
  HistoryMilestone, CulturalProgramItem, SiteSettings,
} from '../types';
import {
  INITIAL_SETTINGS, INITIAL_PUJA_YEARS, INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY, INITIAL_HISTORY_MILESTONES, INITIAL_CULTURAL_PROGRAMS,
} from '../data/initialData';
import { devotionalAudio } from '../utils/audio';
import mandirHeritageImage from '../assets/images/mandir_heritage_1791376373749.jpg';
import bhogPrasadImage from '../assets/images/bhog_prasad_1791376439598.jpg';
import sandhiPujaImage from '../assets/images/sandhi_puja_diyas_1791376395307.jpg';
import sindoorKhelaImage from '../assets/images/sindoor_khela_1791376410172.jpg';

const assetUrls: Record<string, string> = {
  '/src/assets/images/mandir_heritage_1791376373749.jpg': mandirHeritageImage,
  '/src/assets/images/bhog_prasad_1791376439598.jpg': bhogPrasadImage,
  '/src/assets/images/sandhi_puja_diyas_1791376395307.jpg': sandhiPujaImage,
  '/src/assets/images/sindoor_khela_1791376410172.jpg': sindoorKhelaImage,
};

const resolveAssetUrl = (url?: string) => (url && assetUrls[url]) || url;
const canonicalAssetUrl = (url?: string) => (url && Object.entries(assetUrls).find(([, builtUrl]) => builtUrl === url)?.[0]) || url;

interface ServerSnapshot {
  settings: SiteSettings;
  pujaYears: PujaYear[];
  events: EventItem[];
  announcements: Announcement[];
  gallery: GalleryPhoto[];
  historyMilestones: HistoryMilestone[];
  culturalPrograms: CulturalProgramItem[];
  currentUser: User | null;
}

interface AppContextType {
  language: Language; setLanguage: (lang: Language) => void;
  hasChosenLanguage: boolean; setHasChosenLanguage: (chosen: boolean) => void;
  theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; toggleTheme: () => void;
  isAudioPlaying: boolean; toggleAudio: () => void;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  settings: SiteSettings; updateSettings: (newSettings: Partial<SiteSettings>) => void;
  setRealMaaDurgaPhoto: (file: File) => Promise<void>;
  pujaYears: PujaYear[]; currentPujaYear: PujaYear;
  updatePujaYear: (yearData: PujaYear) => void; addPujaYear: (yearData: PujaYear) => void;
  events: EventItem[]; addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void; deleteEvent: (id: string) => void;
  announcements: Announcement[]; addAnnouncement: (item: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, item: Partial<Announcement>) => void; deleteAnnouncement: (id: string) => void;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id' | 'createdAt' | 'imageUrl' | 'thumbnailUrl' | 'uploaderName' | 'uploaderEmail' | 'uploaderId'>, file: File) => Promise<void>;
  deleteGalleryPhoto: (id: string) => void; toggleFeaturePhoto: (id: string) => void;
  historyMilestones: HistoryMilestone[]; addHistoryMilestone: (item: Omit<HistoryMilestone, 'id'>) => void;
  updateHistoryMilestone: (id: string, item: Partial<HistoryMilestone>) => void; deleteHistoryMilestone: (id: string) => void;
  culturalPrograms: CulturalProgramItem[]; addCulturalProgram: (item: Omit<CulturalProgramItem, 'id'>) => void;
  updateCulturalProgram: (id: string, item: Partial<CulturalProgramItem>) => void; deleteCulturalProgram: (id: string) => void;
  exportDataJSON: () => string; importDataJSON: (jsonString: string) => Promise<boolean>; resetToDefault: () => void;
  activeView: string; setActiveView: (view: string) => void;
  downloadModalOpen: boolean; setDownloadModalOpen: (open: boolean) => void;
  searchModalOpen: boolean; setSearchModalOpen: (open: boolean) => void;
  activePolicyModal: string | null; setActivePolicyModal: (policy: string | null) => void;
  apiError: string | null; clearApiError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function preference(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function savePreference(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* Preference storage is optional. */ }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof result === 'object' && result !== null && 'error' in result && typeof result.error === 'string'
      ? result.error : 'The request could not be completed.';
    throw new Error(message);
  }
  return result as T;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => preference('pinrra_lang') === 'en' ? 'en' : 'bn');
  const [hasChosenLanguage, setHasChosenLanguageState] = useState(() => preference('pinrra_lang_chosen') === 'true');
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => preference('pinrra_theme') === 'dark' ? 'dark' : 'light');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [pujaYears, setPujaYears] = useState<PujaYear[]>(INITIAL_PUJA_YEARS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS.map((item) => ({ ...item, image: resolveAssetUrl(item.image) })));
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(INITIAL_GALLERY.map((item) => ({ ...item, imageUrl: resolveAssetUrl(item.imageUrl) || item.imageUrl, thumbnailUrl: resolveAssetUrl(item.thumbnailUrl) })));
  const [historyMilestones, setHistoryMilestones] = useState<HistoryMilestone[]>(INITIAL_HISTORY_MILESTONES.map((item) => ({ ...item, image: resolveAssetUrl(item.image) })));
  const [culturalPrograms, setCulturalPrograms] = useState<CulturalProgramItem[]>(INITIAL_CULTURAL_PROGRAMS);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeView, setActiveViewState] = useState<string>(() => {
    const route = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    return route === 'admin' || route === 'profile' ? route : 'home';
  });
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(() => {
    const route = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    return ['privacy', 'terms', 'disclaimer'].includes(route) ? route : null;
  });

  const applySnapshot = (data: ServerSnapshot) => {
    setSettings(data.settings);
    setPujaYears(data.pujaYears);
    setEvents(data.events.map((item) => ({ ...item, image: resolveAssetUrl(item.image) })));
    setAnnouncements(data.announcements);
    setGallery(data.gallery.map((item) => ({ ...item, imageUrl: resolveAssetUrl(item.imageUrl) || item.imageUrl, thumbnailUrl: resolveAssetUrl(item.thumbnailUrl) })));
    setHistoryMilestones(data.historyMilestones.map((item) => ({ ...item, image: resolveAssetUrl(item.image) })));
    setCulturalPrograms(data.culturalPrograms);
    setCurrentUser(data.currentUser);
  };

  const refreshData = async (): Promise<ServerSnapshot> => {
    const response = await fetch('/api/data', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    const data = await parseResponse<ServerSnapshot>(response);
    applySnapshot(data);
    return data;
  };

  useEffect(() => {
    void refreshData().catch((error: unknown) => {
      setApiError(error instanceof Error ? error.message : 'Shared site data is temporarily unavailable.');
    });
  }, []);

  const mutate = async (action: string, payload: Record<string, unknown> = {}) => {
    setApiError(null);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const result = await parseResponse<{ data: ServerSnapshot }>(response);
      applySnapshot(result.data);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'The requested change could not be saved.');
    }
  };

  const setLanguage = (value: Language) => {
    setLanguageState(value); savePreference('pinrra_lang', value); document.documentElement.lang = value;
  };
  const setHasChosenLanguage = (value: boolean) => {
    setHasChosenLanguageState(value); savePreference('pinrra_lang_chosen', value ? 'true' : 'false');
  };
  const applyThemeToDOM = (value: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.toggle('dark', value === 'dark');
    root.classList.toggle('light', value === 'light');
    root.setAttribute('data-theme', value);
    root.style.colorScheme = value;
    document.body.classList.toggle('dark', value === 'dark');
    document.body.classList.toggle('light', value === 'light');
  };
  const setTheme = (value: 'light' | 'dark') => {
    setThemeState(value); savePreference('pinrra_theme', value); applyThemeToDOM(value);
  };
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  useEffect(() => applyThemeToDOM(theme), [theme]);

  const toggleAudio = () => setIsAudioPlaying(devotionalAudio.toggle());

  const authRequest = async (action: string, values: Record<string, unknown>) => {
    const response = await fetch('/api/auth', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ action, ...values }),
    });
    return parseResponse<{ user: User }>(response);
  };
  const login = async (email: string, password: string) => {
    const result = await authRequest('login', { email, password });
    await refreshData(); return result.user;
  };
  const logout = async () => {
    try {
      await fetch('/api/auth', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    } finally {
      setCurrentUser(null); setActiveView('home');
      void refreshData().catch(() => undefined);
    }
  };

  const currentPujaYear = pujaYears.find((year) => year.year === settings.currentYear) || pujaYears[0] || INITIAL_PUJA_YEARS[0];
  const updateSettings = (value: Partial<SiteSettings>) => void mutate('settings-update', value as Record<string, unknown>);
  const setRealMaaDurgaPhoto = async (file: File) => {
    setApiError(null);
    try {
      const form = new FormData(); form.set('image', file);
      const response = await fetch('/api/deity-image', { method: 'POST', credentials: 'same-origin', body: form });
      const result = await parseResponse<{ data: ServerSnapshot }>(response); applySnapshot(result.data);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'The temple photo could not be saved.');
      throw error;
    }
  };
  const updatePujaYear = (data: PujaYear) => void mutate('puja-update', { item: data });
  const addPujaYear = (data: PujaYear) => void mutate('puja-add', { item: data });
  const addEvent = (item: Omit<EventItem, 'id'>) => void mutate('event-add', { item: { ...item, id: crypto.randomUUID() } });
  const updateEvent = (id: string, item: Partial<EventItem>) => void mutate('event-update', { item: { ...item, id } });
  const deleteEvent = (id: string) => void mutate('event-delete', { id });
  const addAnnouncement = (item: Omit<Announcement, 'id'>) => void mutate('announcement-add', { item: { ...item, id: crypto.randomUUID() } });
  const updateAnnouncement = (id: string, item: Partial<Announcement>) => void mutate('announcement-update', { item: { ...item, id } });
  const deleteAnnouncement = (id: string) => void mutate('announcement-delete', { id });
  const addGalleryPhoto = async (photo: Omit<GalleryPhoto, 'id' | 'createdAt' | 'imageUrl' | 'thumbnailUrl' | 'uploaderName' | 'uploaderEmail' | 'uploaderId'>, file: File) => {
    setApiError(null);
    const form = new FormData();
    form.set('image', file); form.set('title', photo.title_en); form.set('description', photo.description_en);
    form.set('category', photo.category); form.set('pujaYear', String(photo.pujaYear));
    const response = await fetch('/api/gallery', { method: 'POST', credentials: 'same-origin', body: form });
    const result = await parseResponse<{ data: ServerSnapshot }>(response); applySnapshot(result.data);
  };
  const deleteGalleryPhoto = (id: string) => {
    void mutate('gallery-delete', { id });
  };
  const toggleFeaturePhoto = (id: string) => {
    const photo = gallery.find((item) => item.id === id);
    if (photo) void mutate('gallery-feature', { id, featured: !photo.featured });
  };
  const addHistoryMilestone = (item: Omit<HistoryMilestone, 'id'>) => void mutate('history-add', { item: { ...item, id: crypto.randomUUID() } });
  const updateHistoryMilestone = (id: string, item: Partial<HistoryMilestone>) => void mutate('history-update', { item: { ...item, id } });
  const deleteHistoryMilestone = (id: string) => void mutate('history-delete', { id });
  const addCulturalProgram = (item: Omit<CulturalProgramItem, 'id'>) => void mutate('cultural-add', { item: { ...item, id: crypto.randomUUID() } });
  const updateCulturalProgram = (id: string, item: Partial<CulturalProgramItem>) => void mutate('cultural-update', { item: { ...item, id } });
  const deleteCulturalProgram = (id: string) => void mutate('cultural-delete', { id });
  const exportDataJSON = () => JSON.stringify({ version: '2.0', exportedAt: new Date().toISOString(), settings, pujaYears, events: events.map((item) => ({ ...item, image: canonicalAssetUrl(item.image) })), announcements, gallery: gallery.map((item) => ({ ...item, imageUrl: canonicalAssetUrl(item.imageUrl) || item.imageUrl, thumbnailUrl: canonicalAssetUrl(item.thumbnailUrl) })), historyMilestones: historyMilestones.map((item) => ({ ...item, image: canonicalAssetUrl(item.image) })), culturalPrograms }, null, 2);
  const importDataJSON = async (jsonString: string) => {
    try {
      const backup: unknown = JSON.parse(jsonString);
      if (typeof backup !== 'object' || backup === null || Array.isArray(backup)) return false;
      const response = await fetch('/api/admin', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'import-content', payload: { data: backup } }) });
      const result = await parseResponse<{ data: ServerSnapshot }>(response); applySnapshot(result.data); setApiError(null); return true;
    } catch (error) { setApiError(error instanceof Error ? error.message : 'Backup restore failed.'); return false; }
  };
  const resetToDefault = () => void mutate('reset-content');

  const setActiveView = (view: string) => {
    setActiveViewState(view);
    if (view === 'admin' || view === 'profile') window.location.hash = `/${view}`;
    else if (view === 'home' && (window.location.hash.startsWith('#/admin') || window.location.hash.startsWith('#/profile'))) window.history.pushState(null, '', window.location.pathname);
  };
  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (route === 'admin' || route === 'profile') setActiveViewState(route);
      else if (['privacy', 'terms', 'disclaimer'].includes(route)) setActivePolicyModal(route);
      else {
        setActiveViewState('home');
        if (route) setTimeout(() => document.getElementById(route)?.scrollIntoView({ behavior: 'smooth' }), 80);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AppContext.Provider value={{
      language, setLanguage, hasChosenLanguage, setHasChosenLanguage, theme, setTheme, toggleTheme,
      isAudioPlaying, toggleAudio, currentUser, login, logout,
      settings, updateSettings, setRealMaaDurgaPhoto, pujaYears, currentPujaYear, updatePujaYear, addPujaYear,
      events, addEvent, updateEvent, deleteEvent, announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      gallery, addGalleryPhoto, deleteGalleryPhoto, toggleFeaturePhoto,
      historyMilestones, addHistoryMilestone, updateHistoryMilestone, deleteHistoryMilestone,
      culturalPrograms, addCulturalProgram, updateCulturalProgram, deleteCulturalProgram,
      exportDataJSON, importDataJSON, resetToDefault, activeView, setActiveView,
      downloadModalOpen, setDownloadModalOpen,
      searchModalOpen, setSearchModalOpen, activePolicyModal, setActivePolicyModal, apiError, clearApiError: () => setApiError(null),
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
