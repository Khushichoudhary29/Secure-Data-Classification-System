const API_BASE = 'http://127.0.0.1:8000';

// Role map - FIXED: 1=Admin, 2=Manager, 3=Employee, 4=User
const roleMap = {
  1: 'Admin',
  2: 'Manager',
  3: 'Employee',
  4: 'User'
};

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options
  };

  try {
    console.log("API Request:", `${API_BASE}${endpoint}`);
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || data.message || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API ERROR] ${endpoint}:`, error);
    throw error;
  }
}

function showMessage(msg, type = 'info') {
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast ${type} show`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function logout() {
  localStorage.clear();
  window.location.href = '../pages/login.html';
}

// Auth
async function loginUser(credentials) {
  const formData = new URLSearchParams(credentials);
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: formData
  }).then(r => r.json());
}

async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// Users
async function getCurrentUser() {
  return apiRequest('/users/me');
}

// Admin
async function getAdminUsers() {
  return apiRequest('/admin/users');
}

async function getAdminStats() {
  return apiRequest('/admin/stats');
}

async function getAdminRoles() {
  return apiRequest('/admin/roles');
}

async function updateUserRole(userId, roleId) {
  return apiRequest(`/admin/update-role/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({role_id: roleId})
  });
}

async function createAdmin(adminData) {
  return apiRequest('/admin/create-admin', {
    method: 'POST',
    body: JSON.stringify(adminData)
  });
}

async function deleteUser(userId) {
  return apiRequest(`/admin/delete-user/${userId}`, {
    method: 'DELETE'
  });
}

async function updateUser(userId, userData) {
  return apiRequest(`/admin/update-user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
}

// Manager
async function getManagerEmployees() {
  return apiRequest('/manager/employees');
}

async function getEmployeeDetails(userId) {
  return apiRequest(`/manager/employees/${userId}`);
}

async function updateEmployee(userId, data) {
  return apiRequest(`/manager/employees/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Employee
async function getEmployeeDashboard() {
  return apiRequest('/employee/dashboard');
}

async function getEmployeeProfile() {
  return apiRequest('/employee/my-profile');
}

// Files
async function uploadFile(formData) {
  return apiRequest('/files/upload', {
    method: 'POST',
    body: formData
  });
}

async function downloadFile(fileId) {
  const blob = await fetch(`${API_BASE}/files/download/${fileId}`, {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
  }).then(r => r.blob());
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `secure-file-${fileId}.enc`;
  a.click();
}

// Global window export
window.api = {
  apiRequest, showMessage, logout, loginUser, registerUser, getCurrentUser,
  getAdminUsers, getAdminStats, getAdminRoles, updateUserRole, createAdmin, deleteUser, updateUser,
  getManagerEmployees, getEmployeeDetails, updateEmployee,
  getEmployeeDashboard, getEmployeeProfile,
  uploadFile, downloadFile,
  roleMap
};
