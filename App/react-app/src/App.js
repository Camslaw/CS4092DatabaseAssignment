import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Cart from './Cart';
import SignIn from './SignIn';
import Register from './Register';
import Account from './Account';
import Staff from './Staff';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([
    {
      productid: 1,
      imageurl: 'path/to/image1.jpg',
      title: 'Product 1',
      price: 49.99,
      description: 'Product description goes here',
    },
    {
      productid: 2,
      imageurl: 'path/to/image2.jpg',
      title: 'Product 2',
      price: 49.99,
      description: 'Product description goes here',
    },
    // Add more initial products here if needed
  ]);

  const [customerId, setCustomerId] = useState(null); // Initialize customerId to null

  const handleSignIn = (data) => {
    console.log('Sign in successful', data);
    setCustomerId(data.userId); // Update customerId with the signed-in user's ID
  };

  const handleSignOut = () => {
    setCustomerId(null); // Clear the customerId on sign-out
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home products={products} customerId={customerId} />} />
          <Route path="/cart" element={<Cart customerId={customerId} />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account customerId={customerId} onSignOut={handleSignOut} />} />
          <Route path="/staff" element={<Staff products={products} customerId={customerId} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
