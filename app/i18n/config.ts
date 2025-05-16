export const locales = ['en', 'cs'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];