import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';
import { Film, Play, X, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const getYouTubeId = (value: string) => {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }
  return null;
};

const getVimeoId = (value: string) => {
  try {
    const url = new URL(value);
    if (!url.hostname.includes('vimeo.com')) return null;
    const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
    return match?.[1] || null;
  } catch {
    return null;
  }
};

const isDirectVideo = (value: string) => /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(value);

export const VideoGallery: React.FC = () => {
  const { language, videos } = useApp();
  const isBn = language === 'bn';
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const featuredVideos = useMemo(
    () => videos.filter((video) => video.featured),
    [videos],
  );

  const orderedVideos = useMemo(() => {
    const featured = videos.filter((video) => video.featured);
    const rest = videos.filter((video) => !video.featured);
    return [...featured, ...rest];
  }, [videos]);

  const displayedVideos = showAllVideos ? orderedVideos : orderedVideos.slice(0, 3);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideo(null);
      if (event.key === 'ArrowRight') {
        const index = orderedVideos.findIndex((video) => video.id === activeVideo.id);
        if (orderedVideos.length) setActiveVideo(orderedVideos[(index + 1) % orderedVideos.length]);
      }
      if (event.key === 'ArrowLeft') {
        const index = orderedVideos.findIndex((video) => video.id === activeVideo.id);
        if (orderedVideos.length) setActiveVideo(orderedVideos[(index - 1 + orderedVideos.length) % orderedVideos.length]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo, orderedVideos]);

  if (!videos.length) return null;

  const getEmbed = (video: VideoItem) => {
    const youtubeId = getYouTubeId(video.videoUrl);
    if (youtubeId) return { type: 'youtube' as const, src: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1` };
    const vimeoId = getVimeoId(video.videoUrl);
    if (vimeoId) return { type: 'vimeo' as const, src: `https://player.vimeo.com/video/${vimeoId}` };
    if (isDirectVideo(video.videoUrl)) return { type: 'direct' as const, src: video.videoUrl };
    return { type: 'external' as const, src: video.videoUrl };
  };

  return (
    <section id="videos" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Film className="w-4 h-4" />
            <span>{isBn ? 'ভিডিও আর্কাইভ' : 'Video Archive'}</span>
          </div>
          <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
                {isBn ? 'পূজা ও মন্দিরের ভিডিও' : 'Puja & Temple Videos'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl">
                {isBn
                  ? 'মা দুর্গার আরাধনা, পবিত্র আচার ও সম্প্রদায়ের স্মরণীয় মুহূর্তের নির্বাচিত ভিডিও সংগ্রহ।'
                  : 'A curated collection of Maa Durga worship, sacred rituals, temple moments, and community memories.'}
              </p>
            </div>
            {featuredVideos.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#FFF8E8]/80 dark:bg-[#2A160A]/70 px-3 py-1.5 text-[11px] font-semibold text-[#7A4A00] dark:text-[#F6D98B]">
                <Sparkles className="w-3.5 h-3.5" />
                {isBn ? `${featuredVideos.length}টি নির্বাচিত ভিডিও` : `${featuredVideos.length} featured video${featuredVideos.length === 1 ? '' : 's'}`}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVideos.map((video) => (
            <button
              type="button"
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#FFFDF9] dark:bg-[#1A0C11] text-left shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-950">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={isBn ? video.title_bn : video.title_en}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    width={640}
                    height={360}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#250B12] via-[#4A0E17] to-[#12080B]">
                    <Film className="w-12 h-12 text-[#E5C158]/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />
                <span className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FFD700] backdrop-blur-md">
                  {video.category}
                </span>
                {video.featured && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-black/60 px-2 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-md">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#9E1B32] shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </span>
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-base font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] leading-snug line-clamp-2">
                  {isBn ? video.title_bn : video.title_en}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {isBn ? video.description_bn : video.description_en}
                </p>
                <div className="pt-1 text-[10px] text-neutral-400">{video.pujaYear} • {video.category}</div>
              </div>
            </button>
          ))}
        </div>

        {orderedVideos.length > 3 && (
          <div className="flex justify-center -mt-4">
            <button
              type="button"
              onClick={() => setShowAllVideos((value) => !value)}
              className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFDF9] dark:bg-[#1A0C11] px-5 py-3 text-sm font-semibold text-[#9E1B32] dark:text-[#E5C158] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            >
              {showAllVideos
                ? (isBn ? 'কম ভিডিও দেখুন' : 'Show fewer videos')
                : (isBn ? `সব ভিডিও দেখুন (${orderedVideos.length})` : `View all videos (${orderedVideos.length})`)}
            </button>
          </div>
        )}

        {activeVideo && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? 'ভিডিও প্লেয়ার' : 'Video player'}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveVideo(null);
            }}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-neutral-700 bg-neutral-900/90 p-2.5 text-white hover:bg-neutral-800"
              aria-label={isBn ? 'বন্ধ করুন' : 'Close video'}
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => {
                const index = orderedVideos.findIndex((video) => video.id === activeVideo.id);
                setActiveVideo(orderedVideos[(index - 1 + orderedVideos.length) % orderedVideos.length]);
              }}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-700 bg-neutral-900/90 p-2.5 text-white hover:bg-neutral-800"
              aria-label={isBn ? 'আগের ভিডিও' : 'Previous video'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const index = orderedVideos.findIndex((video) => video.id === activeVideo.id);
                setActiveVideo(orderedVideos[(index + 1) % orderedVideos.length]);
              }}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-700 bg-neutral-900/90 p-2.5 text-white hover:bg-neutral-800"
              aria-label={isBn ? 'পরের ভিডিও' : 'Next video'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-full max-w-5xl space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-black shadow-2xl">
                {getEmbed(activeVideo).type === 'direct' ? (
                  <video src={activeVideo.videoUrl} controls playsInline preload="metadata" className="h-full w-full" poster={activeVideo.thumbnailUrl} />
                ) : getEmbed(activeVideo).type === 'external' ? (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
                    <Film className="w-12 h-12 text-[#E5C158]" />
                    <p className="text-sm text-neutral-300">{isBn ? 'এই ভিডিওটি একটি বাহ্যিক লিঙ্কে রয়েছে।' : 'This video is hosted on an external page.'}</p>
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#9E1B32] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#7F1528]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isBn ? 'ভিডিও খুলুন' : 'Open Video'}
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={getEmbed(activeVideo).src}
                    title={isBn ? activeVideo.title_bn : activeVideo.title_en}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 px-5 py-4 text-white">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-[#FFD700]">
                  <span>{activeVideo.category}</span><span>•</span><span>{activeVideo.pujaYear}</span>
                </div>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold font-bengali">{isBn ? activeVideo.title_bn : activeVideo.title_en}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-300">{isBn ? activeVideo.description_bn : activeVideo.description_en}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
