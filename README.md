# Secure Customer International Payments Portal (POE Part 2)
![image](https://github.com/user-attachments/assets/4bfec2aa-72be-4025-9968-88c34194ebc8)

## Group Members:
- **Raven Weeks** – ST10066757
- **Jaime Futter** – ST10067405
- **Chloe’ Stanley** – ST10031988

## Project Overview

This project is a continuation of Part 1 of the **Application Development Security** POE (Portfolio of Evidence). The goal is to create a secure **Customer International Payments Portal** and an accompanying API using **React** for the frontend and **Node.js** with **Express** for the backend. This portal allows customers to securely make international payments while protecting sensitive data such as account numbers, payment details, and personal information. The system includes robust security mechanisms such as hashing, salting, SSL encryption, protection against common attacks, and rate limiting.

## Features Implemented

### 1. **Password Security**
- **Hashing and Salting**: All passwords are hashed and salted using **bcrypt** before being stored in the database to ensure secure password management.

### 2. **Input Whitelisting**
- **RegEx Input Validation**: All input fields are validated using **express-validator** to restrict dangerous characters and prevent injection attacks.

### 3. **Securing Data in Transit**
- **SSL/TLS Encryption**: The backend serves traffic over **HTTPS** using a self-signed SSL certificate, ensuring all data in transit is encrypted.
- **HSTS Headers**: The `helmet` middleware is used to enforce **HSTS** headers to ensure browsers only communicate with the server over HTTPS.

### 4. **Protection Against Attacks**
- **Session Jacking Protection**: The application uses **secure cookies** with `HttpOnly`, `SameSite`, and `Secure` flags to prevent session hijacking.
- **Clickjacking Protection**: The application uses the `frameguard` option from the `helmet` middleware to prevent the site from being embedded in iframes.
- **SQL Injection Prevention**: The application uses **Mongoose ORM** for secure database operations, making sure the queries are safe from SQL injection attacks.
- **Cross-Site Scripting (XSS) Protection**: The `helmet` middleware helps prevent XSS attacks by sanitizing inputs and using secure headers.
- **Man-in-the-Middle (MitM) Attack Prevention**: All communication between the client and server is encrypted using **SSL/TLS**.
- **DDoS Protection with Rate Limiting**: The application implements **rate limiting** using the `express-rate-limit` middleware to prevent excessive requests from overwhelming the server.

### 5. **API Endpoints**
- **Registration**: Allows new users to securely register with their account number and password.
- **Login**: Authenticates users, issues a **JWT token**, and sets it in a secure cookie for session management.
- **Payment**: Allows logged-in users to securely submit payment details for processing.
- **Confirmation**: Displays the confirmation message after a successful transaction.

### 6. **DevSecOps Pipeline**
- A **DevSecOps pipeline** using **CircleCI** is configured to run automated security scans with **SonarQube** to check for security vulnerabilities, code smells, and hotspots in the codebase.

### 7. **Video Demonstration**
- A video showing the working application, security features, and DevSecOps pipeline has been included as part of the submission.

## Installation and Setup

### Prerequisites
- **Node.js** and **npm**
- **MongoDB** (for database)
- SSL Certificates (for HTTPS)
- **Visual Studio Code (VS Code)** or any other preferred code editor

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../secure-payments-portal
npm install
```

### 3. Set Up SSL Certificates
Ensure you have SSL certificates (`localhost-key.pem`, `localhost.pem`) in the `backend/config` directory for HTTPS to work locally.

### 4. Environment Variables
Create a `.env` file in the `backend` folder and add your environment variables like:
```
MONGO_URI=mongodb+srv://ravenstudent86:3g7!b-2kfL4KM-2@cluster0.ri54a9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=8f@#9xw2$8kjE#*3q9Bf$@2iE^#3$kJ4
```

### 5. Run the Backend Server
```bash
cd backend
npm start
```

### 6. Run the Frontend
```bash
cd ../secure-payments-portal
npm start
```

### 7. Access the Application
- Frontend: Open [http://localhost:3000](http://localhost:3000)
- Backend: Ensure the backend is running on **https://localhost:443** (or any configured port)

### 8. Running DevSecOps Pipeline
- CircleCI is set up for Continuous Integration (CI). Push code to the repository to trigger the CI pipeline, which includes **SonarQube** scans for security and code quality checks.

## Testing

1. **Functionality Testing**: Test the login, registration, and payment features.
2. **Security Testing**: Test the protection mechanisms against SQL Injection, Session Hijacking, Clickjacking, and DDoS attacks.
3. **Rate Limiting**: Test the rate limiting by sending excessive requests and observing blocked responses.

## Technologies Used

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

## References

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Helmet Security Headers](https://helmetjs.github.io/)
- [express-rate-limit Documentation](https://www.npmjs.com/package/express-rate-limit)
- [CircleCI Setup](https://circleci.com/docs/)
- [SonarQube Setup](https://www.sonarqube.org/)

## CJR Projects

CJR Projects is a dynamic group of students passionate about software development and security. We focus on creating solutions that not only meet functional requirements but also prioritize security and scalability. Through collaboration, creativity, and cutting-edge technology, we aim to deliver impactful projects like the **Secure Customer International Payments Portal**. Our members, Raven Weeks, Jaime Futter, and Chloe' Stanley, are dedicated to upholding high standards of security and performance in every project we undertake.

## License
This project is licensed under the terms of The Independent Institute of Education (IIE).
