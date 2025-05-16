/**
 * Formats a date string into a localized format
 * @param dateString ISO date string
 * @param locale Locale code (e.g., 'en', 'cs')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined, locale: string = 'en'): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return '';
    }
    
    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str String to truncate
 * @param length Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return str.substring(0, length) + '...';
}

/**
 * Generates a random ID
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Capitalizes the first letter of a string
 * @param str String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Slugifies a string (converts to lowercase, replaces spaces with hyphens, removes special chars)
 * @param str String to slugify
 * @returns Slugified string
 */
export function slugify(str: string): string {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Debounces a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Checks if an object is empty
 * @param obj Object to check
 * @returns True if object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Gets a random item from an array
 * @param array Array to get item from
 * @returns Random item
 */
export function getRandomItem<T>(array: T[]): T | undefined {
  if (!array || array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffles an array
 * @param array Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  if (!array) return [];
  
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
}

/**
 * Formats a number with commas
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Converts a hex color to RGBA
 * @param hex Hex color string
 * @param alpha Alpha value (0-1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return '';
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
