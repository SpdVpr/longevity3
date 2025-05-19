// Central next-intl configuration file at project root
// Import from the main config file
const { locales, defaultLocale } = require('./next-intl.config.mjs');

module.exports = {
  locales,
  defaultLocale,
  localeDetection: true
};
