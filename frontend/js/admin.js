// admin.js - Admin dashboard logic (PHASE 1 - Real Backend Stats)

let currentUsers = [];
let currentUserId = null;

function getRoleName(user) {
  return user?.role?.name || 'Unknown';
}


// Load dashboard stats from real backend
async function loadDashboard() {
  console.log('Loading admin dashboard...');

  try {
    // PHASE 1: Use real backend stats endpoint
    const stats = await window.api.getAdminStats();
    console.log('Admin stats fetched:', stats);

    // Update stat cards with real data
    const totalUsersEl = document.getElementById('totalUsers');
    const activeAdminsEl = document.getElementById('activeAdmins');
    const uploadsTodayEl = document.getElementById('uploadsToday');
    
    if (totalUsersEl) totalUsersEl.textContent = stats.total_users || 0;
    if (activeAdminsEl) activeAdminsEl.textContent = stats.active_admins || 0;
    if (uploadsTodayEl) uploadsTodayEl.textContent = stats.uploads_today || 0;

    // Render role distribution chart with real data
    renderRoleChartFromStats(stats.role_counts || {});

    // Load users for table
    const users = await window.api.getAdminUsers();
    currentUsers = users;

    // Render growth chart - use role counts as fallback
    renderGrowthChart(stats.role_counts || {});

    // Activity chart - use role counts as data
    renderActivityChart(stats.role_counts || {});

    // Load users table
    loadUsers();

  } catch (err) {
    console.error('Dashboard load error:', err);
    window.api.showMessage('Dashboard load failed', 'error');
  }
}

// Load users table
async function loadUsers() {
  const tbody = document.querySelector('#usersTable tbody');

  if (!tbody) return;

  // FIXED: Use window.common for showLoading
  if (window.common?.showLoading) {
    window.common.showLoading(tbody);
  } else {
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  }

try {
    currentUsers = await window.api.getAdminUsers();

    tbody.innerHTML = currentUsers.map(user => {
      // Backend sends user.role.name (and may or may not include role.id)
      const roleName = getRoleName(user);
      // For role update API we still need role_id; keep best-effort (id may not exist on role object)
      const roleId = user.role?.id ?? user.role_id ?? null;

      return `
        <tr>
          <td>${user.full_name || user.email}</td>
          <td>${user.email}</td>
          <td>
            <span class="role-badge role-${roleName.toLowerCase()}">
              ${roleName}
            </span>
          </td>
          <td>
            <button onclick="admin.editRole(${user.id}, ${roleId ?? 'null'})" class="btn small">
              Edit
            </button>
            <button onclick="admin.deleteUserConfirm(${user.id})" class="btn btn-danger small">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Load users error:', err);

    tbody.innerHTML =
      '<tr><td colspan="4">Error loading users</td></tr>';

    window.api.showMessage(err.message || 'Failed to load users', 'error');
  }
}

// Edit role
function editRole(userId, currentRoleId) {
  currentUserId = userId;

  const select = document.getElementById('roleSelect');

  if (!select) return;

  select.innerHTML = `
    <option value="1">Admin</option>
    <option value="2">Manager</option>
    <option value="3">Employee</option>
    <option value="4">User</option>
  `;

  select.value = currentRoleId;

  window.common?.openModal('roleModal');
}

// Confirm role update
async function updateRoleConfirm() {
  const roleId = document.getElementById('roleSelect').value;

  try {
    await window.api.updateUserRole(currentUserId, roleId);

    window.api.showMessage('Role updated successfully', 'success');

    window.common?.closeModal();

    loadDashboard();

  } catch (err) {
    console.error('Role update error:', err);
    window.api.showMessage(err.message || 'Failed to update role', 'error');
  }
}

// Delete user
function deleteUserConfirm(userId) {
  if (!confirm('Delete user?')) return;

  window.api.deleteUser(userId)
    .then(() => {
      window.api.showMessage('User deleted successfully', 'success');
      loadDashboard();
    })
    .catch(err => {
      console.error('Delete user error:', err);
      window.api.showMessage(err.message || 'Delete failed', 'error');
    });
}

// Create admin modal
function openCreateAdminModal() {
  window.api.showMessage('Create admin feature ready', 'info');
}

// PHASE 1: Removed mock data functions - using real backend data only

// Chart render from stats role_counts (pie chart)
function renderRoleChartFromStats(roleCounts) {
  console.log('Role counts for chart:', roleCounts);
  // Ensure we have data with all roles
  const chartData = roleCounts && Object.keys(roleCounts).length > 0 ? roleCounts : {
    'Admin': 0, 'Manager': 0, 'Employee': 0, 'User': 0
  };
  window.charts?.renderPieChart('roleChart', chartData);
}

// Activity chart - use role counts as bar chart data
function renderActivityChart(roleCounts) {
  const labels = Object.keys(roleCounts || {});
  const data = Object.values(roleCounts || {});
  
  // Use role names as labels if available
  if (labels.length === 0) {
    labels = ['Admin', 'Manager', 'Employee', 'User'];
    data = [0, 0, 0, 0];
  }
  
  window.charts?.renderBarChart('activityChart', data, labels);
}

// Growth chart - use role counts as line chart data
function renderGrowthChart(roleCounts) {
  const labels = Object.keys(roleCounts || {});
  const data = Object.values(roleCounts || {});
  
  // Use role names as labels if available
  if (labels.length === 0) {
    labels = ['Jan', 'Feb', 'Mar', 'Apr'];
    data = [0, 0, 0, 0];
  }
  
  window.charts?.renderLineChart('growthChart', data, labels);
}

// Keep old function for backwards compatibility
function renderRoleChart(users) {
  // Backwards compatibility: compute counts from user objects using role.name
  const roleCounts = {};

  if (Array.isArray(users)) {
    users.forEach(user => {
      const roleName = getRoleName(user);
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });
  }

  console.log('Role counts for chart:', roleCounts);
  window.charts?.renderPieChart('roleChart', roleCounts);
}



// Init
document.addEventListener('DOMContentLoaded', loadDashboard);

// Global access
window.admin = {
  loadDashboard,
  loadUsers,
  editRole,
  updateRoleConfirm,
  deleteUserConfirm,
  openCreateAdminModal
};
