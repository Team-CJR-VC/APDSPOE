import React, { useState } from 'react';

function AdminCreateAccount() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default role is 'User'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { fullName, idNumber, accountNumber, password, role };

    try {
      const response = await fetch(`https://localhost/api/admin/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage('Account created successfully!');
        setErrorMessage('');
        // Clear the form
        setFullName('');
        setIdNumber('');
        setAccountNumber('');
        setPassword('');
        setRole('User');
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
      <h2>Create Account</h2>
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
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="User">User</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default AdminCreateAccount;