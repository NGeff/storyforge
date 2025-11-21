/**
 * StoryForge - UI Module
 * DOM manipulation and rendering utilities
 */

export class UI {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Gets a DOM element with caching
     * @param {string} selector - CSS selector
     * @returns {Element|null}
     */
    $(selector) {
        if (!this.cache.has(selector)) {
            this.cache.set(selector, document.querySelector(selector));
        }
        return this.cache.get(selector);
    }

    /**
     * Gets multiple DOM elements
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Creates an HTML element with attributes
     * @param {string} tag - Tag name
     * @param {Object} attrs - Element attributes
     * @param {string|Element|Array} children - Child content
     * @returns {Element}
     */
    createElement(tag, attrs = {}, children = null) {
        const el = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([k, v]) => {
                    el.dataset[k] = v;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                el.setAttribute(key, value);
            }
        });

        if (children) {
            if (Array.isArray(children)) {
                children.forEach(child => this.appendContent(el, child));
            } else {
                this.appendContent(el, children);
            }
        }

        return el;
    }

    /**
     * Appends content to an element
     * @param {Element} parent - Parent element
     * @param {string|Element} content - Content to append
     */
    appendContent(parent, content) {
        if (typeof content === 'string') {
            parent.appendChild(document.createTextNode(content));
        } else if (content instanceof Element) {
            parent.appendChild(content);
        }
    }

    /**
     * Animates transition between values
     * @param {Object} options - Animation options
     */
    animate({ element, property, from, to, duration = 300, easing = 'ease' }) {
        element.style.transition = `${property} ${duration}ms ${easing}`;
        element.style[property] = from;
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                element.style[property] = to;
            });
        });
    }

    /**
     * Shows an element with animation
     * @param {Element} element - Element to show
     * @param {string} animation - Animation class
     */
    show(element, animation = 'animate-fade-in') {
        element.classList.remove('hidden');
        element.classList.add(animation);
    }

    /**
     * Hides an element with animation
     * @param {Element} element - Element to hide
     */
    hide(element) {
        element.classList.add('hidden');
    }

    /**
     * Toggles element visibility
     * @param {Element} element - Target element
     * @param {boolean} force - Force specific state
     */
    toggle(element, force) {
        element.classList.toggle('hidden', force !== undefined ? !force : undefined);
    }

    /**
     * Debounce function
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {Function}
     */
    debounce(fn, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     * @param {Function} fn - Function to throttle
     * @param {number} limit - Minimum interval in ms
     * @returns {Function}
     */
    throttle(fn, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Clears element cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Renders a template string with data
     * @param {string} template - Template with {{key}} placeholders
     * @param {Object} data - Data for substitution
     * @returns {string}
     */
    render(template, data) {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data.hasOwnProperty(key) ? data[key] : match;
        });
    }

    /**
     * Waits for next animation frame
     * @returns {Promise}
     */
    nextFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    /**
     * Waits for CSS transition to complete
     * @param {Element} element - Element with transition
     * @returns {Promise}
     */
    waitTransition(element) {
        return new Promise(resolve => {
            const handler = () => {
                element.removeEventListener('transitionend', handler);
                resolve();
            };
            element.addEventListener('transitionend', handler);
        });
    }

    /**
     * Sets focus with smooth scroll
     * @param {Element} element - Element to focus
     */
    focusWithScroll(element) {
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Announces text for screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Priority: 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            announcer.textContent = message;
            setTimeout(() => announcer.remove(), 1000);
        }, 100);
    }
}