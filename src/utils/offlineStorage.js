/**
 * IndexedDB Wrapper for Offline Data Storage
 * Provides persistent storage for user data, assessments, and preferences
 */

const DB_NAME = 'SocialCautionDB';
const DB_VERSION = 1;
const STORES = {
  USER_PROFILE: 'userProfile',
  ASSESSMENTS: 'assessments',
  PREFERENCES: 'preferences',
  OFFLINE_QUEUE: 'offlineQueue'
};

class OfflineStorage {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  /**
   * Initialize IndexedDB database
   */
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB initialization failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
          const profileStore = db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id', autoIncrement: false });
          profileStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.ASSESSMENTS)) {
          const assessmentStore = db.createObjectStore(STORES.ASSESSMENTS, { keyPath: 'id', autoIncrement: true });
          assessmentStore.createIndex('userId', 'userId', { unique: false });
          assessmentStore.createIndex('completedAt', 'completedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
          const queueStore = db.createObjectStore(STORES.OFFLINE_QUEUE, { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
          queueStore.createIndex('type', 'type', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Ensure database is initialized
   */
  async ensureInit() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  /**
   * Save user profile data
   */
  async saveUserProfile(profileData) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.USER_PROFILE], 'readwrite');
      const store = transaction.objectStore(STORES.USER_PROFILE);

      const profile = {
        id: 'current',
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      await store.put(profile);
      return profile;
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile data
   */
  async getUserProfile() {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.USER_PROFILE], 'readonly');
      const store = transaction.objectStore(STORES.USER_PROFILE);

      return new Promise((resolve, reject) => {
        const request = store.get('current');
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Save assessment results
   */
  async saveAssessment(assessmentData) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.ASSESSMENTS], 'readwrite');
      const store = transaction.objectStore(STORES.ASSESSMENTS);

      const assessment = {
        ...assessmentData,
        userId: 'current',
        completedAt: assessmentData.completedAt || new Date().toISOString(),
        savedAt: new Date().toISOString()
      };

      const id = await store.add(assessment);
      return { ...assessment, id };
    } catch (error) {
      console.error('Failed to save assessment:', error);
      throw error;
    }
  }

  /**
   * Get all assessments
   */
  async getAssessments() {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.ASSESSMENTS], 'readonly');
      const store = transaction.objectStore(STORES.ASSESSMENTS);
      const index = store.index('userId');

      return new Promise((resolve, reject) => {
        const request = index.getAll('current');
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get assessments:', error);
      return [];
    }
  }

  /**
   * Get latest assessment
   */
  async getLatestAssessment() {
    try {
      const assessments = await this.getAssessments();
      if (assessments.length === 0) return null;

      // Sort by completedAt descending
      assessments.sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      );

      return assessments[0];
    } catch (error) {
      console.error('Failed to get latest assessment:', error);
      return null;
    }
  }

  /**
   * Save preference
   */
  async savePreference(key, value) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.PREFERENCES], 'readwrite');
      const store = transaction.objectStore(STORES.PREFERENCES);

      await store.put({ key, value, updatedAt: new Date().toISOString() });
      return { key, value };
    } catch (error) {
      console.error('Failed to save preference:', error);
      throw error;
    }
  }

  /**
   * Get preference
   */
  async getPreference(key) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.PREFERENCES], 'readonly');
      const store = transaction.objectStore(STORES.PREFERENCES);

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get preference:', error);
      return null;
    }
  }

  /**
   * Add item to offline queue for sync when online
   */
  async addToOfflineQueue(item) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.OFFLINE_QUEUE);

      const queueItem = {
        ...item,
        timestamp: new Date().toISOString(),
        synced: false
      };

      await store.add(queueItem);
      return queueItem;
    } catch (error) {
      console.error('Failed to add to offline queue:', error);
      throw error;
    }
  }

  /**
   * Get all unsynced items from queue
   */
  async getOfflineQueue() {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readonly');
      const store = transaction.objectStore(STORES.OFFLINE_QUEUE);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const items = request.result.filter(item => !item.synced);
          resolve(items);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get offline queue:', error);
      return [];
    }
  }

  /**
   * Mark queue item as synced
   */
  async markAsSynced(id) {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.OFFLINE_QUEUE);

      const item = await store.get(id);
      if (item) {
        item.synced = true;
        item.syncedAt = new Date().toISOString();
        await store.put(item);
      }
    } catch (error) {
      console.error('Failed to mark as synced:', error);
      throw error;
    }
  }

  /**
   * Export all data for backup/transfer
   */
  async exportData() {
    try {
      const [profile, assessments, preferences] = await Promise.all([
        this.getUserProfile(),
        this.getAssessments(),
        this.getAllPreferences()
      ]);

      return {
        profile,
        assessments,
        preferences,
        exportedAt: new Date().toISOString(),
        version: DB_VERSION
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Get all preferences
   */
  async getAllPreferences() {
    try {
      const db = await this.ensureInit();
      const transaction = db.transaction([STORES.PREFERENCES], 'readonly');
      const store = transaction.objectStore(STORES.PREFERENCES);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const prefs = {};
          request.result.forEach(item => {
            prefs[item.key] = item.value;
          });
          resolve(prefs);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get all preferences:', error);
      return {};
    }
  }

  /**
   * Clear all data (use with caution)
   */
  async clearAll() {
    try {
      const db = await this.ensureInit();
      const stores = Object.values(STORES);

      for (const storeName of stores) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      }

      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const offlineStorage = new OfflineStorage();

// Initialize on load
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(err => {
    console.warn('IndexedDB initialization failed, falling back to localStorage:', err);
  });
}

export default offlineStorage;

