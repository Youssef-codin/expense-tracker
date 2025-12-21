import { Api } from './api.js';

export const AuthService = {
    login: (username, password) => Api.post('/user/login.php', { username, password }),
    register: (username, email, password) => Api.post('/user/register.php', { username, email, password }),
    logout: () => Api.get('/user/logout.php'),
    deleteAccount: () => Api.post('/user/delete_account.php')
};

export const ExpenseService = {
    getAll: () => Api.get('/expense/get_expenses.php'),
    add: (data) => Api.post('/expense/add_expense.php', data),
    update: (data) => Api.post('/expense/edit_expense.php', data),
    delete: (id) => Api.post('/expense/delete_expense.php', { id }),
    deleteAll: () => Api.post('/expense/delete_all_expenses.php')
};