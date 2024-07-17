import React, { useState, useEffect } from 'react';
import { getCartItems, removeItemFromCart, updateCartItemQuantity, getAddresses, getCreditCards, createOrder, getUserInfo } from './api';
import './Cart.css';

const Cart = ({ customerId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCard, setSelectedCard] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems(customerId);
        const parsedItems = items.map(item => ({
          ...item,
          price: parseFloat(item.price) // Ensure price is a number
        }));
        setCartItems(parsedItems);
      } catch (error) {
        console.error('Error fetching cart items', error);
      }
    };

    const fetchAddressesAndCards = async () => {
      try {
        const [addresses, creditCards, userInfo] = await Promise.all([
          getAddresses(customerId),
          getCreditCards(customerId),
          getUserInfo(customerId) // Fetch user information including preferred address and card
        ]);
        setAddresses(addresses);
        setCreditCards(creditCards);

        // Set default selected address and card to preferred ones
        if (userInfo.preferredshippingaddress) {
          setSelectedAddress(userInfo.preferredshippingaddress);
        } else if (addresses.length > 0) {
          setSelectedAddress(addresses[0].addressid);
        }

        if (userInfo.preferredpaymentmethod) {
          setSelectedCard(userInfo.preferredpaymentmethod);
        } else if (creditCards.length > 0) {
          setSelectedCard(creditCards[0].cardid);
        }
      } catch (error) {
        console.error('Error fetching addresses or credit cards', error);
      }
    };

    fetchCartItems();
    fetchAddressesAndCards();
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
      updatedItem.price = parseFloat(updatedItem.price);
      setCartItems(cartItems.map(item => item.cartitemid === updatedItem.cartitemid ? updatedItem : item));
    } catch (error) {
      console.error('Error updating cart item quantity', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      await createOrder(customerId, selectedAddress, selectedCard, cartItems);
      alert('Order created successfully!');
      setCartItems([]);
    } catch (error) {
      console.error('Error creating order', error);
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
      <div className="checkout-section">
        <h3>Checkout</h3>
        <div>
          <label>
            Select Shipping Address:
            <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
              {addresses.map((address) => (
                <option key={address.addressid} value={address.addressid}>
                  {`${address.streetaddress}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Select Credit Card:
            <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
              {creditCards.map((card) => (
                <option key={card.cardid} value={card.cardid}>
                  {`Card ending in ${card.cardnumber.slice(-4)}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button onClick={handleCreateOrder}>Create Order</button>
      </div>
    </div>
  );
};

export default Cart;
