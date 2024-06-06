import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // SWAP BETWEEN LOCAL HOST AND HEROKU HOSTING (heroku domain) `${process.env.REACT_APP_API_URL}/customers`
      const response = await axios.post('/customers', {
        name,
        currentBalance: parseFloat(currentBalance)
      });
      console.log('Customer added:', response.data);
      // Clear the form fields
      setName('');
      setCurrentBalance('');
    } catch (error) {
      console.error('There was an error adding the customer!', error);
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
