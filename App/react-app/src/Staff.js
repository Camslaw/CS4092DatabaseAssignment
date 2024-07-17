import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import StaffSignIn from './StaffSignIn';
import './Staff.css';

const Staff = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);

  const handleSignIn = (staff) => {
    setIsAuthenticated(true);
    console.log('Authenticated staff member:', staff);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

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
