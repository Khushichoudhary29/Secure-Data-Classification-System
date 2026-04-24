// user.js - User dashboard
const { getCurrentUser } = window.api;
const { uploadFileHelper } = window.common;

async function loadProfile() {
  console.log('Loading user profile...');
  const container = document.getElementById('profileInfo');
  if (!container) return;
  
  try {
    const profile = await getCurrentUser();
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
    container.innerHTML = '<p>Loading profile...</p>';
  }
}

window.uploadFile = uploadFileHelper;

// Init
document.addEventListener('DOMContentLoaded', loadProfile);

window.user = { loadProfile };
