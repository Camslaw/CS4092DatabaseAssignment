import CustomerForm from './CustomerForm';
import Navbar from './Navbar';
import React from 'react';
// import logo from './logo.svg';   example to import an image
import './App.css';


function App() {
  return (
      <div>
        <Navbar />
        <div className='content'>
          <h1>Add New Customer</h1>
          <CustomerForm />
        </div>
      </div>

  );
}




export default App;
