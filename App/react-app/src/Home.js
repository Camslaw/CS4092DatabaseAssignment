import React from 'react';
import ProductCard from './ProductCard';
import { addItemToCart } from './api';
import './Home.css';

const Home = ({ products, customerId }) => {
  const handleAddToCart = async (product) => {
    try {
      await addItemToCart(customerId, product.productid, product.quantity);
      // Optionally update cart state if needed
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to Tech Wave</h1>
      <p>This is the home page.</p>
      <h2>Our Products</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            image={product.imageurl}
            title={product.title}
            price={product.price}
            description={product.description}
            onAddToCart={handleAddToCart}
            showAddToCart={true}
            productid={product.productid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
