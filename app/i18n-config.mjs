// This file is used by next-intl in the App Router
// Import directly from the main config file
import config from '../../next-intl.config.mjs';

export const locales = config.locales;
export const defaultLocale = config.defaultLocale;

export default {
  locales,
  defaultLocale
};
