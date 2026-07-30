let currentUser = null;

async function loadProfile() {
  console.log('Loading employee profile...');
  const container = document.getElementById('profileCard') || document.getElementById('profileInfo');
  if (!container) return;
  
  if (window.common?.showLoading) {
    window.common.showLoading(container);
  } else {
    container.innerHTML = '<p>Loading...</p>';
  }
  
  try {
    const profile = await window.api.getEmployeeDashboard();
    currentUser = profile;
    console.log('Employee profile:', profile);
    container.innerHTML = `
      <div class="profile-card">
        <h3>${profile.full_name}</h3>
        <p>${profile.email}</p>
        <span class="role-badge role-employee">Employee</span>
      </div>
    `;
    renderPersonalCharts();
  } catch (err) {
    console.error('Load profile error:', err);
    container.innerHTML = '<p>Error loading profile</p>';
    window.api?.showMessage(err.message, 'error');
  }
}

function renderPersonalCharts() {
  window.charts?.renderLineChart('personalActivityChart', [10, 25, 18, 35], ['Week1', 'Week2', 'Week3', 'Week4']);
  window.charts?.renderPieChart('recentUploadsChart', {
    'Public': 3,
    'Internal': 2,
    'Confidential': 1
  });
}

// Open profile modal
window.openProfileModal = function() {
  const nameInput = document.getElementById('profileName');
  if (nameInput && currentUser) nameInput.value = currentUser.full_name || '';
  window.common?.openModal('profileModal');
};

function initProfileForm() {
  const form = document.getElementById('profileForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const full_name = document.getElementById('profileName')?.value.trim();
    if (!full_name) {
      window.api.showMessage('Please enter your name', 'error');
      return;
    }
    try {
      await window.api.updateMyProfile({ full_name });
      window.api.showMessage('Profile updated successfully', 'success');
      window.common?.closeModal();
      loadProfile();
    } catch (err) {
      console.error('Update profile error:', err);
      window.api.showMessage(err.message || 'Failed to update profile', 'error');
    }
  });
}

// Export upload function
window.uploadEmployeeFile = function() {
  window.common?.uploadFileHelper?.('fileInput');
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  initProfileForm();
});

window.employee = { loadProfile };
