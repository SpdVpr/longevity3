/**
 * Format a date string
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale code
 * @returns {string} - Formatted date
 */
export function formatDate(dateString: string, locale = 'en'): string {
  try {
    if (!dateString) {
      return 'Unknown date';
    }

    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format the date based on the locale
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
}
