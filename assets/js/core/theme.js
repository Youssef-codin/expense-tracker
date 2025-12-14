import { THEME_KEY } from './constants.js';

export function initTheme() {
    if(localStorage.getItem(THEME_KEY) === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

export function setTheme(mode) {
    if(mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_KEY, 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_KEY, 'light');
    }
}

// Auto-initialize on import
initTheme();
