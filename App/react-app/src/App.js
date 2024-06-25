import CustomerForm from './CustomerForm';
import Navbar from './Navbar';
import React from 'react';
// import logo from './logo.svg';   example to import an image
import './App.css';
import Carousel from "./carousel"


function App() {
  return (
      <div>
        <Navbar />
        <div className='content'>
          <h1>Add New Customer</h1>
          <CustomerForm />
        </div>

        <div style={{ maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto', magrinTop: 64}}>
          <Carousel>
            <img src={require("./images/products/headphones/beats.webp")} alt="placeholder"/>
            <img src={require("./images/products/Skins/ombre_light_blue.webp")} alt="placeholder"/>
            <img src={require("./images/products/monitors/LG_ultragear.jpg")} alt="placeholder"/>
            <img src={require("./images/products/rests/wrist.webp")} alt="placeholder"/>
          </Carousel>
        </div>

        
      </div>

  );
}





export default App;
