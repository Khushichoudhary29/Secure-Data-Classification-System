# Secure Data Classification and Labelling System using Role-Based Access Control (RBAC)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.7-brightgreen)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-secure_data.db-lightblue)](https://www.sqlite.org/)

## Table of Contents
- [Problem Statement](#problem-statement)
- [Objective](#objective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation Steps](#installation-steps)
- [Running Steps](#running-steps)
- [API Routes](#api-routes)
- [Workflow](#workflow)
- [Future Scope](#future-scope)
- [Project Information](#project-information)

## Problem Statement
In modern organizations, sensitive data such as financial records, employee information, and classified documents must be protected from unauthorized access. Traditional file systems lack granular permission controls, leading to data breaches, compliance violations (e.g., GDPR, HIPAA), and insider threats.

**Key Challenges:**
- **Unauthorized Access:** Employees accessing data beyond their role privileges.
- **Data Classification Gaps:** No systematic labeling of files as confidential/public.
- **Scalability Issues:** Manual permission management doesn't scale for growing teams.
- **Audit & Traceability:** Lack of role-based dashboards and activity logs.

This project addresses these with **RBAC (Role-Based Access Control)**, ensuring users (Admin, Manager, Employee, User) access files only via role-specific permissions, secure JWT authentication, and encrypted storage.

## Objective
The primary goal is to build a **secure, scalable data classification and labeling system** with:
- Robust JWT-based authentication and RBAC authorization.
- Role-specific dashboards for streamlined access (Admin: manage users/roles; Manager: oversee employees; Employee/User: file operations).
- Secure file upload/download with server-side encryption.
- Intuitive frontend with responsive glassmorphism dark UI.
- Production-ready FastAPI backend with SQLAlchemy ORM and SQLite.

**Key Goals:**
- Prevent unauthorized file access through role guards.
- Enable admin role management and analytics.
- Support file classification services for future ML integration.
- Ensure zero-downtime development with auto-reload.

## Features
- 🔐 **JWT Authentication** with bcrypt password hashing.
- 🛡️ **Role-Based Authorization** (Admin, Manager, Employee, User).
- 📊 **Role-Specific Dashboards:**
  - Admin: User/role management, delete/update users.
  - Manager: Employee oversight and updates.
  - Employee: Personal dashboard and profile.
  - User: Profile and secure file access.
- 📁 **Secure File Management:** Encrypted upload/download (`.enc` files).
- ⚙️ **Admin Panel:** Create admins, list users/roles, role updates.
- 📈 **Dashboard Analytics** with charts.js.
- 🎨 **Responsive Frontend:** Glassmorphism dark theme, mobile-friendly.
- 🔍 **Interactive Swagger UI** for API testing (`/docs`).
- 🛠 **CORS Enabled** for frontend-backend integration.
- 🔒 **File Encryption** via cryptography service.

## Tech Stack

### Backend
- **Framework:** FastAPI 0.128.7
- **Language:** Python 3.10+
- **ORM/Database:** SQLAlchemy 2.0.46 / SQLite (`secure_data.db`)
- **Auth:** JWT (python-jose), bcrypt 4.0.1
- **Server:** Uvicorn 0.40.0
- **Security:** Cryptography 46.0.5, RBAC middleware
- **Other:** Pydantic, Annotated-types

### Frontend
- **Markup:** HTML5
- **Styles:** CSS3 (glassmorphism dark UI: `main.css`, `dashboard.css`)
- **Scripts:** Vanilla JavaScript (ES6+)
- **Libraries:** Charts.js for analytics

## Folder Structure
```
Secure-Data-Classification-System/
├── README.md                    # Project documentation
├── requirements.txt             # Backend dependencies
├── TODO.md                      # Development tasks
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── core/                # Core utilities
│   │   │   ├── auth.py
│   │   │   ├── database.py      # SQLite config
│   │   │   ├── rbac.py          # Role guards
│   │   │   └── security.py
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── role.py
│   │   │   └── file_model.py
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth_routes.py
│   │   │   ├── admin_routes.py
│   │   │   ├── manager_routes.py
│   │   │   ├── employee_routes.py
│   │   │   ├── user_routes.py
│   │   │   ├── file_routes.py
│   │   │   └── test_routes.py
│   │   ├── schemas/             # Pydantic models
│   │   │   ├── user_schema.py
│   │   │   ├── role_schema.py
│   │   │   ├── admin_schema.py
│   │   │   ├── manager_schema.py
│   │   │   └── user_update_schema.py
│   │   ├── services/            # Business logic
│   │   │   ├── user_service.py
│   │   │   ├── file_service.py
│   │   │   ├── encryption_service.py
│   │   │   └── classification_service.py
│   │   └── utils/
│   │       └── jwt_handler.py
│   ├── uploads/                 # Encrypted files (*.enc)
│   └── requirements.txt
├── frontend/                    # Static frontend
│   ├── pages/                   # HTML pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── admin_dashboard.html
│   │   ├── manager_dashboard.html
│   │   ├── employee_dashboard.html
│   │   └── user_dashboard.html
│   ├── css/                     # Stylesheets
│   │   ├── main.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── components.css
│   ├── js/                      # Scripts
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── manager.js
│   │   ├── employee.js
│   │   ├── user.js
│   │   ├── charts.js
│   │   └── common.js
│   └── assets/
│       └── icons/
│           └── file.svg
└── docs/                        # Reports/docs
```

## Installation Steps
1. **Clone the Repository:**
   ```bash
   git clone <your-repo-url>
   cd Secure-Data-Classification-System
   ```

2. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate Virtual Environment:**
   - **Windows:** `venv\Scripts\activate`
   - **macOS/Linux:** `source venv/bin/activate`

4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify Installation:**
   Database (`secure_data.db`) auto-creates on first run.

## Running Steps

### Backend (FastAPI)
From project root:
```bash
cd backend
uvicorn app.main:app --reload
```

**Swagger UI:** http://127.0.0.1:8000/docs  
**Root Endpoint:** http://127.0.0.1:8000/

### Frontend
1. Install VS Code **Live Server** extension.
2. Right-click `frontend/pages/login.html` → **Open with Live Server**.


## API Routes
| Method | Endpoint                  | Description                  | Role Access       | Tags   |
|--------|---------------------------|------------------------------|-------------------|--------|
| POST   | `/auth/register`          | User registration            | Public            | Auth   |
| POST   | `/auth/login`             | JWT token login              | Public            | Auth   |
| GET    | `/users/me`               | Get current user profile     | Authenticated     | Users  |
| GET    | `/admin/users`            | List all users               | Admin             | Admin  |
| PUT    | `/admin/update-role/{id}` | Update user role             | Admin             | Admin  |
| GET    | `/admin/roles`            | List all roles               | Admin             | Admin  |
| GET    | `/manager/employees`      | List employees               | Manager/Admin     | Manager|
| GET    | `/employee/dashboard`     | Employee dashboard           | Employee          | Employee|
| POST   | `/files/upload`           | Upload & encrypt file        | Authenticated     | Files  |
| GET    | `/files/download/{id}`    | Download decrypted file      | Role-based        | Files  |

**Auth Headers:** `Authorization: Bearer <token>`

## Workflow
```
User Login → JWT Token Generated
        ↓
Frontend stores token
        ↓
Role-based dashboard loaded
        ↓
User performs actions:
  - Upload file
  - Download file
  - Admin manages users
        ↓
Backend verifies:
  JWT → Role → Permission
  
```

## Future Scope
- ☁️ **Cloud Deployment:** Docker + AWS/Heroku, PostgreSQL migration.
- 🔐 **Advanced Encryption:** AES-256 + key rotation.
- 📋 **Activity Logs & Audit Trails:** Track all file accesses.
- 📊 **Analytics Dashboard:** ML-based classification insights.
- 🤖 **AI Classification:** Integrate scikit-learn for auto-labeling.
- 🛡️ **2FA & OAuth:** Google/Microsoft login integration.
- 📱 **Mobile App:** React Native/PWA version.

## Project Information

**Developed By:** Khushi Choudhary, Kashish Yadav  
**Course:** B.Tech CSE – 2nd Year  
**Project Type:** Academic Project  
**University:** COER University  
**Session:** 2025–26
---

## Final Note
- This project focuses on security, RBAC, and backend architecture.
- Frontend demo is included for visual presentation purposes.