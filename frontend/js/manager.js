// manager.js - Manager dashboard (FIXED)

async function loadEmployees() {
  console.log('Loading manager employees...');
  const tbody = document.querySelector('#employeesTable tbody');
  if (!tbody) return;
  
  // FIXED: Use window.common.showLoading
  if (window.common?.showLoading) {
    window.common.showLoading(tbody);
  } else {
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  }
  
  try {
    // FIXED: Use window.api directly instead of destructuring
    const employees = await window.api.getManagerEmployees();
    console.log('Manager employees fetched:', employees.length);
    tbody.innerHTML = employees.map(emp => `
      <tr>
        <td>${emp.full_name || emp.email}</td>
        <td>${emp.email}</td>
        <td>${emp.performance || 'N/A'}</td>
        <td>
          <button onclick="manager.editEmployee(${emp.id})" class="btn small">Edit</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load employees error:', err);
    tbody.innerHTML = '<tr><td colspan="4">Error loading employees</td></tr>';
    window.api?.showMessage(err.message, 'error');
  }
}

function editEmployee(userId) {
  // Populate modal
  window.common?.openModal('employeeModal');
}

// Load dashboard stats
async function loadDashboard() {
  const totalEmployeesEl = document.getElementById('totalEmployees');
  const teamPerformanceEl = document.getElementById('teamPerformance');
  const teamUploadsEl = document.getElementById('teamUploads');
  
  if (totalEmployeesEl) totalEmployeesEl.textContent = '12';
  if (teamPerformanceEl) teamPerformanceEl.textContent = '88%';
  if (teamUploadsEl) teamUploadsEl.textContent = '45';
  
  // FIXED: Use window.charts with optional chaining
  window.charts?.renderBarChart('performanceChart', [85, 92, 78, 95], ['John', 'Jane', 'Bob', 'Alice']);
  window.charts?.renderPieChart('teamActivityChart', {'Uploads': 45, 'Reviews': 23, 'Reports': 12});
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadEmployees();
});

window.manager = { loadEmployees, editEmployee, loadDashboard };
