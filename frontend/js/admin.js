// admin.js - Admin dashboard logic
const { getAdminUsers, getAdminRoles, updateUserRole, createAdmin, deleteUser, showMessage, roleMap } = window.api;
const { openModal, closeModal, showLoading, uploadFileHelper } = window.common;

let currentUsers = [];
let currentUserId = null;

// Load dashboard stats
async function loadDashboard() {
  console.log('Loading admin dashboard...');
  try {
    const users = await getAdminUsers();
    console.log('Admin users fetched:', users.length);
    const roles = await getAdminRoles();
    
    // Stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeAdmins').textContent = users.filter(u => u.role_id === 4).length;
    
    // Charts
    renderRoleChart(users);
    renderActivityChart(mockActivityData());
    renderGrowthChart(mockGrowthData());
  } catch (err) {
    console.error('Dashboard load error:', err);
    showMessage('Dashboard load failed', 'error');
  }
}

// Load users table
async function loadUsers() {
  showLoading(document.querySelector('#usersTable tbody'));
  try {
    currentUsers = await getAdminUsers();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = currentUsers.map(user => `
      <tr>
        <td>${user.full_name || user.email}</td>
        <td>${user.email}</td>
        <td>
          <span class="role-badge role-${roleMap[user.role_id]?.toLowerCase()}">${roleMap[user.role_id] || 'Unknown'}</span>
        </td>
        <td>
          <button onclick="editRole(${user.id}, ${user.role_id})" class="btn small">Edit</button>
          <button onclick="deleteUserConfirm(${user.id})" class="btn btn-danger small">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    document.querySelector('#usersTable tbody').innerHTML = '<tr><td colspan="4">Error loading users</td></tr>';
    showMessage(err.message, 'error');
  }
}

// Edit role
function editRole(userId, currentRoleId) {
  currentUserId = userId;
  const select = document.getElementById('roleSelect');
  select.innerHTML = `
    <option value="1">User</option>
    <option value="2">Employee</option>
    <option value="3">Manager</option>
    <option value="4">Admin</option>
  `;
  select.value = currentRoleId;
  openModal('roleModal');
}

async function updateRoleConfirm() {
  const roleId = document.getElementById('roleSelect').value;
  try {
    await updateUserRole(currentUserId, roleId);
    showMessage('Role updated', 'success');
    closeModal();
    loadUsers();
  } catch (err) {
    showMessage(err.message, 'error');
  }
}

function deleteUserConfirm(userId) {
  if (confirm('Delete user?')) {
    deleteUser(userId).then(() => {
      showMessage('User deleted', 'success');
      loadUsers();
    }).catch(showMessage);
  }
}

function openCreateAdminModal() {
  // Modal logic for create admin
  showMessage('Create admin feature ready', 'info');
}

// Mock data for charts
function mockActivityData() {
  return [
    {month: 'Jan', uploads: 12},
    {month: 'Feb', uploads: 19},
    {month: 'Mar', uploads: 15},
    {month: 'Apr', uploads: 22}
  ];
}

function mockGrowthData() {
  return [
    {month: 'Jan', users: 45},
    {month: 'Feb', users: 52},
    {month: 'Mar', users: 68},
    {month: 'Apr', users: 85}
  ];
}

// Chart renders (call charts.js)
function renderRoleChart(users) {
  const roleCounts = {};
  users.forEach(u => {
    const role = roleMap[u.role_id] || 'Other';
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  window.charts.renderPieChart('roleChart', roleCounts);
}

function renderActivityChart(data) {
  window.charts.renderBarChart('activityChart', data.map(d => d.uploads), data.map(d => d.month));
}

function renderGrowthChart(data) {
  window.charts.renderLineChart('growthChart', data.map(d => d.users), data.map(d => d.month));
}

// Init
document.addEventListener('DOMContentLoaded', loadDashboard);

window.admin = { loadDashboard, loadUsers, editRole, updateRoleConfirm, deleteUserConfirm, openCreateAdminModal };
