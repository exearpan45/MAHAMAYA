export type Language = 'bn' | 'en';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface PujaDay {
  id: string;
  date: string; // YYYY-MM-DD
  bengaliDate: string; // e.g. ২৯ আশ্বিন ১৪৩৩
  dayName_en: string;
  dayName_bn: string;
  rituals_en: string[];
  rituals_bn: string[];
  startTime?: string;
  endTime?: string;
  bhogTimings?: string;
  specialNotes_en?: string;
  specialNotes_bn?: string;
}

export interface PujaYear {
  year: number;
  shasthiDate: string; // YYYY-MM-DD
  dashamiDate: string; // YYYY-MM-DD
  edition: number; // e.g. 118 in 2026
  active: boolean;
  days: PujaDay[];
}

export type EventCategory = 'Durga Puja' | 'Cultural Program' | 'Bhog' | 'Puja Ritual' | 'Community Event' | 'Announcement';
export type EventStatus = 'Upcoming' | 'Live' | 'Completed';

export interface EventItem {
  id: string;
  year: number;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  date: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  status: EventStatus;
  location: string;
  image?: string;
}

export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent';

export interface Announcement {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  date: string;
  priority: AnnouncementPriority;
  active: boolean;
  showInTopBanner?: boolean;
}

export type GalleryCategory =
  | 'Maa Durga'
  | 'Temple'
  | 'Durga Puja'
  | 'Bhog'
  | 'Cultural Programs'
  | 'Visarjan'
  | 'Historical Photos'
  | 'Community';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  category: GalleryCategory;
  pujaYear: number;
  uploaderName: string;
  uploaderEmail?: string;
  uploaderId?: string;
  createdAt: string;
  featured?: boolean;
}

export type VideoCategory = 'Durga Puja' | 'Temple' | 'Ritual' | 'Community' | 'Cultural' | 'Other';

export interface VideoItem {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: VideoCategory;
  pujaYear: number;
  createdAt: string;
  featured?: boolean;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  image?: string;
}

export interface CulturalProgramItem {
  id: string;
  year: number;
  title_en: string;
  title_bn: string;
  performer_en: string;
  performer_bn: string;
  date: string;
  time: string;
  description_en: string;
  description_bn: string;
  location: string;
  status: 'Upcoming' | 'Live' | 'Completed';
}

export interface SiteSettings {
  templeName_en: string;
  templeName_bn: string;
  committeeName_en: string;
  committeeName_bn: string;
  currentYear: number;
  currentEdition: number; // 118
  heroDeityImage: string;
  mapsUrl: string;
  heroKicker_bn: string;
  heroKicker_en: string;
  topBannerEnabled: boolean;
  topBannerText_bn: string;
  topBannerText_en: string;
  aboutHeading_en: string;
  aboutHeading_bn: string;
  aboutIntro_en: string;
  aboutIntro_bn: string;
  aboutFamilyHeading_en: string;
  aboutFamilyHeading_bn: string;
  aboutFamilyText_en: string;
  aboutFamilyText_bn: string;
  aboutCommunityHeading_en: string;
  aboutCommunityHeading_bn: string;
  aboutCommunityText_en: string;
  aboutCommunityText_bn: string;
  heritageHeading_en: string;
  heritageHeading_bn: string;
  heritageIntro_en: string;
  heritageIntro_bn: string;
  bhogHeading_en: string;
  bhogHeading_bn: string;
  bhogIntro_en: string;
  bhogIntro_bn: string;
  visitHeading_en: string;
  visitHeading_bn: string;
  visitIntro_en: string;
  visitIntro_bn: string;
}
