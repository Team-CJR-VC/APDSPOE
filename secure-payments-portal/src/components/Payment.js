import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        // Redirect to login if not authenticated
        navigate('/auth/login');
      }
    }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would normally send the payment data to the backend
    const paymentData = {
      amount,
      currency,
      accountInfo,
      swiftCode,
    };

    console.log('Submitting Payment', paymentData);
    // Simulate payment success
    navigate('/confirmation');
  };

  return (
    <div className="payment">
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Currency:</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Account Info:</label>
          <input
            type="text"
            value={accountInfo}
            onChange={(e) => setAccountInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>SWIFT Code:</label>
          <input
            type="text"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
}

export default Payment;