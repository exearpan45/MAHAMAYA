import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Calendar, Bell, Image as ImageIcon, History, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    language,
    searchModalOpen,
    setSearchModalOpen,
    events,
    announcements,
    gallery,
    historyMilestones,
    currentPujaYear,
    setActiveView,
  } = useApp();

  const [query, setQuery] = useState('');
  const isBn = language === 'bn';

  if (!searchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results
  const matchedEvents = q
    ? events.filter(
        (e) =>
          e.title_en.toLowerCase().includes(q) ||
          e.title_bn.toLowerCase().includes(q) ||
          e.description_en.toLowerCase().includes(q) ||
          e.description_bn.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    : [];

  const matchedAnnouncements = q
    ? announcements.filter(
        (a) =>
          a.title_en.toLowerCase().includes(q) ||
          a.title_bn.toLowerCase().includes(q) ||
          a.description_en.toLowerCase().includes(q) ||
          a.description_bn.toLowerCase().includes(q)
      )
    : [];

  const matchedGallery = q
    ? gallery.filter(
        (g) =>
          g.title_en.toLowerCase().includes(q) ||
          g.title_bn.toLowerCase().includes(q) ||
          g.description_en.toLowerCase().includes(q) ||
          g.description_bn.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      )
    : [];

  const matchedHistory = q
    ? historyMilestones.filter(
        (h) =>
          h.title_en.toLowerCase().includes(q) ||
          h.title_bn.toLowerCase().includes(q) ||
          h.description_en.toLowerCase().includes(q) ||
          h.description_bn.toLowerCase().includes(q) ||
          h.year.toLowerCase().includes(q)
      )
    : [];

  const matchedDays = q
    ? currentPujaYear.days.filter(
        (d) =>
          d.dayName_en.toLowerCase().includes(q) ||
          d.dayName_bn.toLowerCase().includes(q) ||
          d.rituals_en.some((r) => r.toLowerCase().includes(q)) ||
          d.rituals_bn.some((r) => r.toLowerCase().includes(q))
      )
    : [];

  const totalResults =
    matchedEvents.length +
    matchedAnnouncements.length +
    matchedGallery.length +
    matchedHistory.length +
    matchedDays.length;

  const handleSelectResult = (sectionId: string) => {
    setSearchModalOpen(false);
    setActiveView(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9E1B32] dark:text-[#E5C158] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isBn
                ? 'অনুষ্ঠান, ভোগ, ইতিহাস, পঞ্জিকা বা ছবি খুঁজুন...'
                : 'Search events, bhog, rituals, history, gallery...'
            }
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query ? (
            <div className="text-center py-8 text-xs text-neutral-500 font-sans space-y-2">
              <p>{isBn ? 'বাংলা অথবা ইংরেজিতে অনুসন্ধান করুন' : 'Type in Bengali or English to search'}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['সন্ধিপূজা', 'Bhog', '118 Years', 'মহাষ্টমী', 'Sindoor'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] hover:text-[#9E1B32] dark:hover:text-[#E5C158] cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-sm font-bengali">
              {isBn ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'No matching results found.'}
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Calendar Days */}
              {matchedDays.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isBn ? 'পূজা নির্ঘণ্ট' : 'Puja Schedule'}</span>
                  </div>
                  {matchedDays.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSelectResult('puja-calendar')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-[#9E1B32]/10 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-bengali">
                          {isBn ? d.dayName_bn : d.dayName_en} ({d.date})
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate max-w-md">
                          {(isBn ? d.rituals_bn : d.rituals_en).join(', ')}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Events */}
              {matchedEvents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isBn ? 'অনুষ্ঠান' : 'Events'}</span>
                  </div>
                  {matchedEvents.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleSelectResult('events')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-[#9E1B32]/10 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-bengali">
                          {isBn ? e.title_bn : e.title_en}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate max-w-md">
                          {isBn ? e.description_bn : e.description_en}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Announcements */}
              {matchedAnnouncements.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isBn ? 'বিজ্ঞপ্তি' : 'Announcements'}</span>
                  </div>
                  {matchedAnnouncements.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleSelectResult('announcements')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-[#9E1B32]/10 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-bengali">
                          {isBn ? a.title_bn : a.title_en}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate max-w-md">
                          {isBn ? a.description_bn : a.description_en}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {matchedGallery.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{isBn ? 'চিত্রশালা' : 'Gallery'}</span>
                  </div>
                  {matchedGallery.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleSelectResult('gallery')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-[#9E1B32]/10 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-bengali">
                          {isBn ? g.title_bn : g.title_en}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate max-w-md">
                          {g.category} • {g.uploaderName}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158]" />
                    </button>
                  ))}
                </div>
              )}

              {/* History */}
              {matchedHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ইতিহাস' : 'History'}</span>
                  </div>
                  {matchedHistory.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => handleSelectResult('history')}
                      className="w-full text-left p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-[#9E1B32]/10 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-bengali">
                          {isBn ? h.title_bn : h.title_en} ({h.year})
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate max-w-md">
                          {isBn ? h.description_bn : h.description_en}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
