import React, { useState, useEffect } from 'react';
import { getCartItems, removeItemFromCart, addItemToCart } from './api';
import './Cart.css';

const Cart = ({ customerId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems(customerId);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items', error);
      }
    };
    fetchCartItems();
  }, [customerId]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      const removedItem = await removeItemFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.cartitemid !== removedItem.cartitemid));
    } catch (error) {
      console.error('Error removing item from cart', error);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    // Here you should update the quantity in the backend and then refresh the cart items
    // This is a placeholder for demonstration
    console.log(`Updating cart item ${cartItemId} to quantity ${newQuantity}`);
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.cartitemid} className="cart-item">
            <img src={item.imageurl} alt={item.name} className="item-image" />
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-price">${item.price.toFixed(2)}</div>
              <div className="item-quantity">
                <button onClick={() => handleQuantityChange(item.cartitemid, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.cartitemid, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-button" onClick={() => handleRemoveItem(item.cartitemid)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
