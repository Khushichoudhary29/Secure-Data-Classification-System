// manager.js - Manager dashboard
const { getManagerEmployees, updateEmployee } = window.api;
const { showLoading } = window.common;

async function loadEmployees() {
  console.log('Loading manager employees...');
  const tbody = document.querySelector('#employeesTable tbody');
  if (!tbody) return;
  
  showLoading(tbody);
  try {
    const employees = await getManagerEmployees();
    console.log('Manager employees fetched:', employees.length);
    tbody.innerHTML = employees.map(emp => `
      <tr>
        <td>${emp.full_name || emp.email}</td>
        <td>${emp.email}</td>
        <td>${emp.performance || 'N/A'}</td>
        <td>
          <button onclick="editEmployee(${emp.id})" class="btn small">Edit</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load employees error:', err);
    tbody.innerHTML = '<tr><td colspan="4">Error loading employees</td></tr>';
    showMessage(err.message, 'error');
  }
}

function editEmployee(userId) {
  // Populate modal
  window.common.openModal('employeeModal');
}

// Load dashboard stats
async function loadDashboard() {
  document.getElementById('totalEmployees').textContent = '12';
  document.getElementById('teamPerformance').textContent = '88%';
  document.getElementById('teamUploads').textContent = '45';
  window.charts.renderBarChart('performanceChart', [85, 92, 78, 95], ['John', 'Jane', 'Bob', 'Alice']);
  window.charts.renderPieChart('teamActivityChart', {'Uploads': 45, 'Reviews': 23, 'Reports': 12});
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadEmployees();
});

window.manager = { loadEmployees, editEmployee, loadDashboard };
