import React from 'react';
import ProductCard from './ProductCard';
import './Home.css';

const Home = ({ products }) => {
  return (
    <div className="home-container">
      <h1>Welcome to Tech Wave</h1>
      <p>This is the home page.</p>
      <h2>Our Products</h2>
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

export default Home;
