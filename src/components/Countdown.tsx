import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
  isDuringPuja: boolean;
  statusText_en: string;
  statusText_bn: string;
  activeTargetYear: number;
}

export const Countdown: React.FC = () => {
  const { language, currentPujaYear, pujaYears, settings } = useApp();
  const isBn = language === 'bn';

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
    isDuringPuja: false,
    statusText_en: '',
    statusText_bn: '',
    activeTargetYear: 2026,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();

      // Active configured year
      const activeYear = currentPujaYear || pujaYears[0];
      const shasthiDate = new Date(`${activeYear.shasthiDate}T00:00:00`);
      const dashamiDate = new Date(`${activeYear.dashamiDate}T23:59:59`);

      let targetDate: Date;
      let isDuring = false;
      let isConcluded = false;
      let statusEn = '';
      let statusBn = '';
      let displayYear = activeYear.year;

      if (now < shasthiDate) {
        // Before Puja
        targetDate = shasthiDate;
        statusEn = `Durga Puja ${activeYear.year} begins in`;
        statusBn = `${activeYear.year} সালের দুর্গাপূজা শুরু হতে বাকি`;
      } else if (now >= shasthiDate && now <= dashamiDate) {
        // During festival
        isDuring = true;
        targetDate = dashamiDate;
        statusEn = `Durga Puja ${activeYear.year} is now underway!`;
        statusBn = `${activeYear.year} সালের শারদোৎসব এখন আনন্দমুখরভাবে চলছে!`;
      } else {
        // After Dashami of active year: find next configured year
        isConcluded = true;
        const nextYear = pujaYears.find((y) => y.year > activeYear.year);
        if (nextYear) {
          targetDate = new Date(`${nextYear.shasthiDate}T00:00:00`);
          displayYear = nextYear.year;
          statusEn = `Next Durga Puja (${nextYear.year}) begins in`;
          statusBn = `পরবর্তী দুর্গাপূজা (${nextYear.year}) শুরু হতে বাকি`;
        } else {
          // If next year not yet configured, default 1 year ahead
          targetDate = new Date(`${activeYear.year + 1}-10-06T00:00:00`);
          displayYear = activeYear.year + 1;
          statusEn = `Next Durga Puja (${displayYear}) begins in`;
          statusBn = `পরবর্তী দুর্গাপূজা (${displayYear}) শুরু হতে বাকি`;
        }
      }

      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0 && isDuring) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: false,
          isDuringPuja: true,
          statusText_en: `Durga Puja ${displayYear} is now underway!`,
          statusText_bn: `${displayYear} সালের শারদোৎসব এখন চলছে!`,
          activeTargetYear: displayYear,
        });
        return;
      }

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / 1000 / 60) % 60));
      const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPassed: isConcluded,
        isDuringPuja: isDuring,
        statusText_en: statusEn,
        statusText_bn: statusBn,
        activeTargetYear: displayYear,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [currentPujaYear, pujaYears]);

  // Bengali numerals conversion
  const toBnNum = (n: number | string): string => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n)
      .split('')
      .map((char) => {
        const d = parseInt(char, 10);
        return isNaN(d) ? char : bnDigits[d];
      })
      .join('');
  };

  const formatUnit = (val: number) => {
    const padded = String(val).padStart(2, '0');
    return isBn ? toBnNum(padded) : padded;
  };

  return (
    <section id="countdown" className="relative py-14 bg-gradient-to-b from-[#FFFDF9]/95 to-[#F5EFE6]/95 dark:from-[#180A0E] dark:to-[#250F16] text-[#4A0E17] dark:text-[#FBF6EE] border-b border-[#D4AF37]/25 shadow-inner transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Header Indicator */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E1B32]/10 dark:bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-semibold text-[#9E1B32] dark:text-[#E5C158]">
            <Clock className="w-3.5 h-3.5 text-[#E56717]" />
            <span>
              {isBn
                ? `মহা ষষ্ঠী ${toBnNum(timeLeft.activeTargetYear)}`
                : `Maha Shasthi ${timeLeft.activeTargetYear}`}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-bengali text-[#4A0E17] dark:text-white">
            {isBn ? timeLeft.statusText_bn : timeLeft.statusText_en}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans">
            {isBn
              ? `${toBnNum(16)} অক্টোবর ${toBnNum(2026)} — দেবী দুর্গার শুভ বোধন ও পূজারম্ভ`
              : '16 October 2026 — Auspicious Bodhon & Commencement of Durga Puja'}
          </p>
        </div>

        {/* Real-time Countdown Tiles */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
          
          {/* Days */}
          <div className="p-3 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#140609]/90 border border-[#D4AF37]/45 dark:border-[#D4AF37]/35 shadow-md dark:shadow-lg flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-mono text-[#9E1B32] dark:text-[#FFD700] tracking-tight">
              {formatUnit(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-medium text-neutral-600 dark:text-neutral-400 mt-1">
              {isBn ? 'দিন' : 'Days'}
            </span>
          </div>

          {/* Hours */}
          <div className="p-3 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#140609]/90 border border-[#D4AF37]/45 dark:border-[#D4AF37]/35 shadow-md dark:shadow-lg flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-mono text-[#9E1B32] dark:text-[#FFD700] tracking-tight">
              {formatUnit(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-medium text-neutral-600 dark:text-neutral-400 mt-1">
              {isBn ? 'ঘণ্টা' : 'Hours'}
            </span>
          </div>

          {/* Minutes */}
          <div className="p-3 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#140609]/90 border border-[#D4AF37]/45 dark:border-[#D4AF37]/35 shadow-md dark:shadow-lg flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-mono text-[#9E1B32] dark:text-[#FFD700] tracking-tight">
              {formatUnit(timeLeft.minutes)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-medium text-neutral-600 dark:text-neutral-400 mt-1">
              {isBn ? 'মিনিট' : 'Minutes'}
            </span>
          </div>

          {/* Seconds */}
          <div className="p-3 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#140609]/90 border border-[#D4AF37]/45 dark:border-[#D4AF37]/35 shadow-md dark:shadow-lg flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-mono text-[#E56717] dark:text-[#FF9E40] tracking-tight">
              {formatUnit(timeLeft.seconds)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-medium text-neutral-600 dark:text-neutral-400 mt-1">
              {isBn ? 'সেকেন্ড' : 'Seconds'}
            </span>
          </div>
        </div>

        {/* Festival status footer note */}
        {timeLeft.isDuringPuja && (
          <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>
              {isBn
                ? 'বর্তমানে পিন্দ্রা দুর্গা মন্দিরে মহোৎসব চলছে! শুভ শারদীয়া!'
                : 'Durga Puja festivities are currently underway at Pinrra Durga Mandir! Subho Sharadiya!'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
