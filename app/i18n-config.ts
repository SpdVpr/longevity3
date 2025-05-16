export const locales = ['en', 'cs'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames = {
  en: 'English',
  cs: 'Čeština'
} as const;

export const localePrefix = 'always'; // Show locale prefix for all routes
