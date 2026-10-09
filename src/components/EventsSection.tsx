import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory, EventStatus } from '../types';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { language, events } = useApp();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories: { id: string; label_bn: string; label_en: string }[] = [
    { id: 'all', label_bn: 'সকল অনুষ্ঠান', label_en: 'All Events' },
    { id: 'Durga Puja', label_bn: 'দুর্গাপূজা', label_en: 'Durga Puja' },
    { id: 'Bhog', label_bn: 'মহাপ্রসাদ ভোগ', label_en: 'Bhog Prasad' },
    { id: 'Puja Ritual', label_bn: 'পূজা আচার', label_en: 'Rituals' },
    { id: 'Community Event', label_bn: 'সর্বজনীন অনুষ্ঠান', label_en: 'Community' },
  ];

  const filteredEvents = events.filter((e) => {
    const matchCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || e.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  return (
    <section id="events" className="py-20 bg-[#F7F2E8]/80 dark:bg-[#12080B]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 border-t border-[#D4AF37]/20 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Calendar className="w-4 h-4" />
            <span>{isBn ? 'উৎসব সূচি' : 'Events & Gatherings'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
            {isBn ? 'পূজা আচার ও বিশেষ অনুষ্ঠানমালা' : 'Festival Events & Ceremonies'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans">
            {isBn
              ? 'পিন্দ্রা দুর্গা মন্দিরে মহাষষ্ঠী থেকে বিজয়া দশমী পর্যন্ত অনুষ্ঠিতব্য সকল ধর্মীয় ও সামাজিক আয়োজন।'
              : 'Detailed schedule of rituals, gatherings, and special ceremonies organized at the temple.'}
          </p>
        </div>

        {/* Interactive Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500">
            <p className="text-sm font-bengali">
              {isBn
                ? 'এই বিভাগে বর্তমানে কোনো অনুষ্ঠান তালিকাভুক্ত নেই।'
                : 'No events found for this filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const formattedDate = new Date(evt.date + 'T00:00:00').toLocaleDateString(
                isBn ? 'bn-IN' : 'en-US',
                { day: 'numeric', month: 'short', year: 'numeric' }
              );

              return (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 hover:border-[#9E1B32] dark:hover:border-[#E5C158] shadow-sm hover:shadow-md transition duration-200 group"
                >
                  {/* Stable image area: keeps every event card aligned even without an uploaded photo */}
                  <div className="h-44 w-full shrink-0 overflow-hidden relative bg-gradient-to-br from-[#3A101B] via-[#1A0C11] to-[#5A2025]">
                    {evt.image ? (
                      <img onError={(event) => { if (new URL(event.currentTarget.src).pathname !== '/real_maa_durga.jpg') event.currentTarget.src = '/real_maa_durga.jpg'; }}
                        src={evt.image}
                        alt={isBn ? evt.title_bn : evt.title_en}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#D4AF37]/80" aria-hidden="true">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 25%, #D4AF37 0, transparent 28%), radial-gradient(circle at 80% 75%, #9E1B32 0, transparent 35%)' }} />
                        <Calendar className="relative w-10 h-10" strokeWidth={1.2} />
                        <span className="relative text-[10px] tracking-[0.22em] uppercase">{isBn ? 'পূজার অনুষ্ঠান' : 'Puja Event'}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[#180A0E]/85 text-[#FFD700] border border-[#D4AF37]/30">
                      {evt.status}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Meta info without pill enclosure */}
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
                        <span>{formattedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#9E1B32] dark:text-[#E5C158] font-medium">{evt.category}</span>
                      </div>

                      <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] leading-snug">
                        {isBn ? evt.title_bn : evt.title_en}
                      </h3>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed font-sans">
                        {isBn ? evt.description_bn : evt.description_en}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#E56717]" />
                        <span>{evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
