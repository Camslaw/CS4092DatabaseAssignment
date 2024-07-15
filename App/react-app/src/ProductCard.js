import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ image, title, price, description, onAddToCart, productid, showAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({ productid, quantity });
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price}</p>
        <p className="product-description">{description}</p>
        {showAddToCart && (
          <>
            <div className="quantity-selector">
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
            <button onClick={handleAddToCart}>Add to Cart</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
