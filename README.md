# Secure Customer International Payments Portal (POE Part 2)

![image](https://github.com/user-attachments/assets/4bfec2aa-72be-4025-9968-88c34194ebc8)

## Table of Contents
1. [Group Members](#1-group-members)
2. [Project Overview](#2-project-overview)
3. [Features Implemented](#3-features-implemented)
    3.1. [Password Security](#31-password-security)  
    3.2. [Input Whitelisting](#32-input-whitelisting)  
    3.3. [Securing Data in Transit](#33-securing-data-in-transit)  
    3.4. [Protection Against Attacks](#34-protection-against-attacks)  
    3.5. [API Endpoints](#35-api-endpoints)  
    3.6. [DevSecOps Pipeline](#36-devsecops-pipeline)  
    3.7. [Video Demonstration](#37-video-demonstration)  
4. [Installation and Setup](#4-installation-and-setup)
    4.1. [Prerequisites](#41-prerequisites)  
    4.2. [Install Backend Dependencies](#42-install-backend-dependencies)  
    4.3. [Install Frontend Dependencies](#43-install-frontend-dependencies)  
    4.4. [Set Up SSL Certificates](#44-set-up-ssl-certificates)  
    4.5. [Environment Variables](#45-environment-variables)  
    4.6. [Run the Backend Server](#46-run-the-backend-server)  
    4.7. [Run the Frontend](#47-run-the-frontend)  
    4.8. [Running DevSecOps Pipeline](#48-running-devsecops-pipeline)  
5. [Testing](#5-testing)
6. [Technologies Used](#6-technologies-used)
7. [References](#7-references)
8. [CJR Projects](#8-cjr-projects_bio)
9. [License](#9-license)

---

## 1. Group Members
- **Raven Weeks** – ST10066757
- **Jaime Futter** – ST10067405
- **Chloe’ Stanley** – ST10031988

## 2. Project Overview

This project is a continuation of Part 1 of the **Application Development Security** POE (Portfolio of Evidence). The goal is to create a secure **Customer International Payments Portal** and an accompanying API using **React** for the frontend and **Node.js** with **Express** for the backend. This portal allows customers to securely make international payments while protecting sensitive data such as account numbers, payment details, and personal information. The system includes robust security mechanisms such as hashing, salting, SSL encryption, protection against common attacks, and rate limiting.

## 3. Features Implemented

### 3.1. Password Security
- **Hashing and Salting**: All passwords are hashed and salted using **bcrypt** before being stored in the database to ensure secure password management.

### 3.2. Input Whitelisting
- **RegEx Input Validation**: All input fields are validated using **express-validator** to restrict dangerous characters and prevent injection attacks.

### 3.3. Securing Data in Transit
- **SSL/TLS Encryption**: The backend serves traffic over **HTTPS** using a self-signed SSL certificate, ensuring all data in transit is encrypted.
- **HSTS Headers**: The `helmet` middleware is used to enforce **HSTS** headers to ensure browsers only communicate with the server over HTTPS.

### 3.4. Protection Against Attacks
- **Session Jacking Protection**: The application uses **secure cookies** with `HttpOnly`, `SameSite`, and `Secure` flags to prevent session hijacking.
- **Clickjacking Protection**: The application uses the `frameguard` option from the `helmet` middleware to prevent the site from being embedded in iframes.
- **SQL Injection Prevention**: The application uses **Mongoose ORM** for secure database operations, making sure the queries are safe from SQL injection attacks.
- **Cross-Site Scripting (XSS) Protection**: The `helmet` middleware helps prevent XSS attacks by sanitizing inputs and using secure headers.
- **Man-in-the-Middle (MitM) Attack Prevention**: All communication between the client and server is encrypted using **SSL/TLS**.
- **DDoS Protection with Rate Limiting**: The application implements **rate limiting** using the `express-rate-limit` middleware to prevent excessive requests from overwhelming the server.

### 3.5. API Endpoints
- **Registration**: Allows new users to securely register with their account number and password.
- **Login**: Authenticates users, issues a **JWT token**, and sets it in a secure cookie for session management.
- **Payment**: Allows logged-in users to securely submit payment details for processing.
- **Home**: Home: Displays the home page, inclusive of hyperlinks to the other 3 endpoints.

### 3.6. DevSecOps Pipeline
- A **DevSecOps pipeline** using **CircleCI** is configured to run automated security scans with **SonarQube** to check for security vulnerabilities, code smells, and hotspots in the codebase.

### 3.7. Video Demonstration
- A video showing the working application, security features, and DevSecOps pipeline can be viewed [here](https://youtu.be/xpqOqq8GEi0)

## 4. Installation and Setup

### 4.1. Prerequisites
- **Node.js** and **npm**
- **MongoDB** (for database)
- SSL Certificates (for HTTPS)
- **Visual Studio Code (VS Code)** or any other preferred code editor

### 4.2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4.3. Install Frontend Dependencies
```bash
cd ../secure-payments-portal
npm install
```

### 4.4. Set Up SSL Certificates
Ensure you have SSL certificates (`localhost-key.pem`, `localhost.pem`) in the `backend/config` directory for HTTPS to work locally.

### 4.5. Environment Variables
Create a `.env` file in the `backend` folder and add your environment variables like:
```
MONGO_URI=mongodb+srv://ravenstudent86:3g7!b-2kfL4KM-2@cluster0.ri54a9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=8f@#9xw2$8kjE#*3q9Bf$@2iE^#3$kJ4
```

### 4.6. Run the Backend Server
```bash
cd backend
npm start
```

### 4.7. Run the Frontend
```bash
cd ../secure-payments-portal
npm start
```

### 4.8. Running DevSecOps Pipeline
- CircleCI is set up for Continuous Integration (CI). Push code to the repository to trigger the CI pipeline, which includes **SonarQube** scans for security and code quality checks.

## 5. Testing

1. **Functionality Testing**: Test the login, registration, and payment features.
2. **Security Testing**: Test the protection mechanisms against SQL Injection, Session Hijacking, Clickjacking, and DDoS attacks.
3. **Rate Limiting**: Test the rate limiting by sending excessive requests and observing blocked responses.

## 6. Technologies Used

- **Node.js** and **Express.js** (Backend)
- **React.js** (Frontend)
- **MongoDB** (Database)
- **bcrypt** (Password Hashing)
- **jsonwebtoken** (JWT for Authentication)
- **helmet** (Security Headers)
- **express-rate-limit** (Rate Limiting)
- **CircleCI** (DevSecOps Pipeline)
- **SonarQube** (Code Quality and Security Analysis)
- **Visual Studio Code (VS Code)** (Code Editor)

## 7. References

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Helmet Security Headers](https://helmetjs.github.io/)
- [express-rate-limit Documentation](https://www.npmjs.com/package/express-rate-limit)
- [CircleCI Setup](https://circleci.com/docs/)
- [SonarQube Setup](https://www.sonarqube.org/)

## 8. CJR Projects Bio

CJR Projects is a dynamic group of students passionate about software development and security. We focus on creating solutions that not only meet functional requirements but also prioritize security and scalability. Through collaboration, creativity, and cutting-edge technology, we aim to deliver impactful projects like the **Secure Customer International Payments Portal**. Our members, Raven Weeks, Jaime Futter, and Chloe' Stanley, are dedicated to upholding high standards of security and performance in every project we undertake.

## 9. License
This project is licensed under the terms of The Independent Institute of Education (IIE).

---
