import { checkAuth } from '../core/auth.js';
import '../core/theme.js';
import { AUTH_KEY } from '../core/constants.js';
import { AuthService } from '../core/api_service.js';

checkAuth();

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await AuthService.login(username, password);

            if (response.data) {
                localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
            }

            alert('Login successful!');
            window.location.href = 'transactions.html';
        } catch (error) {
            console.error(error);
            alert('Invalid username or password.');
        }
    });
}
