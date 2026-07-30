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
    const employees = await window.api.getManagerEmployees();
    console.log('Manager employees fetched:', employees.length);
    
    const totalEmployeesEl = document.getElementById('totalEmployees');
    if (totalEmployeesEl) totalEmployeesEl.textContent = employees.length;

    tbody.innerHTML = employees.map(emp => `
      <tr>
        <td>${emp.full_name || emp.email}</td>
        <td>${emp.email}</td>
        <td>${emp.performance || 'N/A'}</td>
        <td>
          <button onclick="manager.editEmployee(${emp.id})" class="btn small" style="padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-user-pen"></i> Edit</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load employees error:', err);
    tbody.innerHTML = '<tr><td colspan="4">Error loading employees</td></tr>';
    window.api?.showMessage(err.message, 'error');
  }
}

let currentEmployeeId = null;

async function editEmployee(userId) {
  currentEmployeeId = userId;
  try {
    const emp = await window.api.getEmployeeDetails(userId);
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    if (nameInput) nameInput.value = emp.full_name || '';
    if (emailInput) emailInput.value = emp.email || '';
    window.common?.openModal('employeeModal');
  } catch (err) {
    console.error('Error fetching employee details:', err);
    window.api?.showMessage('Failed to load employee details', 'error');
  }
}

function initManagerForm() {
  const form = document.getElementById('employeeForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const full_name = document.getElementById('editName')?.value.trim();
    const email = document.getElementById('editEmail')?.value.trim();
    
    if (!full_name || !email) {
      window.api.showMessage('Please fill all fields', 'error');
      return;
    }
    
    try {
      await window.api.updateEmployee(currentEmployeeId, { full_name, email });
      window.api.showMessage('Employee updated successfully', 'success');
      window.common?.closeModal();
      loadEmployees();
    } catch (err) {
      console.error('Update employee error:', err);
      window.api.showMessage(err.message || 'Failed to update employee', 'error');
    }
  });
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
  initManagerForm();
});

window.manager = { loadEmployees, editEmployee, loadDashboard };
