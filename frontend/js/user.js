let currentUser = null;

async function loadProfile() {
  console.log('Loading user profile...');
  
  const container = document.getElementById('profileInfo');
  if (!container) return;

  try {
    const profile = await window.api.getCurrentUser();
    currentUser = profile;
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
  const nameInput = document.getElementById('profileName');
  if (nameInput && currentUser) nameInput.value = currentUser.full_name || '';
  window.common?.openModal('profileModal');
}

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

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  initProfileForm();
});

window.user = { loadProfile, openProfileModal };
