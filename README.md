# Secure Data Classification and Labelling System using Role-Based Access Control (RBAC)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.7-brightgreen)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-secure_data.db-lightblue)](https://www.sqlite.org/)

A secure, modern document storage platform utilizing FastAPI for the backend and a premium glassmorphic frontend interface. It enforces dynamic data classification (Public, Internal, Confidential, Restricted) and Role-Based Access Control (RBAC) to ensure strict data clearance checks.

---

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

---

## Problem Statement
In modern organizations, sensitive records—like financial statements, personal employee files, and restricted project specifications—must be shielded from unauthorized eyes. Standard file systems lack simple, automated classification and role-clearance guards, exposing organizations to insider threats, access leakage, and regulatory compliance issues.

This project implements a robust **Role-Based Access Control (RBAC)** grid combined with **AES-256 server-side encryption** and **auto-classification** to securely filter document access by organizational roles.

---

## Objective
The primary goal is to build a secure, user-friendly document system containing:
* **Clearance Level Hierarchy**:
  - `Admin`: View/Download Public, Internal, Confidential, Restricted documents.
  - `Manager`: View/Download Public, Internal, Confidential documents.
  - `Employee`: View/Download Public, Internal documents.
  - `User`: View/Download Public documents only.
* **Auto-Classification**: Scans file contents on upload to assign classification levels automatically.
* **Server-Side AES Encryption**: Automatically encrypts documents during upload before storing them on disk, decrypting them dynamically on download.
* **Responsive Visual Dashboards**: Custom charts, metrics, audit logs, and user setting management tools.

---

## Features
* 🔐 **Secure JWT Session Management**: Built with role claims encoded directly in tokens and direct `bcrypt` password hashing.
* 🛡️ **Cleansed Security Core**: Removed legacy, conflicting authentication scripts to maintain a single source of truth.
* 📊 **Chart.js Analytics**: Admin and staff panels feature interactive charts detailing database metrics and role distributions.
* 📁 **Envelope Cryptography**: Real server-side AES encryption on document uploads.
* ⬆️ **Drag-and-Drop Uploader**: Modern drag-and-drop web component for file uploads.
* 🎨 **Vibrant Glassmorphic Dark UI**: Modern Outfit/Inter fonts, ambient glowing backgrounds, and smooth spring animations.

---

## Tech Stack

### Backend
* **Framework**: FastAPI (Python)
* **ORM & DB**: SQLAlchemy with SQLite (`secure_data.db`)
* **Security & Auth**: PyJWT, cryptography (AES-256), and raw `bcrypt` password salting.
* **Server**: Uvicorn

### Frontend
* **Markup & Logic**: HTML5 / Vanilla JavaScript (ES6)
* **Styles**: Vanilla CSS3 (Glassmorphism layout: `main.css`, `dashboard.css`, `components.css`)
* **Icons**: FontAwesome 6
* **Data Visualization**: Chart.js

---

## Folder Structure
```
Secure-Data-Classification-System/
├── README.md                    # Project documentation
├── requirements.txt             # Backend dependencies
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint & CORS rules
│   │   ├── core/                # Core auth, db configuration, and RBAC guards
│   │   │   ├── auth.py
│   │   │   ├── database.py
│   │   │   ├── rbac.py
│   │   │   └── security.py      # Direct bcrypt hashing helpers
│   │   ├── models/              # Database models
│   │   │   ├── user.py
│   │   │   ├── role.py
│   │   │   └── file_model.py
│   │   ├── routes/              # API router files
│   │   │   ├── auth_routes.py
│   │   │   ├── admin_routes.py  # User manager, Stats router
│   │   │   ├── manager_routes.py
│   │   │   ├── employee_routes.py
│   │   │   ├── user_routes.py
│   │   │   └── file_routes.py   # Upload & download router
│   │   ├── schemas/             # Pydantic data schemas
│   │   │   ├── user_schema.py
│   │   │   ├── role_schema.py
│   │   │   ├── admin_schema.py
│   │   │   └── manager_schema.py
│   │   └── services/            # Cryptography & Classification services
│   │       ├── user_service.py
│   │       ├── file_service.py
│   │       ├── encryption_service.py
│   │       └── classification_service.py
│   └── uploads/                 # Storage for encrypted files (*.enc) [Git Ignored]
└── frontend/                    # Web frontend files
    ├── pages/                   # HTML layout pages
    │   ├── login.html
    │   ├── register.html
    │   ├── admin_dashboard.html
    │   ├── manager_dashboard.html
    │   ├── employee_dashboard.html
    │   └── user_dashboard.html
    ├── css/                     # Styling system files
    │   ├── main.css
    │   ├── auth.css
    │   ├── dashboard.css
    │   └── components.css
    └── js/                      # Page scripts
        ├── api.js               # Dynamic API client
        ├── auth.js
        ├── admin.js
        ├── manager.js
        ├── employee.js
        ├── user.js
        └── common.js            # Card grid renderer
```

---

## Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Khushichoudhary29/Secure-Data-Classification-System.git
   cd Secure-Data-Classification-System
   ```

2. **Set up Python Virtual Environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Core Requirements:**
   ```bash
   pip install -r requirements.txt
   ```

---

## Running Steps

### 1. Launch Backend Server
From the `./backend` directory, run:
```bash
python -m uvicorn app.main:app --reload
```
* **Swagger UI (Interactive Docs)**: http://127.0.0.1:8000/docs
* **API URL**: http://127.0.0.1:8000/

### 2. Launch Frontend Web Server
From the `./frontend` directory, start Python's built-in HTTP server:
```bash
python -m http.server 3000
```
Open your web browser to: **[http://127.0.0.1:3000/pages/login.html](http://127.0.0.1:3000/pages/login.html)**

* **Admin login credentials (pre-seeded)**: `admin@gmail.com` / `admin123`
* **Additional Accounts**: Register new accounts dynamically from the sign-up page.

---

## API Routes

| Method | Endpoint | Description | Role Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and obtain access token | Public |
| GET | `/users/me` | Fetch active profile data | Authenticated |
| PUT | `/users/me` | Edit profile name | Authenticated |
| GET | `/admin/stats` | Retrieve aggregated dashboard counts | Admin |
| GET | `/admin/users` | List all users with role mappings | Admin |
| PUT | `/admin/update-role/{id}` | Edit user's clearance role | Admin |
| POST | `/admin/create-admin` | Admin can spawn new admin accounts | Admin |
| POST | `/files/upload` | Upload file (AES Encrypt + Auto Classify) | Authenticated |
| GET | `/files` | List all files authorized for current role | Role clearance |
| GET | `/files/download/{id}` | Download decrypted copy of document | Role clearance |

---

## Future Scope
* 🤖 **AI-Based Semantic Classification**: Integrate a spaCy/scikit-learn NLP model to classify files semantically rather than basic keyword lookups.
* 🔑 **Key Management Service (KMS)**: Protect Master Keys using Envelope Encryption with AWS KMS or HashiCorp Vault.
* ⛓️ **Log Immutability**: Link audit log entries chronologically using SHA-256 hashes to construct a tamper-evident audit ledger.