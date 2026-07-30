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

  // Load files if list is present
  loadFiles();
}

// File list loader
async function loadFiles() {
  const fileListEl = document.getElementById('fileList');
  if (!fileListEl) return;
  
  if (window.showLoading) {
    window.showLoading(fileListEl);
  } else {
    fileListEl.innerHTML = '<p>Loading files...</p>';
  }
  
  try {
    const files = await window.api.getFiles();
    
    // Update dashboard upload counters dynamically
    const myUploadsEl = document.getElementById('myUploads');
    if (myUploadsEl) myUploadsEl.textContent = files.length;
    
    const teamUploadsEl = document.getElementById('teamUploads');
    if (teamUploadsEl) teamUploadsEl.textContent = files.length;

    const uploadsTodayEl = document.getElementById('uploadsToday');
    if (uploadsTodayEl) uploadsTodayEl.textContent = files.length;

    if (!files || files.length === 0) {
      fileListEl.innerHTML = '<p style="opacity: 0.7; text-align: center;">No accessible files found.</p>';
      return;
    }
    
    // Dynamic icon generation based on file extensions
    const getFileIcon = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      switch (ext) {
        case 'pdf': return '<i class="fa-solid fa-file-pdf" style="color: #f87171;"></i>';
        case 'doc':
        case 'docx': return '<i class="fa-solid fa-file-word" style="color: #60a5fa;"></i>';
        case 'xls':
        case 'xlsx': return '<i class="fa-solid fa-file-excel" style="color: #4ade80;"></i>';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif': return '<i class="fa-solid fa-file-image" style="color: #c084fc;"></i>';
        case 'txt': return '<i class="fa-solid fa-file-lines" style="color: #94a3b8;"></i>';
        case 'zip':
        case 'rar': return '<i class="fa-solid fa-file-zipper" style="color: #fbbf24;"></i>';
        default: return '<i class="fa-solid fa-file" style="color: #38bdf8;"></i>';
      }
    };

    fileListEl.innerHTML = `
      <div class="file-grid">
        ${files.map(f => {
          const cls = f.classification.toLowerCase();
          const icon = getFileIcon(f.original_filename);
          const dateStr = f.uploaded_at ? new Date(f.uploaded_at).toLocaleDateString() : new Date().toLocaleDateString();
          return `
            <div class="file-card fade-in">
              <div class="file-card-top">
                <div class="file-type-icon">${icon}</div>
                <span class="classification-badge badge-${cls}">${f.classification}</span>
              </div>
              <div>
                <h4 class="file-card-title" title="${f.original_filename}">${f.original_filename}</h4>
                <div class="file-card-meta">
                  <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                  <span><i class="fa-solid fa-shield-halved"></i> AES-256 Secured</span>
                </div>
              </div>
              <div class="file-card-actions">
                <button onclick="api.downloadFile(${f.id}, '${f.original_filename.replace(/'/g, "\\'")}')" class="btn">
                  <i class="fa-solid fa-circle-down"></i> Download
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Error loading files:', err);
    fileListEl.innerHTML = '<p style="color: var(--danger); text-align: center;">Error loading files.</p>';
  }
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
    
    // Refresh files list
    loadFiles();
    
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
window.loadFiles = loadFiles;

// Export global
window.common = {
  toggleSidebar, openModal, closeModal, showLoading, setRoleDisplay, initCommon, uploadFileHelper, loadFiles
};

// Auto init
document.addEventListener('DOMContentLoaded', initCommon);

