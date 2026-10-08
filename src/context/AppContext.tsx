import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Language, User, UserRole, PujaYear, EventItem, Announcement, GalleryPhoto, VideoItem,
  HistoryMilestone, CulturalProgramItem, SiteSettings,
} from '../types';
import {
  INITIAL_SETTINGS, INITIAL_PUJA_YEARS, INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY, INITIAL_VIDEOS, INITIAL_HISTORY_MILESTONES, INITIAL_CULTURAL_PROGRAMS,
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
  videos: VideoItem[];
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
  videos: VideoItem[]; addVideo: (item: Omit<VideoItem, 'id' | 'createdAt'>) => void;
  deleteVideo: (id: string) => void; toggleFeatureVideo: (id: string) => void;
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
  publishContent: () => Promise<void>;
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
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
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
    setVideos(data.videos || []);
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

  // Load the latest published content from GitHub-backed static storage.
  // The initialData imports remain as a safe fallback if the network is unavailable.
  useEffect(() => {
    let cancelled = false;
    const loadPublishedContent = async () => {
      try {
        const response = await fetch('/site-content.json?ts=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) throw new Error('Published content could not be loaded.');
        const data = await response.json();
        if (!cancelled) applySnapshot({ ...data, currentUser: null });
      } catch {
        // Keep the bundled defaults when the content file cannot be reached.
      } finally {
      }
    };
    void loadPublishedContent();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restoreAdminSession = async () => {
      try {
        const response = await fetch('/api/admin/login', { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data?.user) setCurrentUser(data.user);
      } catch {
        // Public visitors do not need an admin session.
      }
    };
    void restoreAdminSession();
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.user) {
      throw new Error(data?.error || 'Unable to sign in.');
    }
    setCurrentUser(data.user);
    setApiError(null);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE', credentials: 'include' });
    } finally {
      setCurrentUser(null);
      setActiveViewState('home');
    }
  };

  const currentPujaYear =
    pujaYears.find((year) => year.year === settings.currentYear) ||
    pujaYears[0] ||
    INITIAL_PUJA_YEARS[0];

  const updateSettings = (value: Partial<SiteSettings>) => {
    setSettings((previous) => ({ ...previous, ...value }));
    setApiError(null);
  };

  const MAX_GALLERY_PHOTOS = 200;
  const MAX_GALLERY_SOURCE_BYTES = 15 * 1024 * 1024;
  const MAX_GALLERY_OUTPUT_BYTES = 900 * 1024;
  const MAX_GALLERY_DIMENSION = 1800;

  const optimizeGalleryImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please choose a valid image file.');
    }
    if (file.size > MAX_GALLERY_SOURCE_BYTES) {
      throw new Error('Gallery photos must be 15 MB or smaller. The site will automatically optimize them after upload.');
    }

    const sourceUrl = await fileToDataUrl(file);
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('This image could not be read. Please choose another photo.'));
      image.src = sourceUrl;
    });

    const scale = Math.min(1, MAX_GALLERY_DIMENSION / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare this image.');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const supportsWebP = canvas.toDataURL('image/webp', 0.8).startsWith('data:image/webp');
    const mime = supportsWebP ? 'image/webp' : 'image/jpeg';
    const qualities = [0.82, 0.72, 0.62, 0.54, 0.46, 0.38];

    let best = '';
    for (const quality of qualities) {
      const candidate = canvas.toDataURL(mime, quality);
      best = candidate;
      const base64Length = candidate.length - candidate.indexOf(',') - 1;
      const estimatedBytes = Math.floor(base64Length * 0.75);
      if (estimatedBytes <= MAX_GALLERY_OUTPUT_BYTES) return candidate;
    }

    // Very detailed photos can still be large after quality reduction. Reduce dimensions
    // once more so the gallery stays lightweight even with large camera images.
    const smallerScale = Math.min(1, 1400 / Math.max(canvas.width, canvas.height));
    if (smallerScale < 1) {
      canvas.width = Math.max(1, Math.round(canvas.width * smallerScale));
      canvas.height = Math.max(1, Math.round(canvas.height * smallerScale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.62, 0.52, 0.42, 0.34]) {
        const candidate = canvas.toDataURL(mime, quality);
        best = candidate;
        const base64Length = candidate.length - candidate.indexOf(',') - 1;
        const estimatedBytes = Math.floor(base64Length * 0.75);
        if (estimatedBytes <= MAX_GALLERY_OUTPUT_BYTES) return candidate;
      }
    }

    return best;
  };

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });

  const setRealMaaDurgaPhoto = async (file: File) => {
    if (file.size > 6 * 1024 * 1024) throw new Error('Please choose an image smaller than 6 MB.');
    const imageUrl = await fileToDataUrl(file);
    setSettings((previous) => ({
      ...previous,
      heroDeityImage: imageUrl,
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
    if (gallery.length >= MAX_GALLERY_PHOTOS) {
      throw new Error('Gallery limit reached. You can keep up to 200 photos.');
    }

    const imageUrl = await optimizeGalleryImage(file);
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

  const MAX_VIDEOS = 50;

  const addVideo = (item: Omit<VideoItem, 'id' | 'createdAt'>) => {
    if (videos.length >= MAX_VIDEOS) throw new Error('Video gallery limit reached. You can keep up to 50 videos.');
    let parsed: URL;
    try {
      parsed = new URL(item.videoUrl);
    } catch {
      throw new Error('Please enter a valid video URL.');
    }
    if (parsed.protocol !== 'https:') {
      throw new Error('Video links must use HTTPS for safety and compatibility.');
    }
    setVideos((previous) => [...previous, { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
    setApiError(null);
  };

  const deleteVideo = (id: string) => {
    setVideos((previous) => previous.filter((video) => video.id !== id));
    setApiError(null);
  };

  const toggleFeatureVideo = (id: string) => {
    setVideos((previous) => previous.map((video) => video.id === id ? { ...video, featured: !video.featured } : video));
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

  const publishContent = async () => {
    if (!currentUser) throw new Error('Please sign in as an administrator first.');

    const snapshot: ServerSnapshot = {
      settings,
      pujaYears,
      events,
      announcements,
      gallery,
      historyMilestones,
      culturalPrograms,
      videos,
      currentUser: null,
    };

    const assets: Array<{ path: string; base64: string }> = [];
    const clone: any = JSON.parse(JSON.stringify(snapshot));

    const uploadDataUrl = async (dataUrl: string, prefix: string) => {
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return dataUrl;
      const extension = (match[1].split('/')[1] || 'jpg').replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'jpg';
      const path = `/uploads/${prefix}-${crypto.randomUUID()}.${extension}`;
      assets.push({ path: `public${path}`, base64: match[2] });
      return path;
    };

    if (typeof clone.settings.heroDeityImage === 'string' && clone.settings.heroDeityImage.startsWith('data:')) {
      clone.settings.heroDeityImage = await uploadDataUrl(clone.settings.heroDeityImage, 'deity');
    }

    for (const item of clone.gallery) {
      const originalImageUrl = item.imageUrl;
      if (typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data:')) {
        item.imageUrl = await uploadDataUrl(item.imageUrl, 'gallery');
      }
      if (typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.startsWith('data:')) {
        item.thumbnailUrl = item.thumbnailUrl === originalImageUrl
          ? item.imageUrl
          : await uploadDataUrl(item.thumbnailUrl, 'gallery-thumb');
      }
    }
    for (const item of clone.events) {
      if (typeof item.image === 'string' && item.image.startsWith('data:')) item.image = await uploadDataUrl(item.image, 'event');
    }
    for (const item of clone.historyMilestones) {
      if (typeof item.image === 'string' && item.image.startsWith('data:')) item.image = await uploadDataUrl(item.image, 'history');
    }

    const response = await fetch('/api/admin/publish', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: clone, assets }),
    });
    const rawResponse = await response.text();
    let data: any = null;
    try {
      data = rawResponse ? JSON.parse(rawResponse) : null;
    } catch {
      data = null;
    }
    if (!response.ok) {
      throw new Error(
        data?.error || rawResponse || `Publishing failed. (HTTP ${response.status})`,
      );
    }

    // Keep the browser state aligned with the URLs that were just committed.
    applySnapshot({ ...clone, currentUser });
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
    culturalPrograms,
    videos
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
      if (Array.isArray(data.videos)) {
        setVideos(data.videos);
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
    setVideos(INITIAL_VIDEOS);
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
      videos, addVideo, deleteVideo, toggleFeatureVideo,
      exportDataJSON, importDataJSON, resetToDefault, publishContent, activeView, setActiveView,
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
