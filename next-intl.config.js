// next-intl.config.js
/** @type {import('next-intl').NextIntlConfig} */
const { locales, defaultLocale, getMessages } = require('./i18n');

module.exports = {
  // Specify English as the only locale
  locales,
  defaultLocale,
  // Disable locale detection
  localeDetection: false,
  // Load messages for English
  messages: getMessages
};
