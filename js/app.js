/**
 * StoryForge - Main Application
 * Module initialization and orchestration
 */

import { StoryEngine } from './engine.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { STORIES, THEMES, CHARACTERS } from './data/stories.js';

const CONFIG = {
    defaultTheme: 'fantasy',
    textSpeed: {
        slow: 60,
        normal: 35,
        fast: 15,
        instant: 0
    },
    enableAnimations: true,
    autoSave: true,
    particleCount: 25
};

class StoryForgeApp {
    constructor() {
        this.engine = null;
        this.ui = new UI();
        this.storage = new Storage('storyforge');
        this.settings = this.loadSettings();
        this.currentStory = 'default';
        this.selectedCharacter = null;
    }

    init() {
        this.applySettings();
        this.initParticles();
        this.bindEvents();
        this.checkSavedGame();
        this.renderThemeOptions();
        this.renderCharacters();
    }

    loadSettings() {
        const saved = this.storage.get('settings');
        return saved || {
            theme: CONFIG.defaultTheme,
            textSpeed: 'normal',
            animations: CONFIG.enableAnimations
        };
    }

    saveSettings() {
        this.storage.set('settings', this.settings);
    }

    applySettings() {
        document.documentElement.dataset.theme = this.settings.theme;
        document.documentElement.dataset.reduceMotion = !this.settings.animations;
        
        const speedSelect = document.getElementById('text-speed');
        if (speedSelect) speedSelect.value = this.settings.textSpeed;
        
        const animToggle = document.getElementById('toggle-animations');
        if (animToggle) {
            animToggle.classList.toggle('active', this.settings.animations);
            animToggle.setAttribute('aria-pressed', this.settings.animations);
        }
    }

