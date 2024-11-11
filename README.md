# Secure Customer and Employee International Payments Portal (APDS POE Part 3)
![image](https://github.com/user-attachments/assets/4bfec2aa-72be-4025-9968-88c34194ebc8)
---

## Table of Contents
1. [Group Members](#1-group-members)
2. [Project Overview](#2-project-overview)
3. [Features Implemented](#3-features-implemented)
    3.1. [Password Security](#31-password-security)  
    3.2. [Input Whitelisting](#32-input-whitelisting)  
    3.3. [Securing Data in Transit](#33-securing-data-in-transit)  
    3.4. [Protection Against Attacks](#34-protection-against-attacks)  
    3.5. [Employee Portal - Static Login](#35-employee-portal-static-login)  
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
5. [Changelog](#5-changelog)
6. [Demonstration Video](#6-demonstration-video)
7. [Testing](#6-testing)
8. [Technologies Used](#7-technologies-used)
9. [References](#8-references)
10. [CJR Projects Bio](#9-cjr-projects-bio)
11. [License](#10-license)

---

## 1. Group Members
- **Raven Weeks** – ST10066757
- **Jaime Futter** – ST10067405
- **Chloe’ Stanley** – ST10031988

---

## 2. Project Overview

This project is Part 3 of the **Application Development Security (APDS)** Portfolio of Evidence (POE). It builds on the secure **Customer International Payments Portal** developed in Part 2 by adding a secure **Employee Portal** for managing international payments. The Employee Portal enables authorized employees to securely log in, review transactions, and forward them to SWIFT for processing. The project ensures robust security across both portals by incorporating best practices in password security, input validation, SSL encryption, and protection against common web attacks.

## 3. Features Implemented

### 3.1. Password Security
- **Hashing and Salting**: All passwords for both portals are hashed and salted using **bcrypt** to provide enhanced password security, meeting high industry standards.

### 3.2. Input Whitelisting
- **RegEx Input Validation**: Inputs across the Customer and Employee Portals are validated using **express-validator** to prevent injection attacks by restricting potentially harmful characters.

### 3.3. Securing Data in Transit
- **SSL/TLS Encryption**: Traffic between the client and server is encrypted using SSL certificates, ensuring all data in transit remains secure.
- **HSTS Headers**: The `helmet` middleware is configured with HSTS headers to enforce HTTPS-only connections.

### 3.4. Protection Against Attacks
- **Session Jacking Protection**: Secure cookies are configured with `HttpOnly`, `SameSite`, and `Secure` flags to mitigate session hijacking risks.
- **Clickjacking Protection**: The `helmet` middleware’s `frameguard` feature prevents the portal from being embedded in iframes.
- **SQL Injection Prevention**: The **Mongoose ORM** is used for database interactions, protecting against SQL injection attacks.
- **Cross-Site Scripting (XSS) Protection**: Security headers from the `helmet` middleware help prevent XSS attacks.
- **Man-in-the-Middle (MitM) Attack Prevention**: SSL/TLS encryption ensures secure communication between the client and server.
- **DDoS Protection with Rate Limiting**: **express-rate-limit** middleware is configured to prevent excessive requests, protecting against DDoS attacks.

### 3.5. Employee Portal - Static Login
- **Static Account Configuration**: Only pre-registered employee accounts can access the portal, with no registration option available, ensuring controlled and secure access.
- **Account Management**: Employee accounts are configured securely, and all login attempts are handled with **hashed and salted** passwords to prevent unauthorized access.
- **Secure Access to Transactions**: Employees have access to a secure dashboard for transaction management, enabling review and submission to SWIFT for final processing.

### 3.6. DevSecOps Pipeline
- A **CircleCI DevSecOps pipeline** is set up to automatically run **SonarQube** security scans on every code push, identifying security vulnerabilities, code smells, and hotspots in the codebase. This pipeline ensures the project’s security and quality are maintained continuously.

### 3.7. Video Demonstration
- A demonstration video showcases the working application, key security features, and DevSecOps pipeline implementation, available [here](https://youtu.be/xpqOqq8GEi0).

---

## 4. Installation and Setup

### 4.1. Prerequisites
- **Node.js** and **npm**
- **MongoDB**
- SSL Certificates (for HTTPS)
- **Visual Studio Code (VS Code)** or another code editor

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
Place SSL certificates (`localhost-key.pem`, `localhost.pem`) in the `backend/config` directory to enable HTTPS locally.

### 4.5. Environment Variables
Create a `.env` file in the `backend` folder and add:
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
- **CircleCI** is configured to trigger CI upon each push to the repository. This triggers 
**SonarQube** scans for  security and code quality checks. Click here to view:

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Team-CJR-VC_APDSPOE&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Team-CJR-VC_APDSPOE)
 
![image](https://github.com/user-attachments/assets/0671cacd-8815-4ce1-a293-5323365b3b6f)
![image](https://github.com/user-attachments/assets/99e92412-57da-4fcd-b794-e0532da40f53)

 

---

## 5. Changelog

### Changes from Part 2 to Part 3
1. **Static Employee Login**: Employee accounts are now pre-configured for the Employee Portal with no registration option, ensuring controlled access.
2. **Enhanced DevSecOps Pipeline**: CircleCI is integrated with SonarQube scans on every push to ensure continuous security and code quality.
3. **Expanded Functionality**: The Employee Portal allows employees to view and manage customer transactions securely, with secure access controls.
4. **Additional Security Checks**: All security protections from Part 2, including session protection, input whitelisting, and rate limiting, are implemented and validated across both portals.

---

## 6. Demonstration Video

Click [here](https://www.sonarqube.org/) to view the demonstration video
---
## 7. Testing

1. **Functionality Testing**: ValidateD the login, payment, and transaction management features across both portals.
2. **Security Testing**: EnsureD protections against SQL Injection, Session Hijacking, Clickjacking, and DDoS attacks are functioning correctly.

---

## 8. Technologies Used

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

---

## 9. References

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Helmet Security Headers](https://helmetjs.github.io/)
- [express-rate-limit Documentation](https://www.npmjs.com/package/express-rate-limit)
- [CircleCI Setup](https://circleci.com/docs/)
- [SonarQube Setup](https://www.sonarqube.org/)

---

## 10. CJR Projects Bio

**CJR Projects** is a dedicated team of students focused on creating impactful, secure software solutions. Our expertise spans application security, DevSecOps, and cloud computing. The team, comprised of **Raven Weeks**, **Jaime Futter**, and **Chloe' Stanley**, is committed to maintaining high standards of security, scalability, and performance in all projects, including the **Secure Customer and Employee International Payments Portal**.

---

## 11. License
This project is licensed under the terms of The Independent Institute of Education (IIE).
