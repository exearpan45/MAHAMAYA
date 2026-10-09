import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Sparkles, Download, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export const PujaCalendar: React.FC = () => {
  const { language, currentPujaYear, setDownloadModalOpen, settings } = useApp();
  const isBn = language === 'bn';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopyDetails = async () => {
    const lines = [
      settings.templeName_en + ' | ' + settings.templeName_bn,
      isBn ? 'দুর্গাপূজা ' + currentPujaYear.year : 'Durga Puja ' + currentPujaYear.year,
      '',
      ...currentPujaYear.days.map((day) => {
        const date = new Date(day.date + 'T00:00:00').toLocaleDateString(
          isBn ? 'bn-IN' : 'en-IN',
          { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
        );
        const name = isBn ? day.dayName_bn : day.dayName_en;
        const time = day.startTime ? ' | ' + (isBn ? 'সময়: ' : 'Time: ') + day.startTime : '';
        return date + ' | ' + name + time;
      }),
      '',
      (isBn ? 'স্থান: ' : 'Venue: ') + 'Pinrra Durga Mandir, Brahman Para',
      window.location.origin,
    ];
    const textToCopy = lines.join('\n');

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2200);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 2800);
    }
  };
  const escapeIcsText = (value: string) =>
    value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  const handleAddToCalendar = () => {
    const formatDate = (value: string) => value.replace(/-/g, '');
    const events = currentPujaYear.days.map((day, index) => {
      const start = formatDate(day.date);
      const nextDate = new Date(day.date + 'T00:00:00');
      nextDate.setDate(nextDate.getDate() + 1);
      const end = [
        nextDate.getFullYear(),
        String(nextDate.getMonth() + 1).padStart(2, '0'),
        String(nextDate.getDate()).padStart(2, '0'),
      ].join('');
      const title = isBn ? day.dayName_bn : day.dayName_en;
      const rituals = (isBn ? day.rituals_bn : day.rituals_en).join(' • ');
      const description = [
        settings.templeName_en,
        settings.templeName_bn,
        rituals,
        day.startTime ? (isBn ? 'সময়: ' : 'Time: ') + day.startTime : '',
        day.bhogTimings ? (isBn ? 'ভোগ: ' : 'Bhog: ') + day.bhogTimings : '',
        window.location.origin,
      ].filter(Boolean).join('\n');

      return [
        'BEGIN:VEVENT',
        'UID:mahamaya-' + currentPujaYear.year + '-' + (day.id || index) + '@mahamaya',
        'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
        'DTSTART;VALUE=DATE:' + start,
        'DTEND;VALUE=DATE:' + end,
        'SUMMARY:' + escapeIcsText(settings.templeName_en + ' — ' + title),
        'DESCRIPTION:' + escapeIcsText(description),
        'LOCATION:' + escapeIcsText('Pinrra Durga Mandir, Brahman Para'),
        'END:VEVENT',
      ].join('\r\n');
    });

    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MAHAMAYA//Pinrra Durga Mandir//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pinrra-durga-mandir-' + currentPujaYear.year + '-calendar.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section id="puja" className="py-20 bg-[#FDFBF7]/80 dark:bg-[#150A0E]/85 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header with Title and Download Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#D4AF37]/30">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#9E1B32] dark:text-[#E5C158]">
              <Calendar className="w-4 h-4" />
              <span>
                {isBn
                  ? `${currentPujaYear.year} শ্রী শ্রী শারদীয়া দুর্গাপূজা নির্ঘণ্ট`
                  : `${currentPujaYear.year} Durga Puja Calendar & Schedule`}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] tracking-tight">
              {isBn ? 'পূজা পরিক্রমা ও আচার নির্ঘণ্ট' : 'Ritual Calendar & Timetable'}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-sans max-w-2xl">
              {isBn
                ? 'পিন্দ্রা দুর্গা মন্দিরের ১১৮তম বর্ষের শারদোৎসবের অনুমোদিত তিথি, প্রধান পূজা আচার ও অনুষ্ঠানের নির্ঘণ্ট।'
                : 'Official festival timetable for the 118th Durga Puja at Pinrra Durga Mandir, covering Shashthi through Vijaya Dashami.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopyDetails}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8B6410] dark:text-[#E5C158] text-xs sm:text-sm font-semibold border border-[#D4AF37]/40 transition-colors cursor-pointer"
              title={isBn ? 'পূজার তারিখ ও স্থান কপি করুন' : 'Copy Puja dates and venue'}
              aria-live="polite"
            >
              {copyStatus === 'copied' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copyStatus === 'copied'
                  ? (isBn ? 'কপি হয়েছে!' : 'Copied!')
                  : copyStatus === 'error'
                    ? (isBn ? 'কপি হয়নি' : 'Copy failed')
                    : (isBn ? 'বিবরণ কপি করুন' : 'Copy Details')}
              </span>
            </button>
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8B6410] dark:text-[#E5C158] text-xs sm:text-sm font-semibold border border-[#D4AF37]/40 transition-colors cursor-pointer"
              title={isBn ? 'ফোন বা কম্পিউটারের ক্যালেন্ডারে যোগ করুন' : 'Import Puja dates into your calendar app'}
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? 'ক্যালেন্ডারে যোগ করুন' : 'Add to Calendar'}</span>
            </button>
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#9E1B32] hover:bg-[#B81D39] text-white text-xs sm:text-sm font-semibold shadow-md border border-[#D4AF37]/40 hover:shadow-lg transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'পূজা পঞ্জিকা ডাউনলোড / প্রিন্ট' : 'Download / Print Calendar'}</span>
            </button>
          </div>
        </div>

        {/* Calendar Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPujaYear.days.map((day, idx) => {
            const formattedDate = new Date(day.date + 'T00:00:00').toLocaleDateString(
              isBn ? 'bn-IN' : 'en-US',
              { day: 'numeric', month: 'long', year: 'numeric' }
            );

            return (
              <div
                key={day.id || idx}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 hover:border-[#9E1B32] dark:hover:border-[#E5C158] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar: Date & Bengali Date */}
                  <div className="flex items-start justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <div>
                      <span className="text-xs font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider block">
                        {formattedDate}
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bengali">
                        {day.bengaliDate}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Day Name */}
                  <h3 className="text-xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] group-hover:text-[#9E1B32] dark:group-hover:text-[#E5C158] transition-colors">
                    {isBn ? day.dayName_bn : day.dayName_en}
                  </h3>

                  {/* Rituals List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {isBn ? 'প্রধান আচার ও অনুষ্ঠান' : 'Key Rituals & Observances'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                      {(isBn ? day.rituals_bn : day.rituals_en).map((rit, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{rit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timing & Bhog Info */}
                  {(day.startTime || day.bhogTimings) && (
                    <div className="pt-2 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 border-t border-neutral-100 dark:border-neutral-800/80">
                      {day.startTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#E56717]" />
                          <span>
                            {isBn ? 'পূজা সময়:' : 'Timing:'} {day.startTime} {day.endTime ? `- ${day.endTime}` : ''}
                          </span>
                        </div>
                      )}
                      {day.bhogTimings && (
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {isBn ? 'ভোগ বিতরণ:' : 'Bhog Distribution:'} {day.bhogTimings}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Special Notes */}
                  {(isBn ? day.specialNotes_bn : day.specialNotes_en) && (
                    <p className="text-[11px] italic text-neutral-500 dark:text-neutral-400 bg-neutral-100/60 dark:bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50">
                      {isBn ? day.specialNotes_bn : day.specialNotes_en}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Bhog & Calendar Updates */}
        <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-[#D4AF37]/30 text-xs text-neutral-600 dark:text-neutral-400 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>
            {isBn
              ? 'পূজার সঠিক নির্ঘণ্ট ও ভোগের সময়সূচী পঞ্জিকা অনুসারে এবং মন্দির কমিটির সিদ্ধান্ত সাপেক্ষে চূড়ান্ত হবে।'
              : 'Timings and ritual schedule are maintained according to authentic Panjika and committee guidance.'}
          </span>
        </div>
      </div>
    </section>
  );
};
