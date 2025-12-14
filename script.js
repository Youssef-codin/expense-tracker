// --- 1. إعدادات الثيم (Dark Mode) ---
// بيشتغل في كل الصفحات
if(localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

// دالة تفعيل المود
function setTheme(mode) {
    if(mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

// --- 2. كود التحقق (Authentication) ---
const AUTH_KEY = 'currentUser';
const ALL_USERS_KEY = 'appUsers';

// التحقق من وجود مستخدم مسجل للدخول
function checkAuth() {
    const user = localStorage.getItem(AUTH_KEY);
    // لو مش في صفحة الـ Login أو Registration ومفيش مستخدم مسجل دخول، حوله للـ Login
    if (window.location.pathname.indexOf('login.html') === -1 && 
        window.location.pathname.indexOf('registration.html') === -1 && 
        !user) {
        window.location.href = 'login.html';
    } 
    // لو في صفحة الـ Login أو Registration وفي مستخدم مسجل دخول، حوله للـ Transactions
    else if ((window.location.pathname.indexOf('login.html') !== -1 || 
              window.location.pathname.indexOf('registration.html') !== -1) && 
              user) {
        window.location.href = 'transactions.html';
    }

    // عرض اسم المستخدم في القائمة الجانبية (للتجميل)
    if(user) {
        const currentUser = JSON.parse(user);
        const usernameEl = document.getElementById('loggedInUsername');
        if (usernameEl) {
            usernameEl.textContent = currentUser.username;
        }
    }
}

checkAuth(); // شغل التحقق عند تحميل أي صفحة

// --- 2.1. منطق تسجيل الدخول (Login) ---
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem(ALL_USERS_KEY) || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if(user) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            alert('Login successful!');
            window.location.href = 'transactions.html';
        } else {
            alert('Invalid username or password.');
        }
    });
}

// --- 2.2. منطق إنشاء حساب (Registration) ---
const regForm = document.getElementById('regForm');
if(regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const email = document.getElementById('regEmail').value.trim();
        const age = document.getElementById('regAge').value.trim();

        if(!username || !password || !email || !age) {
            alert('Please fill all fields.');
            return;
        }

        let users = JSON.parse(localStorage.getItem(ALL_USERS_KEY) || '[]');
        
        if(users.some(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }

        const newUser = { username, password, email, age };
        users.push(newUser);
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// --- 2.3. منطق تسجيل الخروج (Logout) ---
window.logout = function() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

// --- 3. كود صفحة المعاملات (Transactions) ---
const tableBody = document.getElementById('tableBody');

if (tableBody) { // بنتأكد إن الجدول موجود
    // ... باقي كود الـ Transactions لم يتغير ...
    let transactions = [];
    let editIndex = -1;

    const amountEl = document.getElementById('amount');
    const typeEl = document.getElementById('type');
    const descEl = document.getElementById('description');
    const dateEl = document.getElementById('date');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const balanceEl = document.getElementById('balance');
    
    // إعداد الحفظ المحلي، لو مش موجود بنفترض إنه شغال
    const isSaveLocal = localStorage.getItem('saveLocal') !== 'false'; 

    // تحميل البيانات
    if(localStorage.getItem('transactions')){
        transactions = JSON.parse(localStorage.getItem('transactions'));
        renderTable();
    }

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const amount = parseFloat(amountEl.value);
            const type = typeEl.value;
            const description = descEl.value.trim();
            const date = dateEl.value;

            if(!amount || !description || !date){ alert('Please fill all fields.'); return; }

            const item = { amount, type, description, date };

            if(editIndex === -1) transactions.unshift(item);
            else { transactions[editIndex] = item; editIndex = -1; }

            if(isSaveLocal) localStorage.setItem('transactions', JSON.stringify(transactions));

            clearForm();
            renderTable();
        });
    }

    if(clearBtn) clearBtn.addEventListener('click', clearForm);

    function clearForm(){ amountEl.value=''; descEl.value=''; dateEl.value=''; typeEl.value='Income'; editIndex=-1; }

    function renderTable(){
        tableBody.innerHTML = '';
        let income = 0, expense = 0;
        transactions.forEach((t,i) =>{
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
            tr.innerHTML = `
            <td class="px-6 py-4">${t.amount.toFixed(2)} EGP</td>
            <td class="px-6 py-4">${t.type}</td>
            <td class="px-6 py-4">${t.description}</td>
            <td class="px-6 py-4">${t.date}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="editT(${i})" class="px-3 py-1 mr-2 rounded bg-blue-600 text-white text-sm">Edit</button>
                <button onclick="delT(${i})" class="px-3 py-1 rounded bg-red-600 text-white text-sm">Delete</button>
            </td>`;
            tableBody.appendChild(tr);

            if(t.type === 'Income') income += t.amount; else expense += t.amount;
        });
        if(balanceEl) balanceEl.textContent = `${(income - expense).toFixed(2)} EGP`;
    }

    // جعل الدوال Global للتعامل مع onclick
    window.delT = function(i){ 
        if(!confirm('Delete this transaction?')) return; 
        transactions.splice(i,1); 
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        renderTable(); 
    }

    window.editT = function(i){ 
        const t = transactions[i]; 
        amountEl.value = t.amount; 
        typeEl.value = t.type; 
        descEl.value = t.description; 
        dateEl.value = t.date; 
        editIndex = i; 
        window.scrollTo({top:0,behavior:'smooth'}); 
    }
}

// --- 4. كود صفحة الإعدادات (Settings) ---
const saveLocalCheckbox = document.getElementById('saveLocal');
if(saveLocalCheckbox) {
    // تحميل حالة الـ Checkbox
    saveLocalCheckbox.checked = localStorage.getItem('saveLocal') !== 'false';
    
    saveLocalCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('saveLocal', e.target.checked);
    });

    // ربط زراير الثيم
    const lightBtn = document.getElementById('lightTheme');
    const darkBtn = document.getElementById('darkTheme');
    
    if(lightBtn) lightBtn.addEventListener('click', () => setTheme('light'));
    if(darkBtn) darkBtn.addEventListener('click', () => setTheme('dark'));
}



// ==================== Dashboard Logic ====================
if (window.location.pathname.includes("dashboard.html")) {

    const sumIncomeEl = document.getElementById("sumIncome");
    const sumExpenseEl = document.getElementById("sumExpense");
    const sumBalanceEl = document.getElementById("sumBalance");

    const pieCtx = document.getElementById("pieChart");
    const barCtx = document.getElementById("barChart");

    // Load transactions
    let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    let totalIncome = 0;
    let totalExpense = 0;

    // For Bar Chart
    let monthlyIncome = new Array(12).fill(0);
    let monthlyExpense = new Array(12).fill(0);

    transactions.forEach(t => {
        const month = new Date(t.date).getMonth();

        if (t.type === "Income") {
            totalIncome += t.amount;
            monthlyIncome[month] += t.amount;
        } else {
            totalExpense += t.amount;
            monthlyExpense[month] += t.amount;
        }
    });

    // Display summary
    sumIncomeEl.textContent = `${totalIncome.toFixed(2)} EGP`;
    sumExpenseEl.textContent = `${totalExpense.toFixed(2)} EGP`;
    sumBalanceEl.textContent = `${(totalIncome - totalExpense).toFixed(2)} EGP`;

    // Draw Pie Chart
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [totalIncome, totalExpense],
            }]
        }
    });

    // Draw Bar Chart
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [
                { label: "Income", data: monthlyIncome },
                { label: "Expenses", data: monthlyExpense }
            ]
        }
    });

}
