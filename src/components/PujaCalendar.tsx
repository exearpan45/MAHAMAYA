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

  const handleDownloadDesignedCalendar = () => {
    const escapeHtml = (value: string) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const dateLabel = (value: string) => {
      const date = new Date(value + 'T00:00:00');
      return date.toLocaleDateString(isBn ? 'bn-IN' : 'en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    };
    const cards = currentPujaYear.days.map((day, index) => {
      const rituals = (isBn ? day.rituals_bn : day.rituals_en)
        .map((ritual) => '<li>' + escapeHtml(ritual) + '</li>').join('');
      const title = isBn ? day.dayName_bn : day.dayName_en;
      const timing = day.startTime
        ? '<p class="meta">◷ ' + escapeHtml(day.startTime) + (day.endTime ? ' – ' + escapeHtml(day.endTime) : '') + '</p>'
        : '';
      const bhog = day.bhogTimings
        ? '<p class="bhog">✦ ' + escapeHtml(isBn ? 'ভোগ বিতরণ: ' : 'Bhog: ') + escapeHtml(day.bhogTimings) + '</p>'
        : '';
      const note = isBn ? day.specialNotes_bn : day.specialNotes_en;
      return '<article class="day"><div class="number">' + String(index + 1).padStart(2, '0') +
        '</div><p class="date">' + escapeHtml(dateLabel(day.date)) + '</p><h2>' + escapeHtml(title) +
        '</h2><p class="bengali-date">' + escapeHtml(day.bengaliDate || '') + '</p><ul>' + rituals +
        '</ul>' + timing + bhog + (note ? '<p class="note">' + escapeHtml(note) + '</p>' : '') + '</article>';
    }).join('');
    const html = '<!doctype html><html lang="' + (isBn ? 'bn' : 'en') + '"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
      escapeHtml(settings.templeName_en + ' ' + currentPujaYear.year + ' Puja Calendar') +
      '</title><style>*{box-sizing:border-box}body{margin:0;background:#f7f1e8;color:#32121a;font-family:Arial,"Noto Sans Bengali",sans-serif;line-height:1.55}.sheet{max-width:1100px;margin:24px auto;padding:clamp(18px,4vw,42px);background:#fffdf8;border:1px solid #d4af37;box-shadow:0 12px 36px #32121a12}.hero{text-align:center;padding:18px 12px 28px;border-bottom:3px double #b58b28}.eyebrow{letter-spacing:.18em;color:#9e1b32;font-size:12px;font-weight:bold}.hero h1{font-size:clamp(27px,5vw,42px);margin:10px 0 0;color:#4a0e17}.hero h2{font-size:18px;margin:4px 0;color:#76515a}.edition{font-size:13px;color:#75666a}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px}.day{position:relative;padding:18px;border:1px solid #e5d8b9;border-radius:14px;background:linear-gradient(145deg,#fffdf8,#fff8ed);break-inside:avoid}.number{float:right;color:#b58b28;font-size:12px;font-weight:bold;border:1px solid #e5d8b9;border-radius:99px;padding:3px 8px}.date{font-size:12px;color:#9e1b32;font-weight:bold;margin:0 30px 5px 0}.day h2{font-size:22px;margin:4px 0;color:#4a0e17}.bengali-date{font-size:12px;color:#88777a;margin:0 0 12px}.day ul{padding-left:19px;margin:8px 0;font-size:13px}.day li{margin:4px 0}.meta,.bhog,.note{font-size:12px;margin:9px 0 0}.bhog{color:#176b4a;font-weight:bold}.note{background:#f7f1e8;padding:8px;border-radius:8px;color:#725c60}.footer{text-align:center;border-top:1px solid #e5d8b9;padding-top:18px;margin-top:24px;font-size:12px;color:#76666a}.actions{display:flex;justify-content:center;gap:10px;margin:0 auto 16px}.actions button{border:0;border-radius:9px;background:#9e1b32;color:white;padding:10px 16px;font-weight:bold;cursor:pointer}@media(max-width:650px){.grid{grid-template-columns:1fr}.sheet{margin:0;border:0}.day h2{font-size:20px}}@media print{body{background:white}.sheet{margin:0;max-width:none;border:0;box-shadow:none;padding:8mm}.actions{display:none}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.day{padding:12px}.day h2{font-size:17px}.day ul{font-size:11px}@page{size:A4;margin:10mm}}</style></head><body><main class="sheet"><div class="actions"><button onclick="window.print()">' +
      escapeHtml(isBn ? 'প্রিন্ট / PDF হিসেবে সংরক্ষণ' : 'Print / Save as PDF') +
      '</button></div><header class="hero"><p class="eyebrow">॥ শ্রী শ্রী দুর্গায়ৈ নমঃ ॥</p><h1>' +
      escapeHtml(settings.templeName_bn) + '</h1><h2>' + escapeHtml(settings.templeName_en) +
      '</h2><p class="edition">' + escapeHtml(settings.committeeName_bn) + ' • ' +
      escapeHtml(String(currentPujaYear.edition)) + 'তম বর্ষ · ' + escapeHtml(String(currentPujaYear.year)) +
      '</p><p class="edition">' + escapeHtml(isBn ? 'ব্রাহ্মণ পাড়া, পিন্দ্রা' : 'Brahman Para, Pinrra') +
      '</p></header><section class="grid">' + cards + '</section><footer class="footer">' +
      escapeHtml(isBn ? 'পূজার সময়সূচী কমিটির সিদ্ধান্ত অনুযায়ী পরিবর্তনযোগ্য।' : 'Timings may change according to committee guidance.') +
      '<br>' + escapeHtml(window.location.origin) + '</footer></main></body></html>';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pinrra-durga-mandir-' + currentPujaYear.year + '-designed-calendar.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

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
              onClick={handleDownloadDesignedCalendar}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#9E1B32] hover:bg-[#7F1528] text-white text-xs sm:text-sm font-semibold border border-[#D4AF37]/40 transition-colors cursor-pointer"
              title={isBn ? 'সুন্দর নকশার ক্যালেন্ডার ফাইল ডাউনলোড করুন' : 'Download a designed calendar file'}
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'ক্যালেন্ডার ডাউনলোড' : 'Download Designed Calendar'}</span>
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
