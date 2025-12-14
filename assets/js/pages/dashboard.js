import { checkAuth, setupLogout } from '../core/auth.js';
import '../core/theme.js';
import { Api } from '../core/api.js';

checkAuth();
setupLogout();

const sumIncomeEl = document.getElementById("totalIncome");
const sumExpenseEl = document.getElementById("totalExpenses");
const sumBalanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("incomeAmount");
const expenseAmountEl = document.getElementById("expenseAmount");
const pieRatioEl = document.getElementById("pieChartRatio");
const highestMonthEl = document.getElementById("highestMonth");
const pieCanvas = document.getElementById("pieChart");
const barCanvas = document.getElementById("barChart");
const chartRangeSelect = document.getElementById("chartRange");

let transactions = [];
let barChart;

initDashboard();

async function initDashboard() {
    try {
        const response = await Api.get('/expense/get_expenses.php');
        if (response.success && Array.isArray(response.data)) {
            transactions = response.data;
            updateDashboard();
        }
    } catch (error) {
        console.error("Failed to load dashboard data", error);
    }
}

function updateDashboard() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        // Map 'category' to 'type' logic
        if (t.category === "Income") {
            totalIncome += parseFloat(t.amount) || 0;
        } else {
            totalExpenses += parseFloat(t.amount) || 0;
        }
    });

    if(sumIncomeEl) sumIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    if(incomeAmountEl) incomeAmountEl.textContent = `$${totalIncome.toFixed(2)}`;
    if(sumExpenseEl) sumExpenseEl.textContent = `$${totalExpenses.toFixed(2)}`;
    if(expenseAmountEl) expenseAmountEl.textContent = `$${totalExpenses.toFixed(2)}`;
    if(sumBalanceEl) sumBalanceEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;

    const ratio = totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : "∞";
    if(pieRatioEl) pieRatioEl.textContent = `${ratio}:1`;

    if(pieCanvas) {
        // Destroy existing chart if re-rendering (though we only call this once currently)
        const existingChart = Chart.getChart(pieCanvas);
        if (existingChart) existingChart.destroy();

        new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [totalIncome, totalExpenses],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%'
            }
        });
    }
    
    // Initial Bar Chart Render
    const range = chartRangeSelect ? parseInt(chartRangeSelect.value) : 6;
    updateBarChart(range);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function updateBarChart(monthCount = 6) {
    if(!barCanvas) return;

    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);
    const now = new Date();
    const currentMonth = now.getMonth();

    transactions.forEach(t => {
        const date = new Date(t.date);
        const month = date.getMonth();
        // Simple logic: check if within last X months broadly
        // Note: This logic wraps around years simplistically. 
        // Ideally we should check full date objects.
        
        let monthDiff = (currentMonth - month + 12) % 12;
        
        if (monthDiff < monthCount) {
             if (t.category === 'Income') monthlyIncome[month] += parseFloat(t.amount) || 0;
            else monthlyExpenses[month] += parseFloat(t.amount) || 0;
        }
    });

    const displayMonths = [];
    const displayIncome = [];
    const displayExpenses = [];
    
    for (let i = 0; i < monthCount; i++) {
        const idx = (currentMonth - i + 12) % 12;
        displayMonths.unshift(months[idx]);
        displayIncome.unshift(monthlyIncome[idx]);
        displayExpenses.unshift(monthlyExpenses[idx]);
    }

    let maxValue = 0;
    let highestMonthIndex = -1;
    
    for (let i = 0; i < monthCount; i++) {
        const total = displayIncome[i] + displayExpenses[i];
        if (total > maxValue) {
            maxValue = total;
            highestMonthIndex = i;
        }
    }

    if(highestMonthEl) {
        highestMonthEl.textContent = 
            highestMonthIndex !== -1 && maxValue > 0 
            ? `Highest: ${displayMonths[highestMonthIndex]} ($${maxValue.toFixed(2)})`
            : 'Highest: No data';
    }

    if (barChart) barChart.destroy();
    
    barChart = new Chart(barCanvas, {
        type: 'bar',
        data: {
            labels: displayMonths,
            datasets: [
                {
                    label: 'Income',
                    data: displayIncome,
                    backgroundColor: '#10B981',
                    borderRadius: 4
                },
                {
                    label: 'Expenses',
                    data: displayExpenses,
                    backgroundColor: '#EF4444',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => '$' + v }
                }
            }
        }
    });
}

if(chartRangeSelect) {
    chartRangeSelect.addEventListener('change', function() {
        updateBarChart(parseInt(this.value));
    });
}