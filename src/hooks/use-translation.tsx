'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LanguageCode } from '@/translations';
import { allTranslations, fallbackLanguage } from '@/translations/data';
import { rtlLanguages } from '@/translations';

interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  supportedLanguages: LanguageCode[];
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

const STORAGE_KEY_LANG = 'fc_language';
const COOKIE_NAME = 'fc_lang';

const readCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const writeCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const initLang = (): LanguageCode => {
    if (typeof window === 'undefined') return fallbackLanguage;
    const cookie = readCookieValue(COOKIE_NAME);
    if (cookie && allTranslations[cookie as LanguageCode]) return cookie as LanguageCode;
    const stored = localStorage.getItem(STORAGE_KEY_LANG);
    if (stored && allTranslations[stored as LanguageCode]) return stored as LanguageCode;
    return fallbackLanguage;
  };

  const [language, setLanguageState] = useState<LanguageCode>(initLang);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    writeCookie(COOKIE_NAME, lang);
    document.documentElement.lang = lang;
    if (rtlLanguages.has(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const t = useCallback((key: string): string => {
    const dict = allTranslations[language];
    if (dict && dict[key]) return dict[key];
    const fb = allTranslations[fallbackLanguage]?.[key];
    if (fb) return fb;
    return key;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    if (rtlLanguages.has(language)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: Object.keys(allTranslations) as LanguageCode[],
        isRTL: rtlLanguages.has(language),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}

export function useTextDirection(): 'ltr' | 'rtl' {
  const { language } = useTranslation();
  return rtlLanguages.has(language) ? 'rtl' : 'ltr';
}
