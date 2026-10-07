import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Image as ImageIcon, Trash2, LogOut, ArrowLeft, Calendar } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const {
    language,
    currentUser,
    logout,
    gallery,
    deleteGalleryPhoto,
    setActiveView,
    setUploadModalOpen,
  } = useApp();

  const isBn = language === 'bn';

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-neutral-500">
          {isBn ? 'অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please sign in to view your profile.'}
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#9E1B32] text-white"
        >
          {isBn ? 'নীড়পাতায় ফিরে যান' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const userPhotos = gallery.filter((p) => p.uploaderEmail === currentUser.email);

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top back bar */}
      <button
        onClick={() => setActiveView('home')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[#9E1B32] dark:hover:text-[#E5C158] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? 'নীড়পাতায় ফিরুন' : 'Back to Website'}</span>
      </button>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/35 shadow-md flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
              {currentUser.name}
            </h2>
            <p className="text-xs text-neutral-500">{currentUser.email}</p>
            <div className="inline-block text-[11px] font-semibold text-[#9E1B32] dark:text-[#E5C158] uppercase tracking-wider">
              {currentUser.role}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9E1B32] text-white text-xs font-semibold shadow hover:shadow-md transition cursor-pointer"
          >
            {isBn ? 'নতুন ছবি আপলোড' : 'Upload Photo'}
          </button>

          <button
            onClick={() => {
              logout();
              setActiveView('home');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 bg-rose-50/90 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold cursor-pointer"
            title={isBn ? 'লগআউট' : 'Log Out'}
          >
            <LogOut className="w-4 h-4" />
            <span>{isBn ? 'লগআউট' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* Uploaded Photos Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF] flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#9E1B32] dark:text-[#E5C158]" />
          <span>{isBn ? 'আমার আপলোডকৃত ছবি' : 'My Uploaded Photos'}</span>
          <span className="text-xs text-neutral-400 font-sans font-normal">
            ({userPhotos.length})
          </span>
        </h3>

        {userPhotos.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
            {isBn
              ? 'আপনি এখনও কোনো ছবি আপলোড করেননি।'
              : 'You have not uploaded any photos yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPhotos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-xl overflow-hidden bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/30 shadow-sm relative group"
              >
                <div className="h-40 w-full bg-neutral-900">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title_en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#FBF6EF] truncate">
                    {photo.title_en}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{photo.category}</span>
                    <button
                      onClick={() => deleteGalleryPhoto(photo.id)}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                      title={isBn ? 'ছবিটি মুছুন' : 'Delete photo'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
