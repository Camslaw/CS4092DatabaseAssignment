import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Cart from './Cart';
import SignIn from './SignIn';
import Register from './Register';
import Staff from './Staff';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([
    {
      image_url: 'path/to/image1.jpg',
      title: 'Product 1',
      price: 49.99,
      description: 'Product description goes here',
    },
    {
      image_url: 'path/to/image2.jpg',
      title: 'Product 2',
      price: 49.99,
      description: 'Product description goes here',
    },
    // Add more initial products here if needed
  ]);

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Sign in successful');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff" element={<Staff products={products} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
