/**
 * StoryForge - Persistence Module
 * Handles saving and loading data
 */

export class Storage {
    #prefix;
    #available;

    constructor(prefix = 'app') {
        this.#prefix = prefix;
        this.#available = this.#checkAvailability();
    }

    /**
     * Checks if localStorage is available
     * @returns {boolean}
     */
    #checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('LocalStorage unavailable. Using memory storage.');
            return false;
        }
    }

    /**
     * Generates full key with prefix
     * @param {string} key - Original key
     * @returns {string}
     */
    #getKey(key) {
        return `${this.#prefix}:${key}`;
    }

    /**
     * Stores a value
     * @param {string} key - Identification key
     * @param {*} value - Value to store
     * @returns {boolean} Operation success
     */
    set(key, value) {
        try {
            const serialized = JSON.stringify({
                value,
                timestamp: Date.now()
            });

            if (this.#available) {
                localStorage.setItem(this.#getKey(key), serialized);
            } else {
                this.#memoryStorage.set(this.#getKey(key), serialized);
            }
            return true;
        } catch (e) {
            console.error('Save error:', e);
            return false;
        }
    }

    /**
     * Retrieves a value
     * @param {string} key - Identification key
     * @param {*} defaultValue - Default value if not found
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const stored = this.#available 
                ? localStorage.getItem(this.#getKey(key))
                : this.#memoryStorage.get(this.#getKey(key));

            if (!stored) return defaultValue;

            const { value } = JSON.parse(stored);
            return value;
        } catch (e) {
            console.error('Retrieval error:', e);
            return defaultValue;
        }
    }

    /**
     * Removes a value
     * @param {string} key - Identification key
     * @returns {boolean}
     */
    remove(key) {
        try {
            if (this.#available) {
                localStorage.removeItem(this.#getKey(key));
            } else {
                this.#memoryStorage.delete(this.#getKey(key));
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if a key exists
     * @param {string} key - Identification key
     * @returns {boolean}
     */
    has(key) {
        if (this.#available) {
            return localStorage.getItem(this.#getKey(key)) !== null;
        }
        return this.#memoryStorage.has(this.#getKey(key));
    }

    /**
     * Returns all keys with current prefix
     * @returns {string[]}
     */
    keys() {
        const result = [];
        const prefix = this.#getKey('');

        if (this.#available) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(prefix)) {
                    result.push(key.slice(prefix.length));
                }
            }
        } else {
            for (const key of this.#memoryStorage.keys()) {
                if (key.startsWith(prefix)) {
                    result.push(key.slice(prefix.length));
                }
            }
        }

        return result;
    }

    /**
     * Clears all data with current prefix
     */
    clear() {
        const keysToRemove = this.keys();
        keysToRemove.forEach(key => this.remove(key));
    }

    /**
     * Exports all data to JSON
     * @returns {Object}
     */
    exportAll() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    /**
     * Imports data from a JSON object
     * @param {Object} data - Data to import
     * @returns {boolean}
     */
    importAll(data) {
        try {
            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    /**
     * Returns approximate size of stored data
     * @returns {number} Size in bytes
     */
    getSize() {
        let size = 0;
        this.keys().forEach(key => {
            const value = this.#available
                ? localStorage.getItem(this.#getKey(key))
                : this.#memoryStorage.get(this.#getKey(key));
            if (value) {
                size += new Blob([value]).size;
            }
        });
        return size;
    }

    /**
     * Formats size in readable units
     * @param {number} bytes - Size in bytes
     * @returns {string}
     */
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    #memoryStorage = new Map();
}