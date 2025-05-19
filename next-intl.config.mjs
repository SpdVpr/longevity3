// Define locales and default locale
export const locales = ['en', 'cs'];
export const defaultLocale = 'en';

// Define hardcoded messages for each locale
const messages = {
  en: {
    app: {
      title: "Longevity Hub",
      description: "Science-backed strategies for longevity"
    },
    navigation: {
      home: "Home",
      about: "About",
      contact: "Contact",
      articles: "Articles",
      categories: "Categories",
      tools: "Tools",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out"
    },
    common: {
      readMore: "Read More",
      viewAll: "View All",
      loading: "Loading...",
      error: "An error occurred",
      search: "Search",
      notFound: "Not Found",
      back: "Back"
    }
  },
  cs: {
    app: {
      title: "Longevity Hub",
      description: "Vědecky podložené strategie pro dlouhověkost"
    },
    navigation: {
      home: "Domů",
      about: "O nás",
      contact: "Kontakt",
      articles: "Články",
      categories: "Kategorie",
      tools: "Nástroje",
      dashboard: "Nástěnka",
      profile: "Profil",
      signIn: "Přihlásit se",
      signUp: "Registrovat se",
      signOut: "Odhlásit se"
    },
    common: {
      readMore: "Číst více",
      viewAll: "Zobrazit vše",
      loading: "Načítání...",
      error: "Došlo k chybě",
      search: "Hledat",
      notFound: "Nenalezeno",
      back: "Zpět"
    }
  }
};

// Export the configuration
export default {
  locales,
  defaultLocale,
  localeDetection: true,
  // Use hardcoded messages instead of file imports
  messages: (locale) => {
    return messages[locale] || messages[defaultLocale];
  }
};
