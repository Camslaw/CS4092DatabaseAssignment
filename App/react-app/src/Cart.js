import React, { useState, useEffect } from 'react';
import { getCartItems, removeItemFromCart, addItemToCart, updateCartItemQuantity } from './api';
import './Cart.css';

const Cart = ({ customerId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems(customerId);
        // Ensure price is a number
        const parsedItems = items.map(item => ({
          ...item,
          price: parseFloat(item.price) // Ensure price is a number
        }));
        setCartItems(parsedItems);
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
    try {
      const updatedItem = await updateCartItemQuantity(cartItemId, newQuantity);
      // Ensure the updated item has price as a number
      updatedItem.price = parseFloat(updatedItem.price);
      setCartItems(cartItems.map(item => item.cartitemid === updatedItem.cartitemid ? updatedItem : item));
    } catch (error) {
      console.error('Error updating cart item quantity', error);
    }
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
