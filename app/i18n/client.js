'use client';

import {createI18nClient} from 'next-intl/client';
import {locales, defaultLocale} from '../i18n';

export default createI18nClient({
  locales,
  defaultLocale
});
