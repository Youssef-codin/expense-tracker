import { checkAuth } from '../core/auth.js';
import '../core/theme.js';
import { Api } from '../core/api.js';

checkAuth();

const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const email = document.getElementById('regEmail').value.trim();

        if (!username || !password || !email) {
            alert('Please fill username, email and password.');
            return;
        }

        try {
            await Api.post('/user/register.php', { username, email, password });
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error(error);
            alert(error.message || 'Registration failed');
        }
    });
}
