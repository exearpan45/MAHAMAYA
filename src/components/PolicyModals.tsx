import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, FileText, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export const PolicyModals: React.FC = () => {
  const { language, activePolicyModal, setActivePolicyModal } = useApp();
  const isBn = language === 'bn';

  if (!activePolicyModal) return null;

  const closeModal = () => setActivePolicyModal(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto text-neutral-800 dark:text-neutral-200">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal: Privacy Policy */}
        {activePolicyModal === 'privacy' && (
          <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#9E1B32] dark:text-[#E5C158]">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-bold font-bengali">
                {isBn ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
              </h2>
            </div>
            <p>
              {isBn
                ? 'পিন্দ্রা দুর্গা মন্দির ও মহামায়া দুর্গোৎসব সমিতি সম্পূর্ণ অলাভজনক একটি ধর্মীয় ও সামাজিক সংগঠন।'
                : 'Pinrra Durga Mandir and MAHAMAYA Durga Puja Committee operate strictly on a non-profit basis for community and religious purposes.'}
            </p>
            <h3 className="font-bold text-sm text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'সংগৃহীত তথ্য' : 'Information Collected'}
            </h3>
            <p>
              {isBn
                ? 'আমরা কোনো বাণিজ্যিক উদ্দেশ্যে বা বিপণনের জন্য তথ্য সংগ্রহ করি না। প্রশাসনিক ব্যবস্থাপনার জন্য শুধুমাত্র অনুমোদিত কমিটি অ্যাডমিনদের প্রয়োজনীয় তথ্য সংরক্ষণ করা হতে পারে।'
                : 'We do not collect personal data for commercial or marketing purposes. Only the necessary name and email information of authorized committee administrators may be stored for secure administration.'}
            </p>
            <h3 className="font-bold text-sm text-[#4A0E17] dark:text-[#FBF6EF]">
              {isBn ? 'কোনো বিজ্ঞাপন বা ট্র্যাকিং নেই' : 'No Advertising or Monetization'}
            </h3>
            <p>
              {isBn
                ? 'এই ওয়েবসাইটে কোনো ধরনের বিজ্ঞাপন, ট্র্যাকিং কুকিজ বা বাণিজ্যিক উপাদান যুক্ত নেই।'
                : 'This website is free of third-party advertisements, tracking pixels, or commercial affiliate mechanisms.'}
            </p>
          </div>
        )}

        {/* Modal: Terms of Use */}
        {activePolicyModal === 'terms' && (
          <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#9E1B32] dark:text-[#E5C158]">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-bold font-bengali">
                {isBn ? 'ব্যবহারের শর্তাবলী (Terms of Use)' : 'Terms of Use'}
              </h2>
            </div>
            <p>
              {isBn
                ? 'পিন্দ্রা দুর্গা মন্দিরের এই ওয়েবসাইটে প্রবেশের মাধ্যমে আপনি এর সম্মান, শালীনতা ও ঐতিহ্য বজায় রাখার নীতিতে সম্মত হচ্ছেন।'
                : 'By visiting and using the Pinrra Durga Mandir official website, you agree to respect community decency and temple sanctity.'}
            </p>
            <p>
              {isBn
                ? 'ওয়েবসাইটের সকল লেখা ও অনুমোদন কমিটি কর্তৃক নিয়ন্ত্রিত। কোনো অননুমোদিত বাণিজ্যিক ব্যবহার বা বিকৃতি নিষিদ্ধ।'
                : 'All textual and visual archives belong to the community and temple committee. Unapproved commercial misuse is prohibited.'}
            </p>
          </div>
        )}

        {/* Modal: Disclaimer */}
        {activePolicyModal === 'disclaimer' && (
          <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#9E1B32] dark:text-[#E5C158]">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-bold font-bengali">
                {isBn ? 'দায়মুক্তি বিবৃতি (Disclaimer)' : 'Disclaimer'}
              </h2>
            </div>
            <p>
              {isBn
                ? 'এই ওয়েবসাইটটি সম্পূর্ণ অবাণিজ্যিক এবং ভক্তবৃন্দের সুবিধার্থে নির্মিত। এখানে কোনো অনুদান সংগ্রহ, চাঁদা আদায় বা আর্থিক লেনদেন করা হয় না।'
                : 'This website is strictly non-profit and educational/informational. There is NO donation collection, fundraising, or financial transaction.'}
            </p>
            <p>
              {isBn
                ? 'পূজার আচার ও সময়সূচী পঞ্জিকার তিথি ও স্থানীয় আবহাওয়া সাপেক্ষে মন্দির কমিটি কর্তৃক পরিবর্তনযোগ্য।'
                : 'Ritual schedules and timings remain subject to authentic Panjika auspicious moments and committee guidance.'}
            </p>
          </div>
        )}

        {/* Modal: Community Upload Policy */}


        {/* Footer Close */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-right">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold cursor-pointer"
          >
            {isBn ? 'ঠিক আছে' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
