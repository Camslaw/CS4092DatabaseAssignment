import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ image, name, category, type, brand, size, description, price, onAddToCart, productid, showAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({ productid, quantity });
  };

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <p className="product-category">Category: {category}</p>
        <p className="product-type">Type: {type}</p>
        <p className="product-brand">Brand: {brand}</p>
        <p className="product-size">Size: {size}</p>
        <p className="product-description">{description}</p>
        <p className="product-price">${price}</p>
        {showAddToCart && (
          <>
            <div className="quantity-container">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
