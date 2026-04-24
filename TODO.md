# Secure Data Classification System - Frontend Fix TODO

## Task: Fix frontend-to-backend login connection

### Step 1: [DONE] Analyze files and create detailed plan ✓
### Step 2: [DONE] Create TODO.md to track progress ✓
### Step 3: [DONE] Edit frontend/js/auth.js 
   - Define initLogin(): bind login form to window.api.loginUser()
   - Define initRegister(): bind register form to window.api.registerUser()
   - Single DOMContentLoaded calling inits
   - Use redirectByRole() with proper role mapping
   - Remove duplicate handlers/broken calls ✓
### Step 4: [DONE] Update TODO.md with completion status ✓
### Step 5: [PENDING] Test login flow: no console errors, POST /auth/login, role redirect

**Status:** Frontend auth.js fixed. Test by opening `frontend/pages/login.html` in browser/Live Server.

**Expected results:**
* No `loginUser`/`showMessage` redeclaration errors
* Form shows POST `http://127.0.0.1:8000/auth/login` in Network tab
* No credentials in URL
* Token in localStorage
* Redirect to correct role dashboard
