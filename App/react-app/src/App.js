import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './Navbar';
import Home from "./Home";
import Cart from "./Cart";
import SignIn from "./SignIn";
import Register from "./Register";
import Staff from "./Staff";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
