# 🖼️ PhotoSnap
A secure and scalable image gallery API built with Express.js, MongoDB, Cloudinary, and JWT-based cookie authentication.
Think of it like Unsplash but simplified and exposed through an API-first approach



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