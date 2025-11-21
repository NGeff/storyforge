/**
 * StoryForge - Narrative Engine
 * Manages story state, transitions, and choice logic
 */

export class StoryEngine {
    #storyData;
    #character;
    #currentNode;
    #history;
    #state;
    #listeners;

    constructor(storyData, characterId) {
        this.#storyData = storyData;
        this.#character = characterId;
        this.#currentNode = 'start';
        this.#history = [];
        this.#state = {
            flags: {},
            stats: { ...storyData.characters?.[characterId]?.stats },
            inventory: []
        };
        this.#listeners = {};
    }

    /**
     * Returns the current narrative node
     */
    getCurrentNode() {
        const characterStory = this.#storyData.nodes[this.#character];
        return characterStory?.[this.#currentNode] || null;
    }

    /**
     * Processes a player choice
     * @param {number} choiceIndex - Index of selected choice
     * @returns {Object|null} Choice result or null if invalid
     */
    choose(choiceIndex) {
        const node = this.getCurrentNode();
        if (!node?.choices?.[choiceIndex]) return null;

        const choice = node.choices[choiceIndex];
        
        this.#history.push({
            node: this.#currentNode,
            text: this.#truncateText(node.text, 80),
            choice: choice.text,
            effect: choice.effect || null
        });

        if (choice.effect) {
            this.#applyEffect(choice.effect);
        }

        this.#currentNode = choice.next;
        this.#emit('nodeChange', this.getCurrentNode());

        if (this.isEnding()) {
            this.#emit('ending', this.getCurrentNode());
        }

        return {
            success: true,
            effect: choice.effect,
            newNode: this.getCurrentNode()
        };
    }

    /**
     * Checks if current node is an ending
     */
    isEnding() {
        return this.getCurrentNode()?.ending === true;
    }

    /**
     * Returns the choice history
     */
    getHistory() {
        return [...this.#history];
    }

    /**
     * Returns current game state
     */
    getState() {
        return {
            character: this.#character,
            currentNode: this.#currentNode,
            flags: { ...this.#state.flags },
            stats: { ...this.#state.stats },
            inventory: [...this.#state.inventory]
        };
    }

    /**
     * Exports data for saving
     */
    export() {
        return {
            character: this.#character,
            currentNode: this.#currentNode,
            history: this.#history,
            state: this.#state,
            timestamp: Date.now()
        };
    }

    /**
     * Imports data from a save
     * @param {Object} saveData - Previously saved data
     */
    import(saveData) {
        if (!saveData) return false;

        this.#character = saveData.character;
        this.#currentNode = saveData.currentNode;
        this.#history = saveData.history || [];
        this.#state = saveData.state || { flags: {}, stats: {}, inventory: [] };

        return true;
    }

    /**
     * Registers an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.#listeners[event]) {
            this.#listeners[event] = [];
        }
        this.#listeners[event].push(callback);
    }

    /**
     * Removes an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (!this.#listeners[event]) return;
        this.#listeners[event] = this.#listeners[event].filter(cb => cb !== callback);
    }

    /**
     * Checks if a condition is satisfied
     * @param {Function|Object} condition - Condition to check
     */
    checkCondition(condition) {
        if (typeof condition === 'function') {
            return condition(this.#state);
        }
        
        if (typeof condition === 'object') {
            return Object.entries(condition).every(([key, value]) => {
                if (key.startsWith('flag:')) {
                    return this.#state.flags[key.slice(5)] === value;
                }
                if (key.startsWith('stat:')) {
                    const [stat, op] = key.slice(5).split(':');
                    const statValue = this.#state.stats[stat] || 0;
                    
                    switch (op) {
                        case 'gte': return statValue >= value;
                        case 'lte': return statValue <= value;
                        case 'gt': return statValue > value;
                        case 'lt': return statValue < value;
                        default: return statValue === value;
                    }
                }
                if (key === 'hasItem') {
                    return this.#state.inventory.includes(value);
                }
                return true;
            });
        }

        return true;
    }

    /**
     * Returns available choices based on conditions
     */
    getAvailableChoices() {
        const node = this.getCurrentNode();
        if (!node?.choices) return [];

        return node.choices.filter(choice => {
            if (!choice.condition) return true;
            return this.checkCondition(choice.condition);
        });
    }

    #applyEffect(effectString) {
        const effects = effectString.split(',').map(e => e.trim());
        
        effects.forEach(effect => {
            const statMatch = effect.match(/([+-]?\d+)\s+(\w+)/);
            if (statMatch) {
                const [, value, stat] = statMatch;
                const statKey = stat.toLowerCase();
                this.#state.stats[statKey] = (this.#state.stats[statKey] || 0) + parseInt(value);
            }
            
            const flagMatch = effect.match(/flag:(\w+)=(\w+)/);
            if (flagMatch) {
                const [, flag, value] = flagMatch;
                this.#state.flags[flag] = value === 'true' ? true : value === 'false' ? false : value;
            }

            const itemMatch = effect.match(/\+item:(\w+)/);
            if (itemMatch) {
                this.#state.inventory.push(itemMatch[1]);
            }

            const removeMatch = effect.match(/-item:(\w+)/);
            if (removeMatch) {
                const idx = this.#state.inventory.indexOf(removeMatch[1]);
                if (idx > -1) this.#state.inventory.splice(idx, 1);
            }
        });
    }

    #truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 3) + '...';
    }

    #emit(event, data) {
        this.#listeners[event]?.forEach(cb => cb(data));
    }
}