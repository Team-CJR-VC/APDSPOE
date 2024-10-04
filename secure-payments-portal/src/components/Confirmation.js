import React from 'react';
import { Link } from 'react-router-dom';

function Confirmation() {
  return (
    <div className="confirmation">
      <h2>Payment Successful!</h2>
      <p>Your payment has been processed successfully.</p>
      <Link to="/login">Go back to Login</Link>
    </div>
  );
}

export default Confirmation;