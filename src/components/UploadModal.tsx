import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryCategory } from '../types';
import { X, Upload, CheckSquare, Square, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const UploadModal: React.FC = () => {
  const {
    language,
    uploadModalOpen,
    setUploadModalOpen,
    currentUser,
    addGalleryPhoto,
    currentPujaYear,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Community');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmedRight, setConfirmedRight] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBn = language === 'bn';

  if (!uploadModalOpen || !currentUser) return null;

  const categories: { id: GalleryCategory; label_bn: string; label_en: string }[] = [
    { id: 'Maa Durga', label_bn: 'মা দুর্গা', label_en: 'Maa Durga' },
    { id: 'Temple', label_bn: 'মন্দির প্রাঙ্গণ', label_en: 'Temple' },
    { id: 'Durga Puja', label_bn: 'পূজা আচার', label_en: 'Durga Puja' },
    { id: 'Bhog', label_bn: 'ভোগ বিতরণ', label_en: 'Bhog Prasad' },
    { id: 'Cultural Programs', label_bn: 'সাংস্কৃতিক সন্ধ্যা', label_en: 'Cultural Programs' },
    { id: 'Visarjan', label_bn: 'বিসর্জন ও সিঁদুর খেলা', label_en: 'Visarjan' },
    { id: 'Historical Photos', label_bn: 'ঐতিহাসিক ছবি', label_en: 'Historical Photos' },
    { id: 'Community', label_bn: 'কমিউনিটি ও ভক্তবৃন্দ', label_en: 'Community' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: safe image types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(
        isBn
          ? 'শুধুমাত্র JPG, JPEG, PNG অথবা WEBP ফরম্যাটের ছবি গ্রহণযোগ্য।'
          : 'Only JPG, JPEG, PNG or WEBP image formats are permitted.'
      );
      return;
    }

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError(
        isBn
          ? 'ছবির আকার ৫ মেগাবাইট (5MB)-এর কম হতে হবে।'
          : 'Image size must be less than 5MB.'
      );
      return;
    }

    setImageFile(file);

    // Read and preview via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imagePreview) {
      setError(isBn ? 'অনুগ্রহ করে একটি ছবি নির্বাচন করুন।' : 'Please select a photo to upload.');
      return;
    }

    if (!title.trim()) {
      setError(isBn ? 'ছবির একটি শিরোনাম দিন।' : 'Please provide a title for the photo.');
      return;
    }

    if (!confirmedRight) {
      setError(
        isBn
          ? 'ছবিটির সত্যতা ও অধিকার নিশ্চিতকরণের জন্য বক্সে টিক দিন।'
          : 'Please confirm the upload disclaimer.'
      );
      return;
    }

    setIsSubmitting(true);

    addGalleryPhoto({
      imageUrl: imagePreview,
      thumbnailUrl: imagePreview,
      title_en: title.trim(),
      title_bn: title.trim(),
      description_en: description.trim() || 'Community upload',
      description_bn: description.trim() || 'ভক্ত কর্তৃক আপলোডকৃত ছবি',
      category,
      pujaYear: currentPujaYear.year,
      uploaderName: currentUser.name,
      uploaderEmail: currentUser.email,
      uploaderId: currentUser.id,
      featured: false,
    });

    setIsSubmitting(false);
    setUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setUploadModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
            {isBn ? 'চিত্রশালায় ছবি আপলোড' : 'Upload Photo to Gallery'}
          </h2>
          <p className="text-xs text-neutral-500 font-sans">
            {isBn
              ? 'পিন্দ্রা দুর্গা মন্দির বা শারদোৎসবের সাথে সম্পর্কিত পবিত্র ছবি শেয়ার করুন।'
              : 'Share verified photos of Pinrra Durga Mandir rituals and community celebration.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* File Picker */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'ছবি নির্বাচন করুন (সর্বোচ্চ ৫ মেগাবাইট)' : 'Select Image (Max 5MB)'}
            </label>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 text-center hover:border-[#9E1B32] transition">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg object-contain"
                  />
                  <p className="text-[11px] text-neutral-500 truncate">{imageFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <ImageIcon className="w-8 h-8 mx-auto text-neutral-400" />
                  <p className="text-xs text-neutral-500 font-sans">
                    {isBn ? 'JPG, PNG বা WEBP ফাইল আপলোড করুন' : 'Click to select JPG, PNG, or WEBP file'}
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="text-xs text-neutral-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#9E1B32]/10 file:text-[#9E1B32] cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'ছবির শিরোনাম' : 'Photo Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isBn ? 'যেমন: মহাষ্টমীর আরতি' : 'e.g. Maha Ashtami Arati'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'বিভাগ নির্বাচন' : 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFFDF9] dark:bg-[#1A0C11] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {isBn ? c.label_bn : c.label_en}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)' : 'Description (Optional)'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isBn ? 'ছবি সম্পর্কে কিছু কথা...' : 'A brief description of the moment...'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
            />
          </div>

          {/* Mandatory Community Disclaimer */}
          <div
            onClick={() => setConfirmedRight(!confirmedRight)}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 select-none"
          >
            {confirmedRight ? (
              <CheckSquare className="w-4 h-4 text-[#9E1B32] dark:text-[#E5C158] shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            )}
            <p className="font-sans leading-relaxed text-[11px]">
              {isBn
                ? 'এই ছবিটি আপলোড করার মাধ্যমে আমি নিশ্চিত করছি যে এই ছবিটির প্রকাশনার পূর্ণ অধিকার আমার রয়েছে এবং এটি পিন্দ্রা দুর্গা মন্দির বা শারদোৎসবের সাথে সরাসরি সম্পর্কিত।'
                : 'By uploading this image, you confirm that you have the right to share it and that it is relevant to Pinrra Durga Mandir / Durga Puja.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#7A1224] text-white text-xs font-semibold shadow hover:shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? isBn
                ? 'আপলোড হচ্ছে...'
                : 'Uploading...'
              : isBn
              ? 'চিত্রশালায় জমা দিন'
              : 'Submit to Gallery'}
          </button>
        </form>
      </div>
    </div>
  );
};
