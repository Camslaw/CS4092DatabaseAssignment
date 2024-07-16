import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffSignIn.css';

const StaffSignIn = ({ title, onSignIn }) => {
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/staff/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, staffId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sign in successful. Redirecting to the staff dashboard...');
        onSignIn(data);
        setTimeout(() => {
          navigate('/staff');
        }, 2000); // Redirect after 2 seconds
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="staffId">Staff ID</label>
          <input
            type="text"
            id="staffId"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default StaffSignIn;
