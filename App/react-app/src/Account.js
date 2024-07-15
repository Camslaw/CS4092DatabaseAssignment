import React from 'react';
import { Navigate } from 'react-router-dom';
import { signOut } from './api'; // Import the signOut function

const Account = ({ customerId, onSignOut }) => {
  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut(); // Call the onSignOut function to update the state
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  if (!customerId) {
    return <Navigate to="/signin" />;
  }

  return (
    <div>
      <h1>Account Details</h1>
      <p>Welcome, user with ID: {customerId}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Account;
