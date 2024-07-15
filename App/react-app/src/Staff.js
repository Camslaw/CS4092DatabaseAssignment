import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './Staff.css';
import SignInForm from './SignInForm';

const Staff = ({ products }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  return (
    <div className="staff-container">
      {isAuthenticated ? (
        <>
          <h1>Staff Dashboard</h1>
          <h2>Product Management</h2>
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image_url}
                title={product.title}
                price={product.price}
                description={product.description}
              />
            ))}
          </div>
        </>
      ) : (
        <SignInForm title="Staff Sign In" onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default Staff;
