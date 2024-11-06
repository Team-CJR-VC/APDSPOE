import React, { useState } from 'react';

function EmployeeCreateAccount() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { fullName, idNumber, accountNumber, password, role: 'user' };
    console.log(data);
    try {
      const token = localStorage.getItem('jwt'); // Get token from localStorage
      //const role = localStorage.getItem('role'); //Get the role from localStorage
      console.log(token);
      const response = await fetch(`https://localhost/api/employee/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Set the Authorization header
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage('User account created successfully!');
        setErrorMessage('');
        // Clear the form
        setFullName('');
        setIdNumber('');
        setAccountNumber('');
        setPassword('');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'An error occurred. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('A network error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="create-account-container">
      <h2>Create User Account</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default EmployeeCreateAccount;
