import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Cart from './Cart';
import CustomerSignIn from './CustomerSignIn';
import Register from './Register';
import Account from './Account';
import Staff from './Staff';
import './App.css';

const App = () => {
  const [customerId, setCustomerId] = useState(null);

  const handleCustomerSignIn = (data) => {
    console.log('Customer sign in successful', data);
    setCustomerId(data.userId);
  };

  const handleSignOut = () => {
    setCustomerId(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home customerId={customerId} />} />
          <Route path="/cart" element={<Cart customerId={customerId} />} />
          <Route path="/signin" element={<CustomerSignIn title="User Sign In" onSignIn={handleCustomerSignIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account customerId={customerId} onSignOut={handleSignOut} />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
