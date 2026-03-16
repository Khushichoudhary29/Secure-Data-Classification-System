# Secure Data Classification System

## Overview

The Secure Data Classification System is a backend-focused security project designed to manage sensitive documents with proper authentication, role-based access control, and encryption. The system allows different user roles to securely interact with classified data.

This project is being developed as a B.Tech semester project.

---

## Current Implementation (Phase 1: Authentication System)

The following features are currently implemented:

### User Authentication

* User Registration
* User Login
* Password hashing using bcrypt
* JWT Token generation after login

### Role-Based Access Control

The system supports multiple user roles:

* **Admin**
* **Manager**
* **Employee**

Each role has restricted access to specific dashboards and APIs.

### Dashboards

Basic frontend dashboards are created using HTML, CSS, and JavaScript:

* Admin Dashboard
* Manager Dashboard
* Employee Dashboard

These dashboards display authentication status and stored JWT tokens.

---

## Backend Technologies

* Python
* FastAPI
* SQLite Database
* JWT Authentication
* bcrypt password hashing

---

## Project Structure

backend/

* app/

  * routes/
  * models/
  * schemas/
  * services/
  * utils/
  * core/
  * main.py

frontend/

* login.html
* register.html
* admin_dashboard.html
* manager_dashboard.html
* employee_dashboard.html
* script.js
* style.css

---

## Current API Endpoints

### Authentication

POST /auth/register
Registers a new user.

POST /auth/login
Authenticates a user and returns a JWT token.

### Dashboards

GET /admin/dashboard
Accessible only by Admin users.

GET /manager/dashboard
Accessible only by Manager users.

GET /employee/dashboard
Accessible only by Employee users.

---

## Next Development Phase

The next phase will implement the core functionality of the system:

* Secure File Upload
* Data Classification Levels
* AES File Encryption
* Role-based File Access
* File Management APIs

---

## Future Features

* Document upload system
* File classification (Public / Confidential / Secret)
* Encrypted file storage
* Admin management panel
* Activity logs and monitoring