    initParticles() {
        const canvas = document.getElementById('particles');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 3 + 1,
            speedY: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.2
        });
        
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const p = createParticle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }
        
        const animate = () => {
            if (!this.settings.animations) {
                requestAnimationFrame(animate);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const style = getComputedStyle(document.documentElement);
            const color = style.getPropertyValue('--accent-start').trim() || '#f59e0b';
            
            particles.forEach((p, i) => {
                p.y -= p.speedY;
                p.x += p.speedX;
                
                if (p.y < -10) {
                    particles[i] = createParticle();
                }
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });
            
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };
        
        resize();
        window.addEventListener('resize', resize);
        animate();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) return;
            
            this.handleAction(action, e.target);
        });

        document.getElementById('text-speed')?.addEventListener('change', (e) => {
            this.settings.textSpeed = e.target.value;
            this.saveSettings();
        });

        document.getElementById('toggle-animations')?.addEventListener('click', (e) => {
            this.settings.animations = !this.settings.animations;
            this.saveSettings();
            this.applySettings();
        });
    }

    handleAction(action, target) {
        const actions = {
            'new-game': () => this.showScreen('screen-character'),
            'continue': () => this.continueGame(),
            'settings': () => this.openModal('modal-settings'),
            'back': () => this.showScreen('screen-menu'),
            'close-modal': () => this.closeAllModals(),
            'start-adventure': () => this.startGame(),
            'menu': () => this.openModal('modal-settings'),
            'history': () => this.showHistory(),
            'view-journey': () => this.showHistory(),
            'select-character': () => this.selectCharacter(target.closest('.character-card')?.dataset.character),
            'select-theme': () => this.selectTheme(target.dataset.theme),
            'make-choice': () => this.makeChoice(parseInt(target.dataset.index))
        };

        actions[action]?.();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId)?.classList.add('active');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => {
            m.classList.remove('active');
            m.setAttribute('aria-hidden', 'true');
        });
    }

    renderThemeOptions() {
        const container = document.getElementById('theme-options');
        if (!container) return;

        container.innerHTML = Object.entries(THEMES).map(([key, theme]) => `
            <button 
                class="theme-btn ${this.settings.theme === key ? 'active' : ''}"
                data-action="select-theme"
                data-theme="${key}"
                style="background: var(--theme-preview-bg)"
            >
                ${theme.icon} ${theme.name}
            </button>
        `).join('');
    }

    selectTheme(themeId) {
        if (!THEMES[themeId]) return;
        
        this.settings.theme = themeId;
        this.saveSettings();
        this.applySettings();
        this.renderThemeOptions();
    }

    renderCharacters() {
        const container = document.getElementById('character-grid');
        if (!container) return;

        container.innerHTML = Object.entries(CHARACTERS).map(([key, char]) => `
            <article 
                class="character-card"
                data-character="${key}"
                data-action="select-character"
                role="button"
                tabindex="0"
                aria-pressed="false"
            >
                <svg class="character-icon ${char.colorClass}" viewBox="0 0 24 24">
                    ${char.iconPath}
                </svg>
                <h3>${char.name}</h3>
                <p>${char.description}</p>
                <div class="character-stats">
                    ${Object.entries(char.stats).map(([stat, value]) => `
                        <div class="stat-row">
                            <span class="stat-label">${stat}</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${value * 10}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </article>
        `).join('');
    }

    selectCharacter(characterId) {
        if (!CHARACTERS[characterId]) return;
        
        this.selectedCharacter = characterId;
        
        document.querySelectorAll('.character-card').forEach(card => {
            const isSelected = card.dataset.character === characterId;
            card.classList.toggle('selected', isSelected);
            card.setAttribute('aria-pressed', isSelected);
        });

        const startBtn = document.querySelector('[data-action="start-adventure"]');
        if (startBtn) startBtn.disabled = false;
    }

    checkSavedGame() {
        const saveData = this.storage.get('saveGame');
        const continueBtn = document.querySelector('[data-action="continue"]');
        
        if (continueBtn) {
            continueBtn.disabled = !saveData;
        }
    }

    startGame() {
        if (!this.selectedCharacter) return;

        const storyData = STORIES[this.currentStory];
        this.engine = new StoryEngine(storyData, this.selectedCharacter);
        
        this.updateCharacterBadge();
        this.showScreen('screen-game');
        this.renderCurrentNode();

        if (CONFIG.autoSave) {
            this.saveGame();
        }
    }

    continueGame() {
        const saveData = this.storage.get('saveGame');
        if (!saveData) return;

        const storyData = STORIES[saveData.storyId];
        this.engine = new StoryEngine(storyData, saveData.character);
        this.engine.import(saveData);
        this.selectedCharacter = saveData.character;

        this.updateCharacterBadge();
        this.showScreen('screen-game');
        this.renderCurrentNode();
    }

    saveGame() {
        if (!this.engine) return;
        
        const saveData = this.engine.export();
        saveData.storyId = this.currentStory;
        this.storage.set('saveGame', saveData);
    }

    updateCharacterBadge() {
        const char = CHARACTERS[this.selectedCharacter];
        const badge = document.getElementById('character-badge');
        
        if (badge && char) {
            badge.querySelector('.badge-icon').innerHTML = `
                <svg class="${char.colorClass}" viewBox="0 0 24 24" width="24" height="24">
                    ${char.iconPath}
                </svg>
            `;
            badge.querySelector('.badge-name').textContent = char.name;
        }
    }

    renderCurrentNode() {
        const node = this.engine.getCurrentNode();
        if (!node) return;

        const textEl = document.getElementById('narrative-text');
        const cursor = document.getElementById('typing-cursor');
        const choicesContainer = document.getElementById('choices-container');

        choicesContainer.innerHTML = '';
        cursor.classList.remove('hidden');

        const speed = CONFIG.textSpeed[this.settings.textSpeed];
        
        this.typeText(textEl, node.text, speed, () => {
            cursor.classList.add('hidden');
            this.renderChoices(node.choices);
        });
    }

    typeText(element, text, speed, callback) {
        if (speed === 0) {
            element.textContent = text;
            callback?.();
            return;
        }

        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                callback?.();
            }
        };
        
        type();
    }

    renderChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container || !choices?.length) {
            if (this.engine.isEnding()) {
                this.showEnding();
            }
            return;
        }

        container.innerHTML = choices.map((choice, index) => `
            <button 
                class="choice-btn"
                data-action="make-choice"
                data-index="${index}"
            >
                <span class="choice-text">${choice.text}</span>
                ${choice.effect ? `<span class="choice-effect">${choice.effect}</span>` : ''}
            </button>
        `).join('');
    }

    makeChoice(index) {
        const result = this.engine.choose(index);
        if (!result) return;

        if (result.effect) {
            this.showEffectToast(result.effect);
        }

        if (CONFIG.autoSave) {
            this.saveGame();
        }

        this.renderCurrentNode();
    }

    showEffectToast(effect) {
        const toast = document.getElementById('effect-toast');
        if (!toast) return;

        toast.textContent = effect;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 2000);
    }

    showEnding() {
        const node = this.engine.getCurrentNode();
        
        document.getElementById('ending-title').textContent = node.title || 'The End';
        document.getElementById('ending-text').textContent = node.text;
        
        this.storage.remove('saveGame');
        this.showScreen('screen-ending');
    }

    showHistory() {
        const history = this.engine?.getHistory() || [];
        const container = document.getElementById('history-content');
        
        if (!container) return;

        if (!history.length) {
            container.innerHTML = '<p class="empty-state">No choices made yet.</p>';
        } else {
            container.innerHTML = history.map(entry => `
                <div class="timeline-item">
                    <p class="timeline-text">${entry.text}</p>
                    <span class="timeline-choice">→ ${entry.choice}</span>
                </div>
            `).join('');
        }

        this.openModal('modal-history');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new StoryForgeApp();
    app.init();
});