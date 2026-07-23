export type LanguageCode = 'en-US' | 'zh-CN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'ko-KR' | 'pt-BR' | 'ar-SA' | 'hi-IN';

export const languageLabels: Record<LanguageCode, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'pt-BR': 'Português (Brasil)',
  'ar-SA': 'العربية',
  'hi-IN': 'हिन्दी',
};

export const languageNamesInAllLangs: Record<LanguageCode, string> = {
  'en-US': 'English',
  'zh-CN': '英语',
  'es-ES': 'Inglés',
  'fr-FR': 'Anglais',
  'de-DE': 'Englisch',
  'ja-JP': '英語',
  'ko-KR': '영어',
  'pt-BR': 'Inglês',
  'ar-SA': 'الإنجليزية',
  'hi-IN': 'अंग्रेज़ी',
};

export const rtlLanguages: Set<LanguageCode> = new Set(['ar-SA']);

