import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/customers`, {
        name,
        currentBalance: parseFloat(currentBalance)
      });
      setName('');
      setCurrentBalance('');
    } catch (error) {
      console.error('There was an error adding the customer!', error); // Log error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Current Balance:</label>
        <input
          type="number"
          step="0.01"
          value={currentBalance}
          onChange={(e) => setCurrentBalance(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Customer</button>
    </form>
  );
};

export default CustomerForm;
