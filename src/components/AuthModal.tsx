import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Lock, Mail } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { language, authModalOpen, setAuthModalOpen, login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isBn = language === 'bn';

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(isBn ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please enter email and password.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
        return;
      }
      register(name, email);
    } else {
      login(email);
    }

    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#FFFDF9] dark:bg-[#1A0C11] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#9E1B32]/10 dark:bg-[#E5C158]/10 flex items-center justify-center text-[#9E1B32] dark:text-[#E5C158]">
            {isRegister ? <User className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <h2 className="text-2xl font-bold font-bengali text-[#4A0E17] dark:text-[#FBF6EF]">
            {isRegister
              ? isBn
                ? 'ভক্ত নিবন্ধন'
                : 'Create Devotee Account'
              : isBn
              ? 'লগইন করুন'
              : 'Sign In to Portal'}
          </h2>

          <p className="text-xs text-neutral-500 font-sans">
            {isBn
              ? 'পূজা ও মন্দিরের ছবি আপলোড করতে আপনার অ্যাকাউন্ট ব্যবহার করুন।'
              : 'Sign in to upload authentic Puja photos to the temple gallery.'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isBn ? 'যেমন: দেবব্রত মুখোপাধ্যায়' : 'e.g. Rahul Sharma'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#9E1B32]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#7A1224] text-white text-xs font-semibold shadow hover:shadow-md transition cursor-pointer"
          >
            {isRegister
              ? isBn
                ? 'অ্যাকাউন্ট তৈরি করুন'
                : 'Register Account'
              : isBn
              ? 'প্রবেশ করুন'
              : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center text-xs text-neutral-500 font-sans">
          {isRegister ? (
            <p>
              {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-[#9E1B32] dark:text-[#E5C158] font-semibold underline cursor-pointer"
              >
                {isBn ? 'লগইন করুন' : 'Sign In'}
              </button>
            </p>
          ) : (
            <p>
              {isBn ? 'নতুন ভক্ত?' : 'New devotee?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-[#9E1B32] dark:text-[#E5C158] font-semibold underline cursor-pointer"
              >
                {isBn ? 'নিবন্ধন করুন' : 'Register'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
