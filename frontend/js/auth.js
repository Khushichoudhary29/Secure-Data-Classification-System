// auth.js - Authentication logic (fixed: centralized API calls, no duplicates, role redirects)

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function redirectByRole() {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';
  
  const payload = decodeJWT(token);
  
  const routes = {
    4: 'admin_dashboard.html',
    3: 'manager_dashboard.html',
    2: 'employee_dashboard.html',
    1: 'user_dashboard.html'
  };
  
  window.location.href = routes[payload?.role_id] || 'login.html';
}

// Login initialization
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) {
    console.warn('loginForm not found');
    return;
  }

  console.log('initLogin: binding form handler');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submit intercepted');

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!username || !password) {
      window.api.showMessage('Please fill all fields', 'error');
      return;
    }

    try {
      // Use centralized API function
      const credentials = { username, password };
      const data = await window.api.loginUser(credentials);
      
      console.log('Login response:', data);
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        redirectByRole();
      } else {
        window.api.showMessage(data.detail || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      window.api.showMessage(error.message || 'Login failed', 'error');
    }
  });
}

// Register initialization
function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  
  console.log('initRegister: binding form handler');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const confirmPassword = document.getElementById('confirmPassword')?.value.trim();
    
    if (!username || !password) {
      window.api.showMessage('Please fill all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      window.api.showMessage('Passwords do not match', 'error');
      return;
    }
    
    try {
      await window.api.registerUser({ username, password });
      window.api.showMessage('Registered successfully! Please login.', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    } catch (err) {
      console.error('Register error:', err);
      window.api.showMessage(err.message || 'Registration failed', 'error');
    }
  });
}

// Single DOMContentLoaded - auto detect and init appropriate forms
document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js loaded - initializing forms');
  initLogin();
  initRegister();
});

window.auth = { redirectByRole, initLogin, initRegister };

