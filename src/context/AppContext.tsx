import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  User,
  UserRole,
  PujaYear,
  EventItem,
  Announcement,
  GalleryPhoto,
  HistoryMilestone,
  CulturalProgramItem,
  SiteSettings,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_PUJA_YEARS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_HISTORY_MILESTONES,
  INITIAL_CULTURAL_PROGRAMS,
  INITIAL_USERS,
} from '../data/initialData';
import { devotionalAudio } from '../utils/audio';

interface AppContextType {
  // Localization & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  hasChosenLanguage: boolean;
  setHasChosenLanguage: (chosen: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Background Audio
  isAudioPlaying: boolean;
  toggleAudio: () => void;

  // Authentication
  currentUser: User | null;
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  register: (name: string, email: string) => User;

  // Data & State
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  setRealMaaDurgaPhoto: (dataUrl: string) => void;

  pujaYears: PujaYear[];
  currentPujaYear: PujaYear;
  updatePujaYear: (yearData: PujaYear) => void;
  addPujaYear: (yearData: PujaYear) => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, item: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id' | 'createdAt'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  toggleFeaturePhoto: (id: string) => void;

  historyMilestones: HistoryMilestone[];
  addHistoryMilestone: (item: Omit<HistoryMilestone, 'id'>) => void;
  updateHistoryMilestone: (id: string, item: Partial<HistoryMilestone>) => void;
  deleteHistoryMilestone: (id: string) => void;

  culturalPrograms: CulturalProgramItem[];
  addCulturalProgram: (item: Omit<CulturalProgramItem, 'id'>) => void;
  updateCulturalProgram: (id: string, item: Partial<CulturalProgramItem>) => void;
  deleteCulturalProgram: (id: string) => void;

  users: User[];
  updateUserRole: (userId: string, role: UserRole) => void;

  // Backup & Reset
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetToDefault: () => void;

  // Modals & Active View
  activeView: string;
  setActiveView: (view: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  downloadModalOpen: boolean;
  setDownloadModalOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language initialization
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pinrra_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'bn';
  });

  const [hasChosenLanguage, setHasChosenLanguageState] = useState<boolean>(() => {
    return localStorage.getItem('pinrra_lang_chosen') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pinrra_lang', lang);
    document.documentElement.lang = lang;
  };

  const setHasChosenLanguage = (chosen: boolean) => {
    setHasChosenLanguageState(chosen);
    localStorage.setItem('pinrra_lang_chosen', chosen ? 'true' : 'false');
  };

  // Theme initialization
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pinrra_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  const applyThemeToDOM = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    const body = document.body;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
    }
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('pinrra_theme', t);
    applyThemeToDOM(t);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const toggleAudio = () => {
    const playing = devotionalAudio.toggle();
    setIsAudioPlaying(playing);
  };

  // Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pinrra_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pinrra_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const login = (email: string, role?: UserRole, name?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    let userToSet: User;
    if (existing) {
      userToSet = existing;
    } else {
      userToSet = {
        id: 'usr-' + Date.now(),
        name: name || (normalizedEmail.includes('admin') ? 'Mandir Sevak' : normalizedEmail.split('@')[0]),
        email: normalizedEmail,
        role: role || (normalizedEmail === 'admin@pinrra.org' ? 'SUPER_ADMIN' : normalizedEmail === 'committee@pinrra.org' ? 'ADMIN' : 'USER'),
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, userToSet]);
    }

    setCurrentUser(userToSet);
    localStorage.setItem('pinrra_current_user', JSON.stringify(userToSet));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pinrra_current_user');
  };

  const register = (name: string, email: string): User => {
    const normalizedEmail = email.toLowerCase().trim();
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      role: 'USER', // normal users NEVER become admin by registering
      createdAt: new Date().toISOString(),
    };
    const updated = [...users.filter((u) => u.email.toLowerCase() !== normalizedEmail), newUser];
    setUsers(updated);
    localStorage.setItem('pinrra_users', JSON.stringify(updated));
    setCurrentUser(newUser);
    localStorage.setItem('pinrra_current_user', JSON.stringify(newUser));
    return newUser;
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? { ...u, role } : u));
      localStorage.setItem('pinrra_users', JSON.stringify(next));
      return next;
    });
    if (currentUser?.id === userId) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('pinrra_current_user', JSON.stringify(updated));
    }
  };

  // Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const customRealPhoto = localStorage.getItem('pinrra_real_maa_durga');
    const saved = localStorage.getItem('pinrra_settings');
    let merged = INITIAL_SETTINGS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.heroDeityImage && (parsed.heroDeityImage.includes('pinrra_maa_durga_1791376350293') || parsed.heroDeityImage.includes('WhatsApp Image'))) {
          parsed.heroDeityImage = INITIAL_SETTINGS.heroDeityImage;
        }
        merged = { ...INITIAL_SETTINGS, ...parsed };
      } catch {
        merged = INITIAL_SETTINGS;
      }
    }
    if (customRealPhoto) {
      merged.heroDeityImage = customRealPhoto;
    }
    return merged;
  });

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      localStorage.setItem('pinrra_settings', JSON.stringify(next));
      return next;
    });
  };

  const setRealMaaDurgaPhoto = (dataUrl: string) => {
    localStorage.setItem('pinrra_real_maa_durga', dataUrl);
    updateSettings({ heroDeityImage: dataUrl });

    // Update gallery and history entries to real photo
    setGallery((prev) => {
      const next = prev.map((g) =>
        g.id === 'gal-1' || g.imageUrl.includes('pinrra_maa_durga') || g.imageUrl.includes('WhatsApp')
          ? { ...g, imageUrl: dataUrl, thumbnailUrl: dataUrl }
          : g
      );
      localStorage.setItem('pinrra_gallery', JSON.stringify(next));
      return next;
    });

    setHistoryMilestones((prev) => {
      const next = prev.map((h) =>
        h.id === 'hist-3' || (h.image && (h.image.includes('pinrra_maa_durga') || h.image.includes('WhatsApp')))
          ? { ...h, image: dataUrl }
          : h
      );
      localStorage.setItem('pinrra_history', JSON.stringify(next));
      return next;
    });
  };

  // Puja Calendar / Years
  const [pujaYears, setPujaYears] = useState<PujaYear[]>(() => {
    const saved = localStorage.getItem('pinrra_puja_years');
    return saved ? JSON.parse(saved) : INITIAL_PUJA_YEARS;
  });

  const currentPujaYear = pujaYears.find((y) => y.year === settings.currentYear) || pujaYears[0];

  const updatePujaYear = (yearData: PujaYear) => {
    setPujaYears((prev) => {
      const next = prev.map((y) => (y.year === yearData.year ? yearData : y));
      localStorage.setItem('pinrra_puja_years', JSON.stringify(next));
      return next;
    });
  };

  const addPujaYear = (yearData: PujaYear) => {
    setPujaYears((prev) => {
      const next = [...prev.filter((y) => y.year !== yearData.year), yearData].sort((a, b) => a.year - b.year);
      localStorage.setItem('pinrra_puja_years', JSON.stringify(next));
      return next;
    });
  };

  // Events
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('pinrra_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const addEvent = (event: Omit<EventItem, 'id'>) => {
    const newEvent: EventItem = { ...event, id: 'evt-' + Date.now() };
    setEvents((prev) => {
      const next = [newEvent, ...prev];
      localStorage.setItem('pinrra_events', JSON.stringify(next));
      return next;
    });
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...updated } : e));
      localStorage.setItem('pinrra_events', JSON.stringify(next));
      return next;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem('pinrra_events', JSON.stringify(next));
      return next;
    });
  };

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('pinrra_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const addAnnouncement = (item: Omit<Announcement, 'id'>) => {
    const newItem: Announcement = { ...item, id: 'ann-' + Date.now() };
    setAnnouncements((prev) => {
      const next = [newItem, ...prev];
      localStorage.setItem('pinrra_announcements', JSON.stringify(next));
      return next;
    });
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    setAnnouncements((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      localStorage.setItem('pinrra_announcements', JSON.stringify(next));
      return next;
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem('pinrra_announcements', JSON.stringify(next));
      return next;
    });
  };

  // Gallery
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('pinrra_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: 'gal-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGallery((prev) => {
      const next = [newPhoto, ...prev];
      localStorage.setItem('pinrra_gallery', JSON.stringify(next));
      return next;
    });
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery((prev) => {
      const next = prev.filter((g) => g.id !== id);
      localStorage.setItem('pinrra_gallery', JSON.stringify(next));
      return next;
    });
  };

  const toggleFeaturePhoto = (id: string) => {
    setGallery((prev) => {
      const next = prev.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g));
      localStorage.setItem('pinrra_gallery', JSON.stringify(next));
      return next;
    });
  };

  // History
  const [historyMilestones, setHistoryMilestones] = useState<HistoryMilestone[]>(() => {
    const saved = localStorage.getItem('pinrra_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY_MILESTONES;
  });

  const addHistoryMilestone = (item: Omit<HistoryMilestone, 'id'>) => {
    const newItem: HistoryMilestone = { ...item, id: 'hist-' + Date.now() };
    setHistoryMilestones((prev) => {
      const next = [...prev, newItem];
      localStorage.setItem('pinrra_history', JSON.stringify(next));
      return next;
    });
  };

  const updateHistoryMilestone = (id: string, updated: Partial<HistoryMilestone>) => {
    setHistoryMilestones((prev) => {
      const next = prev.map((h) => (h.id === id ? { ...h, ...updated } : h));
      localStorage.setItem('pinrra_history', JSON.stringify(next));
      return next;
    });
  };

  const deleteHistoryMilestone = (id: string) => {
    setHistoryMilestones((prev) => {
      const next = prev.filter((h) => h.id !== id);
      localStorage.setItem('pinrra_history', JSON.stringify(next));
      return next;
    });
  };

  // Cultural Programs
  const [culturalPrograms, setCulturalPrograms] = useState<CulturalProgramItem[]>(() => {
    const saved = localStorage.getItem('pinrra_cultural');
    return saved ? JSON.parse(saved) : INITIAL_CULTURAL_PROGRAMS;
  });

  const addCulturalProgram = (item: Omit<CulturalProgramItem, 'id'>) => {
    const newItem: CulturalProgramItem = { ...item, id: 'cult-' + Date.now() };
    setCulturalPrograms((prev) => {
      const next = [newItem, ...prev];
      localStorage.setItem('pinrra_cultural', JSON.stringify(next));
      return next;
    });
  };

  const updateCulturalProgram = (id: string, updated: Partial<CulturalProgramItem>) => {
    setCulturalPrograms((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      localStorage.setItem('pinrra_cultural', JSON.stringify(next));
      return next;
    });
  };

  const deleteCulturalProgram = (id: string) => {
    setCulturalPrograms((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem('pinrra_cultural', JSON.stringify(next));
      return next;
    });
  };

  // Export / Import
  const exportDataJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      pujaYears,
      events,
      announcements,
      gallery,
      historyMilestones,
      culturalPrograms,
      users: users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })),
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.pujaYears) setPujaYears(data.pujaYears);
      if (data.events) setEvents(data.events);
      if (data.announcements) setAnnouncements(data.announcements);
      if (data.gallery) setGallery(data.gallery);
      if (data.historyMilestones) setHistoryMilestones(data.historyMilestones);
      if (data.culturalPrograms) setCulturalPrograms(data.culturalPrograms);
      if (data.users) setUsers(data.users);

      localStorage.setItem('pinrra_settings', JSON.stringify(data.settings || settings));
      localStorage.setItem('pinrra_puja_years', JSON.stringify(data.pujaYears || pujaYears));
      localStorage.setItem('pinrra_events', JSON.stringify(data.events || events));
      localStorage.setItem('pinrra_announcements', JSON.stringify(data.announcements || announcements));
      localStorage.setItem('pinrra_gallery', JSON.stringify(data.gallery || gallery));
      localStorage.setItem('pinrra_history', JSON.stringify(data.historyMilestones || historyMilestones));
      localStorage.setItem('pinrra_cultural', JSON.stringify(data.culturalPrograms || culturalPrograms));
      localStorage.setItem('pinrra_users', JSON.stringify(data.users || users));
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefault = () => {
    setSettings(INITIAL_SETTINGS);
    setPujaYears(INITIAL_PUJA_YEARS);
    setEvents(INITIAL_EVENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setGallery(INITIAL_GALLERY);
    setHistoryMilestones(INITIAL_HISTORY_MILESTONES);
    setCulturalPrograms(INITIAL_CULTURAL_PROGRAMS);
    setUsers(INITIAL_USERS);

    localStorage.removeItem('pinrra_settings');
    localStorage.removeItem('pinrra_puja_years');
    localStorage.removeItem('pinrra_events');
    localStorage.removeItem('pinrra_announcements');
    localStorage.removeItem('pinrra_gallery');
    localStorage.removeItem('pinrra_history');
    localStorage.removeItem('pinrra_cultural');
    localStorage.removeItem('pinrra_users');
  };

  // UI state with Hash routing & Deep link support
  const [activeView, setActiveViewState] = useState<string>(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (rawHash === 'admin' || rawHash === 'profile') return rawHash;
    return 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (['privacy', 'terms', 'disclaimer', 'upload-policy'].includes(rawHash)) {
      return rawHash;
    }
    return null;
  });

  const setActiveView = (view: string) => {
    setActiveViewState(view);
    if (view === 'admin' || view === 'profile') {
      window.location.hash = `/${view}`;
    } else if (view === 'home') {
      if (window.location.hash.startsWith('#/admin') || window.location.hash.startsWith('#/profile')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (rawHash === 'admin' || rawHash === 'profile') {
        setActiveViewState(rawHash);
      } else if (['privacy', 'terms', 'disclaimer', 'upload-policy'].includes(rawHash)) {
        setActivePolicyModal(rawHash);
      } else {
        setActiveViewState('home');
        if (rawHash && rawHash !== '') {
          setTimeout(() => {
            const el = document.getElementById(rawHash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        hasChosenLanguage,
        setHasChosenLanguage,
        theme,
        setTheme,
        toggleTheme,
        isAudioPlaying,
        toggleAudio,
        currentUser,
        login,
        logout,
        register,
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
        addGalleryPhoto,
        deleteGalleryPhoto,
        toggleFeaturePhoto,
        historyMilestones,
        addHistoryMilestone,
        updateHistoryMilestone,
        deleteHistoryMilestone,
        culturalPrograms,
        addCulturalProgram,
        updateCulturalProgram,
        deleteCulturalProgram,
        users,
        updateUserRole,
        exportDataJSON,
        importDataJSON,
        resetToDefault,
        activeView,
        setActiveView,
        authModalOpen,
        setAuthModalOpen,
        uploadModalOpen,
        setUploadModalOpen,
        downloadModalOpen,
        setDownloadModalOpen,
        searchModalOpen,
        setSearchModalOpen,
        activePolicyModal,
        setActivePolicyModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
