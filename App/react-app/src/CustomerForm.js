import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');

  useEffect(() => {
    console.log('API URL:', process.env.REACT_APP_API_URL); // Log the API URL
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting form with data:', { name, currentBalance }); // Log form data
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/customers`, {
        name,
        currentBalance: parseFloat(currentBalance)
      });
      console.log('Customer added:', response.data); // Log response data
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
