import { checkAuth, setupLogout } from '../core/auth.js';
import { setTheme } from '../core/theme.js';
import { ExpenseService } from '../core/api_service.js';

checkAuth();
setupLogout();

const lightBtn = document.getElementById('lightTheme');
const darkBtn = document.getElementById('darkTheme');
if (lightBtn) lightBtn.addEventListener('click', () => setTheme('light'));
if (darkBtn) darkBtn.addEventListener('click', () => setTheme('dark'));

const tableBody = document.getElementById('tableBody');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const descEl = document.getElementById('description');
const dateEl = document.getElementById('date');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const balanceEl = document.getElementById('balance');

let transactions = [];
let editId = null;

fetchTransactions();

async function fetchTransactions() {
    try {
        const response = await ExpenseService.getAll();
        if (response.success && Array.isArray(response.data)) {
            transactions = response.data;
            renderTable();
        }
    } catch (error) {
        console.error('Failed to load transactions:', error);
    }
}

function clearForm() {
    if (amountEl) amountEl.value = '';
    if (descEl) descEl.value = '';
    if (dateEl) dateEl.value = '';
    if (typeEl) typeEl.value = 'Income';
    editId = null;
    saveBtn.textContent = 'Save Transaction';
}

if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        const amount = parseFloat(amountEl.value);
        const type = typeEl.value; // Maps to 'category'
        const description = descEl.value.trim(); // Maps to 'title'
        const date = dateEl.value;

        if (!amount || !description || !date) {
            alert('Please fill all fields.');
            return;
        }

        const payload = {
            title: description,
            amount: amount,
            category: type,
            date: date
        };

        try {
            if (editId === null) {
                // add
                await ExpenseService.add(payload);
            } else {
                // edit
                payload.id = editId;
                await ExpenseService.update(payload);
            }

            clearForm();
            await fetchTransactions();
        } catch (error) {
            alert('Operation failed: ' + error.message);
        }
    });
}

if (clearBtn) clearBtn.addEventListener('click', clearForm);

function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    let income = 0, expense = 0;

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((t) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';

        tr.innerHTML = `
        <td class="px-6 py-4">${parseFloat(t.amount).toFixed(2)} EGP</td>
        <td class="px-6 py-4">${t.category}</td>
        <td class="px-6 py-4">${t.title}</td>
        <td class="px-6 py-4">${t.date}</td>
        <td class="px-6 py-4 text-right">
            <button data-action="edit" data-id="${t.id}" class="px-3 py-1 mr-2 rounded bg-blue-600 text-white text-sm">Edit</button>
            <button data-action="delete" data-id="${t.id}" class="px-3 py-1 rounded bg-red-600 text-white text-sm">Delete</button>
        </td>`;
        tableBody.appendChild(tr);

        if (t.category === 'Income') income += parseFloat(t.amount);
        else expense += parseFloat(t.amount);
    });

    if (balanceEl) balanceEl.textContent = `${(income - expense).toFixed(2)} EGP`;
}

if (tableBody) {
    tableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'delete') {
            if (!confirm('Delete this transaction?')) return;
            try {
                await ExpenseService.delete(id);
                fetchTransactions();
            } catch (error) {
                alert('Delete failed: ' + error.message);
            }
        } else if (action === 'edit') {
            const t = transactions.find(item => item.id == id);
            if (t) {
                if (amountEl) amountEl.value = t.amount;
                if (typeEl) typeEl.value = t.category;
                if (descEl) descEl.value = t.title;
                if (dateEl) dateEl.value = t.date;
                editId = id;
                saveBtn.textContent = 'Update Transaction';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}
