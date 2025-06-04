# 🖼️ PhotoSnap
A secure and scalable image gallery API built with **Express.js**, **MongoDB**, **Cloudinary**, and **JWT-based cookie authentication**.
Think of it like Unsplash but simplified and exposed through an API-first approach

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
[![Deployed](https://img.shields.io/badge/Deployed-Live-green?style=for-the-badge)]( https://photosnap-sl8f.onrender.com/api-docs)

---

## 🧾 Overview
PhotoSnap is a RESTful API that allows users to: 
- Sign up and log in securely
- Upload, view, update, and delete images
- Fetch public images with filters and pagination
- Manage account info and avatar
- Admins can manage users and view stats
     

It's built for developers who want to integrate a simple image hosting and management system into their applications. 

---
## 🔐 Authentication
All sensitive operations require authentication using JWT stored in HTTP-only cookies . 

**Available Routes**:

| Method | Route            | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/sign-up ` | Register a new user |
| POST   | `/auth/sign-in ` | Log in              |
| POST   | `/auth/sign-out` | Log out             | 

- **Once logged in, the JWT cookie will be used automatically for all protected routes**
---

## 🌐 Public Routes
These are accessible without authentication.


| Method | Route                  | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/public/images `      | Get list of all public images        |
| GET    | `/public/images/{id} ` | Get details of a single public image |

Supports:
- Pagination (page, limit)
- Filtering (search)

---

## 🔐 Authenticated User Routes
Available only to signed-in users.


| Method | Route               | Description                               |
|--------|---------------------|-------------------------------------------|
| POST   | `/me/uploads `      | Upload a new image                        |
| GET    | `/me/uploads `      | Get list of user’s uploaded images        |
| PATCH  | `/me/uploads/{id}`  | Update image metadata or replace image    |
| DELETE | `/me/uploads/{id}`  | Delete an image                           |
| GET    | `/me/about-me`      | Get current user info + total uploads     |
| PATCH  | `/me/update-user`   | Update username/email/password            |
| PATCH  | `/me/update-avatar` | Update profile avatar                     |
| DELETE | `/me/delete`        | Delete user account + all associated data |

---

## 👤 Admin Routes (Admin Access Only)  

Available only to admin users.


| Method | Route              | Description                                       |
|--------|--------------------|---------------------------------------------------|
| GET    | `/admin/users`     | List all registered users                         |
| GET    | `/admin/images `   | List all uploaded images                          |
| GET    | `/admin/dashboard` | View dashboard stats (total users, uploads, etc.) |

---

## ⚙️ Features

 -  **JWT Cookie-Based Authentication**
 -  **Image Upload & Management via Cloudinary**
 -  **User Profile Management**
 -  **Avatar Upload & Cleanup**
 -  **Pagination & Filtering Support**
 -  **Security Headers via Helmet**
 -  **CORS Configuration**
 -  **Request Validation with Joi**
 -  **Data Sanitization with DOMPurify**

---

