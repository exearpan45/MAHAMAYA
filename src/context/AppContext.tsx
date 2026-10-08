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


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => preference('pinrra_lang') === 'en' ? 'en' : 'bn');
  const [hasChosenLanguage, setHasChosenLanguageState] = useState(() => preference('pinrra_lang_chosen') === 'true');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
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

  const clearApiError = () => setApiError(null);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    savePreference('pinrra_lang', value);
    document.documentElement.lang = value;
  };

  const setHasChosenLanguage = (value: boolean) => {
    setHasChosenLanguageState(value);
    savePreference('pinrra_lang_chosen', value ? 'true' : 'false');
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

  const setTheme = (_value: 'light' | 'dark') => {
    setThemeState('dark');
    savePreference('pinrra_theme', 'dark');
    applyThemeToDOM('dark');
  };

  const toggleTheme = () => setTheme('dark');

  useEffect(() => applyThemeToDOM(theme), [theme]);

  const toggleAudio = () => setIsAudioPlaying(devotionalAudio.toggle());

  /*
   * Static/no-database mode:
   * Public content is loaded from initialData.ts.
   * Admin edits are kept locally in the current browser session.
   * No API, D1, R2 or paid service is required.
   */

  const login = async (_email: string, _password: string): Promise<User> => {
    throw new Error('Admin login requires the secure production admin system.');
  };

  const logout = async () => {
    setCurrentUser(null);
    setActiveViewState('home');
  };

  const currentPujaYear =
    pujaYears.find((year) => year.year === settings.currentYear) ||
    pujaYears[0] ||
    INITIAL_PUJA_YEARS[0];

  const updateSettings = (value: Partial<SiteSettings>) => {
    setSettings((previous) => ({ ...previous, ...value }));
    setApiError(null);
  };

  const setRealMaaDurgaPhoto = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSettings((previous) => ({
      ...previous,
      realMaaDurgaPhotoUrl: imageUrl,
    }));
    setApiError(null);
  };

  const updatePujaYear = (data: PujaYear) => {
    setPujaYears((previous) =>
      previous.map((item) => item.year === data.year ? data : item)
    );
    setApiError(null);
  };

  const addPujaYear = (data: PujaYear) => {
    setPujaYears((previous) => [...previous, data]);
    setApiError(null);
  };

  const addEvent = (item: Omit<EventItem, 'id'>) => {
    setEvents((previous) => [...previous, { ...item, id: crypto.randomUUID() }]);
    setApiError(null);
  };

  const updateEvent = (id: string, item: Partial<EventItem>) => {
    setEvents((previous) =>
      previous.map((event) => event.id === id ? { ...event, ...item, id } : event)
    );
    setApiError(null);
  };

  const deleteEvent = (id: string) => {
    setEvents((previous) => previous.filter((event) => event.id !== id));
    setApiError(null);
  };

  const addAnnouncement = (item: Omit<Announcement, 'id'>) => {
    setAnnouncements((previous) => [
      ...previous,
      { ...item, id: crypto.randomUUID() }
    ]);
    setApiError(null);
  };

  const updateAnnouncement = (id: string, item: Partial<Announcement>) => {
    setAnnouncements((previous) =>
      previous.map((announcement) =>
        announcement.id === id ? { ...announcement, ...item, id } : announcement
      )
    );
    setApiError(null);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((previous) =>
      previous.filter((announcement) => announcement.id !== id)
    );
    setApiError(null);
  };

  const addGalleryPhoto = async (
    photo: Omit<
      GalleryPhoto,
      'id' | 'createdAt' | 'imageUrl' | 'thumbnailUrl' |
      'uploaderName' | 'uploaderEmail' | 'uploaderId'
    >,
    file: File
  ) => {
    const imageUrl = URL.createObjectURL(file);
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      imageUrl,
      thumbnailUrl: imageUrl,
      uploaderName: 'Admin',
      uploaderEmail: '',
      uploaderId: 'local-admin',
    };
    setGallery((previous) => [...previous, newPhoto]);
    setApiError(null);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery((previous) => previous.filter((photo) => photo.id !== id));
    setApiError(null);
  };

  const toggleFeaturePhoto = (id: string) => {
    setGallery((previous) =>
      previous.map((photo) =>
        photo.id === id ? { ...photo, featured: !photo.featured } : photo
      )
    );
    setApiError(null);
  };

  const addHistoryMilestone = (item: Omit<HistoryMilestone, 'id'>) => {
    setHistoryMilestones((previous) => [
      ...previous,
      { ...item, id: crypto.randomUUID() }
    ]);
    setApiError(null);
  };

  const updateHistoryMilestone = (id: string, item: Partial<HistoryMilestone>) => {
    setHistoryMilestones((previous) =>
      previous.map((milestone) =>
        milestone.id === id ? { ...milestone, ...item, id } : milestone
      )
    );
    setApiError(null);
  };

  const deleteHistoryMilestone = (id: string) => {
    setHistoryMilestones((previous) =>
      previous.filter((milestone) => milestone.id !== id)
    );
    setApiError(null);
  };

  const addCulturalProgram = (item: Omit<CulturalProgramItem, 'id'>) => {
    setCulturalPrograms((previous) => [
      ...previous,
      { ...item, id: crypto.randomUUID() }
    ]);
    setApiError(null);
  };

  const updateCulturalProgram = (id: string, item: Partial<CulturalProgramItem>) => {
    setCulturalPrograms((previous) =>
      previous.map((program) =>
        program.id === id ? { ...program, ...item, id } : program
      )
    );
    setApiError(null);
  };

  const deleteCulturalProgram = (id: string) => {
    setCulturalPrograms((previous) =>
      previous.filter((program) => program.id !== id)
    );
    setApiError(null);
  };

  const exportDataJSON = () => JSON.stringify({
    version: '2.0',
    exportedAt: new Date().toISOString(),
    settings,
    pujaYears,
    events: events.map((item) => ({
      ...item,
      image: canonicalAssetUrl(item.image)
    })),
    announcements,
    gallery: gallery.map((item) => ({
      ...item,
      imageUrl: canonicalAssetUrl(item.imageUrl) || item.imageUrl,
      thumbnailUrl: canonicalAssetUrl(item.thumbnailUrl)
    })),
    historyMilestones: historyMilestones.map((item) => ({
      ...item,
      image: canonicalAssetUrl(item.image)
    })),
    culturalPrograms
  }, null, 2);

  const importDataJSON = async (jsonString: string) => {
    try {
      const backup: unknown = JSON.parse(jsonString);

      if (
        typeof backup !== 'object' ||
        backup === null ||
        Array.isArray(backup)
      ) {
        return false;
      }

      const data = backup as Partial<ServerSnapshot>;

      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.pujaYears)) setPujaYears(data.pujaYears);
      if (Array.isArray(data.events)) {
        setEvents(
          data.events.map((item) => ({
            ...item,
            image: resolveAssetUrl(item.image)
          }))
        );
      }
      if (Array.isArray(data.announcements)) {
        setAnnouncements(data.announcements);
      }
      if (Array.isArray(data.gallery)) {
        setGallery(
          data.gallery.map((item) => ({
            ...item,
            imageUrl: resolveAssetUrl(item.imageUrl) || item.imageUrl,
            thumbnailUrl: resolveAssetUrl(item.thumbnailUrl)
          }))
        );
      }
      if (Array.isArray(data.historyMilestones)) {
        setHistoryMilestones(
          data.historyMilestones.map((item) => ({
            ...item,
            image: resolveAssetUrl(item.image)
          }))
        );
      }
      if (Array.isArray(data.culturalPrograms)) {
        setCulturalPrograms(data.culturalPrograms);
      }

      setApiError(null);
      return true;
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Backup restore failed.'
      );
      return false;
    }
  };

  const resetToDefault = () => {
    setSettings(INITIAL_SETTINGS);
    setPujaYears(INITIAL_PUJA_YEARS);
    setEvents(
      INITIAL_EVENTS.map((item) => ({
        ...item,
        image: resolveAssetUrl(item.image)
      }))
    );
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setGallery(
      INITIAL_GALLERY.map((item) => ({
        ...item,
        imageUrl: resolveAssetUrl(item.imageUrl) || item.imageUrl,
        thumbnailUrl: resolveAssetUrl(item.thumbnailUrl)
      }))
    );
    setHistoryMilestones(
      INITIAL_HISTORY_MILESTONES.map((item) => ({
        ...item,
        image: resolveAssetUrl(item.image)
      }))
    );
    setCulturalPrograms(INITIAL_CULTURAL_PROGRAMS);
    setCurrentUser(null);
    setApiError(null);
  };

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
      searchModalOpen, setSearchModalOpen, activePolicyModal, setActivePolicyModal, apiError, clearApiError,
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
