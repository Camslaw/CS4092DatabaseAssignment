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

        <div style={{ maxWidth: 1200, marginLeft: 'auto', maarginRight: 'auto', magrinTop: 64}}>
          <Carousel>
            <img src={require("./images/products/headphones/beats.webp")} alt="placeholder"/>
            <img src={require("./images/products/headphones/logi_pink.webp")} alt="placeholder"/>
            <img src={require("./images/products/headphones/sony_blue.webp")} alt="placeholder"/>
          </Carousel>
        </div>

        
      </div>

  );
}





export default App;
