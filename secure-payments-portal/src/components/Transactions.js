import React, { useState, useEffect } from 'react'; 
import './Transactions.css';

function Transactions() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch("https://localhost/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch payments');
        }
      } catch (error) {
        setError('Network error: Failed to fetch payments');
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="transactions-container">
      <h2>Your Transactions</h2>
      {error && <p className="error-message">{error}</p>}
      {payments.length > 0 ? (
        <div className="transactions-list">
          {payments.map((payment) => (
            <div key={payment._id} className="transaction-card">
              <p><strong>Amount:</strong> {payment.amount}</p>
              <p><strong>Currency:</strong> {payment.currency}</p>
              <p><strong>Account Info:</strong> {payment.accountInfo}</p>
              <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
              <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {payment.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default Transactions;
