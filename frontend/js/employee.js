// employee.js - Employee dashboard
const { getEmployeeDashboard, uploadFile } = window.api;
const { uploadFileHelper, showLoading } = window.common;

async function loadProfile() {
  console.log('Loading employee profile...');
  const container = document.getElementById('profileCard') || document.getElementById('profileInfo');
  if (!container) return;
  
  showLoading(container);
  try {
    const profile = await getEmployeeDashboard();
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
    showMessage(err.message, 'error');
  }
}

function renderPersonalCharts() {
  window.charts.renderLineChart('personalActivityChart', [10, 25, 18, 35], ['Week1', 'Week2', 'Week3', 'Week4']);
  window.charts.renderPieChart('recentUploadsChart', {
    'Public': 3,
    'Internal': 2,
    'Confidential': 1
  });
}

// Upload
window.uploadFile = uploadFileHelper;

// Init
document.addEventListener('DOMContentLoaded', loadProfile);

window.employee = { loadProfile };
