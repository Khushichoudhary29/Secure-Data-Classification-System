// employee.js - Employee dashboard (FIXED)

async function loadProfile() {
  console.log('Loading employee profile...');
  const container = document.getElementById('profileCard') || document.getElementById('profileInfo');
  if (!container) return;
  
  // FIXED: Use window.common.showLoading
  if (window.common?.showLoading) {
    window.common.showLoading(container);
  } else {
    container.innerHTML = '<p>Loading...</p>';
  }
  
  try {
    // FIXED: Use window.api directly instead of destructuring
    const profile = await window.api.getEmployeeDashboard();
    console.log('Employee profile:', profile);
    container.innerHTML = `
      <div class="profile-card">
        <h3>${profile.full_name}</h3>
        <p>${profile.email}</p>
        <span class="role-badge role-employee">Employee</span>
      </div>
    `;
    // Load charts
    renderPersonalCharts();
  } catch (err) {
    console.error('Load profile error:', err);
    container.innerHTML = '<p>Error loading profile</p>';
    window.api?.showMessage(err.message, 'error');
  }
}

function renderPersonalCharts() {
  // FIXED: Use optional chaining for window.charts
  window.charts?.renderLineChart('personalActivityChart', [10, 25, 18, 35], ['Week1', 'Week2', 'Week3', 'Week4']);
  window.charts?.renderPieChart('recentUploadsChart', {
    'Public': 3,
    'Internal': 2,
    'Confidential': 1
  });
}

// FIXED: Export upload function properly (renamed to avoid conflict with user.js)
// We'll hook this into window for HTML onclick access
window.uploadEmployeeFile = function() {
  window.common?.uploadFileHelper?.('fileInput');
};

// Init
document.addEventListener('DOMContentLoaded', loadProfile);

window.employee = { loadProfile };
