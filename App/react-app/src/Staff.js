import React from 'react';
import ProductCard from './ProductCard';
import './Staff.css';

const Staff = ({ products }) => {
  return (
    <div className="staff-container">
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
    </div>
  );
};

export default Staff;
