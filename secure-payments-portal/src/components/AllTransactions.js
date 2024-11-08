import React, { useState, useEffect } from 'react';
import './AllTransactions.css';

function AllTransactions() {
  const [allPayments, setAllPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch("https://localhost/api/admin/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);  // Check the structure here
          setAllPayments(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch payments');
        }
      } catch (error) {
        setError('Network error: Failed to fetch payments');
      }
    };
  
    fetchAllPayments();
  }, []);

  const handleApprove = async (paymentId) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`https://localhost/api/admin/payments/${paymentId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setAllPayments(allPayments.map(payment => payment._id === paymentId ? updatedPayment.payment : payment));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to approve payment');
      }
    } catch (error) {
      setError('Network error: Failed to approve payment');
    }
  };

  const handleDeny = async (paymentId) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`https://localhost/api/admin/payments/${paymentId}/deny`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setAllPayments(allPayments.map(payment => payment._id === paymentId ? updatedPayment.payment : payment));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to deny payment');
      }
    } catch (error) {
      setError('Network error: Failed to deny payment');
    }
  };

  return (
    <div className="all-transactions-container">
      <h2>All User Transactions</h2>
      {error && <p className="error-message">{error}</p>}
      {allPayments.length > 0 ? (
        <ul>
          {allPayments.map((payment) => (
            <li key={payment._id} className="transaction-item">
              <div className="user-info">
                <p><strong>User Full Name:</strong> {payment.userDetails.fullName}</p>
                <p><strong>Account Number:</strong> {payment.userDetails.accountNumber}</p>
              </div>
              <div className="payment-info">
                <p><strong>Amount:</strong> {payment.amount}</p>
                <p><strong>Currency:</strong> {payment.currency}</p>
                <p><strong>Account Info:</strong> {payment.accountInfo}</p>
                <p><strong>SWIFT Code:</strong> {payment.swiftCode}</p>
                <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {payment.status}</p>

                {payment.status === 'pending' && (
                  <div className="action-buttons">
                    <button onClick={() => handleApprove(payment._id)}>Approve</button>
                    <button onClick={() => handleDeny(payment._id)}>Deny</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default AllTransactions;

