/**
 * Simple in-memory cache service
 */

interface CacheItem<T> {
  data: T;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number; // Time to live in milliseconds

  constructor(defaultTTL = 5 * 60 * 1000) { // Default: 5 minutes
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {T | null} - Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // If item doesn't exist or has expired
    if (!item || item.expiry < Date.now()) {
      if (item) {
        // Clean up expired item
        this.cache.delete(key);
      }
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {T} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Remove item from cache
   * @param {string} key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get or set cache item with callback
   * @param {string} key - Cache key
   * @param {Function} callback - Function to call if cache miss
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<T>} - Cached or fetched data
   */
  async getOrSet<T>(key: string, callback: () => Promise<T>, ttl = this.defaultTTL): Promise<T> {
    const cachedData = this.get<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    const freshData = await callback();
    this.set(key, freshData, ttl);
    return freshData;
  }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService;
