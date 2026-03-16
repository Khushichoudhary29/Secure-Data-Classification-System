// Backend URL
const API_URL = 'http://127.0.0.1:8000';

// Function to decode JWT token
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Function to redirect based on role
function redirectByRole(role) {
    switch (role) {
        case 'Admin':
            window.location.href = 'admin_dashboard.html';
            break;
        case 'Manager':
            window.location.href = 'manager_dashboard.html';
            break;
        case 'Employee':
            window.location.href = 'employee_dashboard.html';
            break;
        default:
            // Default to employee dashboard if role is unknown
            window.location.href = 'employee_dashboard.html';
    }
}

// Check if user is on login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Save access_token in localStorage
                localStorage.setItem('access_token', data.access_token);
                
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Login successful! Redirecting...';
                
                // Decode token and redirect based on role
                setTimeout(() => {
                    const tokenData = decodeJWT(data.access_token);
                    if (tokenData && tokenData.role) {
                        redirectByRole(tokenData.role);
                    } else {
                        // Default to employee dashboard if role not found
                        window.location.href = 'employee_dashboard.html';
                    }
                }, 1000);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.detail || 'Login failed. Please check your credentials.';
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Error connecting to server. Please try again.';
            console.error('Login error:', error);
        }
    });
}

// Check if user is on register page
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageDiv = document.getElementById('message');
        
        // Check if passwords match
        if (password !== confirmPassword) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Passwords do not match.';
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Registration successful! Please login.';
                
                // Clear form
                registerForm.reset();
                
                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.detail || 'Registration failed. Please try again.';
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Error connecting to server. Please try again.';
            console.error('Registration error:', error);
        }
    });
}

// Check if user is on dashboard page
if (document.getElementById('tokenDisplay')) {
    const tokenDisplay = document.getElementById('tokenDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Display stored token
    const token = localStorage.getItem('access_token');
    if (token) {
        tokenDisplay.textContent = token;
    } else {
        tokenDisplay.textContent = 'No token found. Please login.';
    }
    
    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = 'login.html';
    });
}

