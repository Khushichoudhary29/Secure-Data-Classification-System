// user.js - User dashboard (FIXED)

async function loadProfile() {
  console.log('Loading user profile...');
  
  const container = document.getElementById('profileInfo');
  if (!container) return;

  try {
    // FIXED: Use window.api directly instead of destructuring
    const profile = await window.api.getCurrentUser();
    console.log('User profile:', profile);

    container.innerHTML = `
      <div class="profile-card">
        <h3>${profile.full_name}</h3>
        <p>${profile.email}</p>
        <span class="role-badge role-user">User</span>
      </div>
    `;
  } catch (err) {
    console.error('Load user profile error:', err);
    container.innerHTML = '<p>Failed to load profile</p>';
    window.api?.showMessage(err.message, 'error');
  }
}

// FIXED: Export upload function properly (renamed to avoid conflict with employee.js)
// We'll hook this into window for HTML onclick access
window.uploadUserFile = function() {
  window.common?.uploadFileHelper?.('fileInput');
};

// Open profile modal
function openProfileModal() {
  window.common?.openModal('profileModal');
}

// Init
document.addEventListener('DOMContentLoaded', loadProfile);

window.user = { loadProfile, openProfileModal };
