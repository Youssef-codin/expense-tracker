import { checkAuth, setupLogout, getCurrentUser } from '../core/auth.js';
import '../core/theme.js';
import { THEME_KEY, AUTH_KEY } from '../core/constants.js';
import { Api } from '../core/api.js';

checkAuth();
setupLogout();

// Load user data
const currentUser = getCurrentUser() || {};
if (currentUser.username) {
    const loggedInUserEl = document.getElementById('loggedInUsername');
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('email');

    if (loggedInUserEl) loggedInUserEl.textContent = currentUser.username;
    if (usernameEl) usernameEl.value = currentUser.username;
    if (emailEl && currentUser.email) emailEl.value = currentUser.email;
}

// Update statistics
async function updateStats() {
    try {
        const response = await Api.get('/expense/get_expenses.php');
        if (response.success && Array.isArray(response.data)) {
            const count = response.data.length;
            const totalTransEl = document.getElementById('totalTransactions');
            if (totalTransEl) totalTransEl.textContent = count;
        }
    } catch (e) {
        console.error("Failed to fetch stats", e);
    }

    const accountAgeEl = document.getElementById('accountAge');
    const lastLoginEl = document.getElementById('lastLogin');

    if (accountAgeEl && currentUser.created_at) {
        const created = new Date(currentUser.created_at);
        const now = new Date();
        const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        accountAgeEl.textContent = diffDays === 0 ? 'Today' : `${diffDays} days`;
    } else if (accountAgeEl) {
        accountAgeEl.textContent = 'Unknown';
    }

    if (lastLoginEl) {
        const now = new Date();
        lastLoginEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Save local toggle (Visual only now, as we enforce backend storage)
const saveLocalCheckbox = document.getElementById('saveLocal');
if (saveLocalCheckbox) {
    // It's checked by default in HTML, let's just leave it as a "dummy" or persistent pref
    // logic removed as we use DB now.
    saveLocalCheckbox.disabled = true;
    saveLocalCheckbox.parentElement.title = "Data is always saved to the cloud now";
}

// Clear data
const clearDataBtn = document.getElementById('clearData');
if (clearDataBtn) {
    clearDataBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear ALL transaction data? This cannot be undone.')) {
            try {
                await Api.post('/expense/delete_all_expenses.php');
                alert('All transaction data has been cleared successfully.');
                updateStats();
            } catch (e) {
                alert('Failed to clear data: ' + e.message);
            }
        }
    });
}

// Reset settings
const resetSettingsBtn = document.getElementById('resetSettings');
if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', function() {
        if (confirm('Reset all settings to default values?')) {
            localStorage.removeItem(THEME_KEY);
            alert('All local settings have been reset.');
            window.location.reload();
        }
    });
}

// Delete account
const deleteAccountBtn = document.getElementById('deleteAccount');
if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async function() {
        if (confirm('WARNING: This will permanently delete your account and all associated data. Are you absolutely sure?')) {
            try {
                await Api.post('/user/delete_account.php');
                // Client-side cleanup
                localStorage.removeItem(AUTH_KEY);
                alert('Account deleted.');
                window.location.href = 'login.html';
            } catch (e) {
                alert('Failed to delete account: ' + e.message);
            }
        }
    });
}

// Initialize
updateStats();
