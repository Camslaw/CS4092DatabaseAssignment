import React, { useState } from 'react';
import ProductCard from './ProductCard';
import StaffSignIn from './StaffSignIn';
import './Staff.css';

const Staff = ({ products }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = (staff) => {
    setIsAuthenticated(true);
    console.log('Authenticated staff member:', staff);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="staff-container">
      {isAuthenticated ? (
        <>
          <h1>Staff Dashboard</h1>
          <button onClick={handleSignOut} className="signout-button">Sign Out</button>
          <h2>Product Management</h2>
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.imageurl}
                title={product.title}
                price={product.price}
                description={product.description}
                showAddToCart={false}
              />
            ))}
          </div>
        </>
      ) : (
        <StaffSignIn title="Staff Sign In" onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default Staff;
