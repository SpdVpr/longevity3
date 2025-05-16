/** @type {import('next-intl').NextIntlConfig} */
const locales = ['en', 'cs'];
const defaultLocale = 'en';

module.exports = {
  defaultLocale,
  locales,
  localeDetection: true,
  messages: async (locale) => {
    try {
      return require(`../messages/${locale}/index.json`);
    } catch {
      return require(`../messages/en/index.json`);
    }
  }
};

module.exports.locales = locales;
module.exports.defaultLocale = defaultLocale;