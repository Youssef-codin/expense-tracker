import { AUTH_KEY } from './constants.js';
import { AuthService } from './api_service.js';

export function getCurrentUser() {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
}

export function checkAuth() {
    const user = getCurrentUser();
    const path = window.location.pathname;

    const isAuthPage = path.includes('login.html') || path.includes('registration.html');

    if (!isAuthPage && !user) {
        window.location.href = 'login.html';
    }
    else if (isAuthPage && user) {
        window.location.href = 'index.html';
    }

    if (user) {
        const usernameEl = document.getElementById('loggedInUsername');
        if (usernameEl) {
            usernameEl.textContent = user.username;
        }
    }
}

export async function logout() {
    try {
        await AuthService.logout();
    } catch (e) {
        console.warn('Logout API call failed, but clearing local state anyway', e);
    }

    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

export function setupLogout() {
    const btn = document.getElementById('logoutBtn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    window.logout = logout;
}
