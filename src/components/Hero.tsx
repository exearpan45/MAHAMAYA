import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, MapPin, ChevronDown, Compass, Camera, ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, settings, setRealMaaDurgaPhoto, currentUser } = useApp();
  const isBn = language === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const canManagePhoto = currentUser && ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role);

  const handleRealPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void setRealMaaDurgaPhoto(file);
    e.currentTarget.value = '';
  };

  return (
    <section id="home" className="hero-premium relative overflow-hidden">
      <div className="hero-atmosphere" aria-hidden="true" />
      {canManagePhoto && (
        <div className="hero-photo-admin">
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleRealPhotoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="hero-photo-admin-button" title={isBn ? 'প্রকৃত প্রতিমার ছবি পরিবর্তন করুন' : 'Choose a real temple photo'}>
            <Camera className="w-4 h-4" /><span>{isBn ? 'প্রকৃত ছবি' : 'Change real photo'}</span>
          </button>
        </div>
      )}
      <div className="hero-shell">
        <div className="hero-copy">
          <div className="hero-kicker"><Sparkles className="h-4 w-4" aria-hidden="true" /><span>{isBn ? settings.heroKicker_bn : settings.heroKicker_en}</span><span className="hero-kicker-line" /></div>
          <p className="hero-eyebrow">{isBn ? 'মহামায়া দুর্গোৎসব সমিতি • ২০২৬' : 'MAHAMAYA DURGA PUJA COMMITTEE · 2026'}</p>
          <h1>{isBn ? 'পিন্দ্রা দুর্গা মন্দির' : 'Pinrra Durga Mandir'}</h1>
          <p className="hero-bengali-name">{isBn ? 'Pinrra Durga Mandir' : 'পিন্দ্রা দুর্গা মন্দির'}</p>
          <div className="hero-edition"><span className="hero-edition-number">118</span><span className="hero-edition-copy"><strong>{isBn ? 'গৌরবময় বছর' : 'Years of devotion'}</strong><span>{isBn ? '১৯০৮–২০২৬ • ঐতিহ্য ও একতা' : '1908–2026 · Heritage, faith & community'}</span></span></div>
          <p className="hero-description">{isBn ? 'ব্রাহ্মণ পাড়ার প্রজন্ম থেকে প্রজন্মে বহমান এক সর্বজনীন শারদোৎসব, ভক্তি, ঐতিহ্য ও সম্মিলিত উদ্যোগের বন্ধনে।' : 'A community Durga Puja shaped by generations of devotion in Brahman Para, bringing together heritage, culture, and the people who keep it alive.'}</p>
          <div className="hero-actions">
            <button type="button" onClick={() => scrollToSection('heritage')} className="hero-button hero-button-primary"><span>{isBn ? 'পূজার ঐতিহ্য দেখুন' : 'Discover our heritage'}</span><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => scrollToSection('puja')} className="hero-button hero-button-secondary"><Calendar className="h-4 w-4" aria-hidden="true" /><span>{isBn ? 'পূজা নির্ঘণ্ট' : 'Puja schedule'}</span></button>
            <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="hero-location-link"><MapPin className="h-4 w-4" aria-hidden="true" /><span>{isBn ? 'মন্দিরের অবস্থান' : 'Find the temple'}</span></a>
          </div>
          <div className="hero-footnote"><Compass className="h-4 w-4" aria-hidden="true" /><span>{isBn ? 'অলাভজনক সর্বজনীন পূজা • কোনো অনুদান সংগ্রহ নয়' : 'A non-profit community celebration · No donation collection'}</span></div>
          <button type="button" onClick={() => scrollToSection('heritage')} className="hero-scroll-cue"><span>{isBn ? 'আরও জানুন' : 'Explore the story'}</span><ChevronDown className="h-4 w-4" aria-hidden="true" /></button>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-frame">
            <img src={settings.heroDeityImage} alt={isBn ? 'পিন্দ্রা দুর্গা মন্দিরের প্রকৃত দুর্গা প্রতিমা' : 'Real Maa Durga idol at Pinrra Durga Mandir'} referrerPolicy="no-referrer" fetchPriority="high" />
            <div className="hero-photo-vignette" aria-hidden="true" />
            <div className="hero-photo-caption"><span className="hero-photo-caption-mark" aria-hidden="true">॥</span><span><strong>{isBn ? 'শ্রী শ্রী দুর্গা পূজা' : 'Shree Shree Durga Puja'}</strong><small>{isBn ? 'পিন্দ্রা দুর্গা মন্দির · ব্রাহ্মণ পাড়া' : 'Pinrra Durga Mandir · Brahman Para'}</small></span></div>
          </div>
          <div className="hero-photo-seal" aria-label="118 years of devotion"><span>118</span><small>{isBn ? 'বর্ষ' : 'YEARS'}</small></div>
          <div className="hero-visual-note"><span className="hero-visual-note-dot" /><span>{isBn ? 'ভক্তি • ঐতিহ্য • একতা' : 'DEVOTION · HERITAGE · UNITY'}</span></div>
        </div>
      </div>
    </section>
  );
};
