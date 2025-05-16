// This file is used by next-intl to load messages
const { defaultLocale } = require('../i18n');

export async function getMessages(locale) {
  try {
    // Load index messages
    const indexMessages = await import(`../messages/${locale}/index.json`);
    
    // Try to load research messages
    try {
      const researchMessages = await import(`../messages/${locale}/research.json`);
      // Merge all messages
      return { ...indexMessages.default, research: researchMessages.default };
    } catch (error) {
      // Fallback to English if research messages for the locale are not found
      if (locale !== defaultLocale) {
        try {
          const researchMessages = await import(`../messages/${defaultLocale}/research.json`);
          return { ...indexMessages.default, research: researchMessages.default };
        } catch (innerError) {
          console.error('Could not load research messages:', innerError);
          return { ...indexMessages.default };
        }
      } else {
        return { ...indexMessages.default };
      }
    }
  } catch (error) {
    // Fallback to English if messages for the locale are not found
    const indexMessages = await import(`../messages/${defaultLocale}/index.json`);
    let researchMessages = {};
    try {
      researchMessages = await import(`../messages/${defaultLocale}/research.json`);
    } catch (innerError) {
      console.error('Could not load English research messages:', innerError);
    }
    return { ...indexMessages.default, research: researchMessages.default };
  }
}
