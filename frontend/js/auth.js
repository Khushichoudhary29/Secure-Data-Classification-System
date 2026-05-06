// auth.js - Authentication logic

function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Fix padding
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
}

function redirectByRole() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const payload = decodeJWT(token);

  console.log("Decoded JWT:", payload);
  console.log("Role ID:", payload?.role_id);

  // FIXED: Routes now match role_id mapping: 1=Admin, 2=Manager, 3=Employee, 4=User
  const routes = {
    1: 'admin_dashboard.html',
    2: 'manager_dashboard.html',
    3: 'employee_dashboard.html',
    4: 'user_dashboard.html'
  };

  const target = routes[payload?.role_id] || 'login.html';

  console.log("Redirecting to:", target);

  window.location.href = target;
}

// Login initialization
function initLogin() {
  const form = document.getElementById('loginForm');

  if (!form) {
    console.warn('loginForm not found');
    return;
  }

  console.log('Login form initialized');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!username || !password) {
      window.api.showMessage('Please fill all fields', 'error');
      return;
    }

    try {
      const data = await window.api.loginUser({ username, password });

      console.log('Login response:', data);

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        console.log("Token stored successfully");

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

  console.log('Register form initialized');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const confirmPassword = document.getElementById('confirmPassword')?.value.trim();

    if (!email || !password || !confirmPassword) {
      window.api.showMessage('Please fill all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      window.api.showMessage('Passwords do not match', 'error');
      return;
    }

    try {
      await window.api.registerUser({
        email,
        password
      });

      window.api.showMessage('Registered successfully! Please login.', 'success');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);

    } catch (error) {
      console.error('Register error:', error);
      window.api.showMessage(error.message || 'Registration failed', 'error');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js loaded');

  initLogin();
  initRegister();
});

// Export
window.auth = {
  redirectByRole,
  initLogin,
  initRegister
};
