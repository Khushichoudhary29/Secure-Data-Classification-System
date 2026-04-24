// common.js - Shared utilities, modals, sidebar, theme

// Sidebar
function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('hidden');
  document.querySelector('.main')?.classList.toggle('sidebar-open');
}

// Hamburger animation
document.querySelectorAll('.hamburger')?.forEach(btn => {
  btn.onclick = toggleSidebar;
});

// Modals
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal() {
  document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
}

// Loading spinner
function showLoading(el) {
  el.innerHTML = '<span class="loading"></span> Loading...';
}

// Set role display
function setRoleDisplay(role) {
  const el = document.getElementById('roleDisplay');
  if (el) {
    el.textContent = role;
    el.className = `role-badge role-${role.toLowerCase()}`;
  }
}

// Navbar / sidebar init
function initCommon() {
  // Role display
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRoleDisplay(payload.role || 'User');
    } catch(e) {}
  }
  
  // Logout buttons
  document.querySelectorAll('[onclick="logout()"]')?.forEach(btn => {
    btn.onclick = window.api.logout;
  });
  
  // Global modal close on backdrop
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) closeModal();
  });
}

// File upload helper
async function uploadFileHelper(inputId = 'fileInput') {
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];
  if (!file) {
    window.api.showMessage('Please select a file', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Upload request:', file.name);
  window.api.showMessage('Uploading...', 'info');
  try {
    const result = await window.api.uploadFile(formData);
    console.log('Upload response:', result);
    window.api.showMessage(`✅ ${result.classification} classification`, 'success');
    fileInput.value = '';
    // Refresh lists/charts
    if (typeof loadDashboard === 'function') loadDashboard();
  } catch (err) {
    console.error('Upload error:', err);
    window.api.showMessage('Upload failed: ' + err.message, 'error');
  }
}

window.uploadFileHelper = uploadFileHelper;

// Export globals for HTML onclick
window.toggleSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.showLoading = showLoading;
window.logout = window.api.logout;

// Export global
window.common = {
  toggleSidebar, openModal, closeModal, showLoading, setRoleDisplay, initCommon, uploadFileHelper
};

// Auto init
document.addEventListener('DOMContentLoaded', initCommon);

