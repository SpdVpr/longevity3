// Central next-intl configuration file at project root
import config from './next-intl.config.mjs';

export const locales = config.locales;
export const defaultLocale = config.defaultLocale;

export default {
  locales,
  defaultLocale,
  localeDetection: true
};
