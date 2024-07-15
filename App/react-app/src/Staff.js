import React, { useState } from 'react';
import ProductCard from './ProductCard';
import SignInForm from './SignInForm';
import './Staff.css';

const Staff = ({ products, customerId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(customerId !== null);

  const handleSignIn = (data) => {
    setIsAuthenticated(true);
    // Here you should check the credentials, for now we'll just set isAuthenticated to true
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
                showAddToCart={false}
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
