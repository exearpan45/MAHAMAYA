import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryCategory, GalleryPhoto } from '../types'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2, User, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { language, gallery } = useApp();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPujaYear, setSelectedPujaYear] = useState<number | 'all'>('all');
  const isFullGalleryPage = window.location.pathname.replace(/\/+$/, '') === '/gallery';
  const [showAllPhotos, setShowAllPhotos] = useState(isFullGalleryPage);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories: { id: string; label_bn: string; label_en: string }[] = [
    { id: 'all', label_bn: 'সকল চিত্র', label_en: 'All Photos' },
    { id: 'Maa Durga', label_bn: 'মা দুর্গা প্রতিমা', label_en: 'Maa Durga' },
    { id: 'Temple', label_bn: 'মন্দির প্রাঙ্গণ', label_en: 'Temple' },
    { id: 'Durga Puja', label_bn: 'পূজা আচার', label_en: 'Durga Puja' },
    { id: 'Bhog', label_bn: 'মহাপ্রসাদ ভোগ', label_en: 'Bhog' },
    { id: 'Historical Photos', label_bn: 'ঐতিহাসিক ছবি', label_en: 'Historical' },
    { id: 'Community', label_bn: 'সর্বজনীন মুহূর্ত', label_en: 'Community' },
  ];

  const pujaYears = Array.from(new Set(gallery.map((photo) => photo.pujaYear)))
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => b - a);

  const filteredPhotos = gallery.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesYear = selectedPujaYear === 'all' || p.pujaYear === selectedPujaYear;
    return matchesCategory && matchesYear;
  });

  const displayedPhotos = (showAllPhotos || isFullGalleryPage) ? filteredPhotos : filteredPhotos.slice(0, 8);

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header and Upload Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#D4AF37]/30">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
              <ImageIcon className="w-4 h-4" />
              <span>{isBn ? 'চিত্রশালা' : 'Visual Gallery'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
              {isBn ? 'পবিত্র মুহূর্তের চিত্রসম্ভার' : 'Temple & Puja Gallery'}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans max-w-2xl">
              {isBn
                ? 'পিন্দ্রা দুর্গা মন্দিরের মা দুর্গার পবিত্র প্রতিমা, ঐতিহ্যবাহী আচার ও ভক্তবৃন্দের পূণ্য মুহূর্তের আলোকচিত্র।'
                : 'A curated visual record of Maa Durga pratima, festive traditions, Sandhi Puja, and community memories.'}
            </p>
            {!isFullGalleryPage && (
              <a href="/gallery/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#9E1B32] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7F1528] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                {isBn ? 'সব ছবি দেখুন' : 'View full gallery'}
                <span aria-hidden="true">→</span>
              </a>
            )}
            {isFullGalleryPage && (
              <p className="text-xs font-medium text-[#9E1B32] dark:text-[#E5C158]">
                {isBn ? 'সম্পূর্ণ ছবি সংগ্রহ' : 'Full photo collection'} · {gallery.length} {isBn ? 'টি ছবি' : gallery.length === 1 ? 'photo' : 'photos'}
              </p>
            )}
          </div>

        {/* Puja year photo albums, derived from existing gallery metadata */}
        {pujaYears.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#4A0E17] dark:text-[#FBF6EF]">
                  {isBn ? 'পূজাবর্ষের অ্যালবাম' : 'Puja Year Albums'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {isBn ? 'বছর নির্বাচন করে সেই বছরের স্মৃতিচিত্র দেখুন।' : 'Choose a year to explore its photo memories.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedPujaYear('all'); setShowAllPhotos(false); }}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer ${selectedPujaYear === 'all' ? 'border-[#9E1B32] text-[#9E1B32] dark:text-[#E5C158]' : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'}`}
              >
                {isBn ? 'সব বছর' : 'All years'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {pujaYears.map((year) => {
                const yearPhotos = gallery.filter((photo) => photo.pujaYear === year);
                const cover = yearPhotos.find((photo) => photo.featured) || yearPhotos[0];
                const selected = selectedPujaYear === year;
                return (
                  <button
                    type="button"
                    key={year}
                    onClick={() => { setSelectedPujaYear(year); setShowAllPhotos(false); }}
                    aria-pressed={selected}
                    aria-label={isBn ? `${year} সালের পূজার ছবি, ${yearPhotos.length}টি` : `${year} Puja photo album, ${yearPhotos.length} photos`}
                    className={`group overflow-hidden rounded-xl border text-left transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${selected ? 'border-[#9E1B32] ring-1 ring-[#9E1B32]/40' : 'border-[#D4AF37]/30 hover:border-[#9E1B32]/60'}`}
                  >
                    <div className="relative aspect-[16/9] bg-[#F3E9D8] dark:bg-neutral-900">
                      {cover && (
                        <img
                          src={cover.thumbnailUrl || cover.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      )}
                      <span className="absolute top-2 right-2 rounded-full bg-black/65 text-white px-2 py-1 text-[10px] font-bold">
                        {yearPhotos.length} {isBn ? 'টি ছবি' : yearPhotos.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#FFFDF9] dark:bg-[#1A0C11]">
                      <p className="font-bold text-sm text-[#4A0E17] dark:text-[#FBF6EF]">{year}</p>
                      <p className="text-[11px] text-neutral-500 mt-1">{isBn ? 'পূজার স্মৃতিচিত্র' : 'Puja memories'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { setSelectedCategory(c.id); setShowAllPhotos(false); }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#9E1B32] text-white shadow-sm'
                    : 'bg-[#FFFDF9] dark:bg-[#1A0C11] text-neutral-700 dark:text-neutral-300 hover:text-[#9E1B32] dark:hover:text-[#E5C158] border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {isBn ? c.label_bn : c.label_en}
              </button>
            );
          })}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-900 border border-[#D4AF37]/35 shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3]"
            >
              <img
                src={photo.imageUrl}
                alt={isBn ? photo.title_bn : photo.title_en}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                width={640}
                height={480}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-reduce:transform-none transition-transform duration-300"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Top Badge: Category */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#FFD700] bg-[#180A0E]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#D4AF37]/30 uppercase tracking-wider">
                  {photo.category}
                </span>
                {photo.featured && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-[#180A0E]/85 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 text-white">
                <h3 className="text-base font-bold font-bengali leading-snug drop-shadow">
                  {isBn ? photo.title_bn : photo.title_en}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="truncate max-w-[180px] font-sans">
                    {photo.uploaderName}
                  </span>
                  <span className="text-[#FFD700] text-xs flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isFullGalleryPage && filteredPhotos.length > 8 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllPhotos((value) => !value)}
              className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFDF9] dark:bg-[#1A0C11] px-5 py-3 text-sm font-semibold text-[#9E1B32] dark:text-[#E5C158] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            >
              {showAllPhotos
                ? (isBn ? 'কম ছবি দেখুন' : 'Show fewer photos')
                : (isBn ? `সব ছবি দেখুন (${filteredPhotos.length})` : `View all photos (${filteredPhotos.length})`)}
            </button>
          </div>
        )}

        {/* Fullscreen Modal Lightbox */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 cursor-pointer"
              aria-label="Close fullscreen gallery viewer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox View */}
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4">
              <div className="max-h-[72vh] overflow-hidden rounded-xl border border-[#D4AF37]/40 shadow-2xl">
                <img
                  src={activePhoto.imageUrl}
                  alt={isBn ? activePhoto.title_bn : activePhoto.title_en}
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] max-w-full object-contain"
                loading="lazy"
                decoding="async"
                />
              </div>

              {/* Caption Card */}
              <div className="text-center space-y-1.5 max-w-2xl px-4 text-white">
                <div className="inline-block text-[11px] font-semibold text-[#FFD700] uppercase tracking-wider">
                  {activePhoto.category} • {activePhoto.pujaYear}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-bengali">
                  {isBn ? activePhoto.title_bn : activePhoto.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans">
                  {isBn ? activePhoto.description_bn : activePhoto.description_en}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {isBn ? 'সংগ্রহ:' : 'Gallery'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
     </div>
    </section>
  );
};
