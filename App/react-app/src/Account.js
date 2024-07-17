import React, { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo, signOut, addAddress, addCreditCard, getAddresses, getCreditCards } from './api';
import './Account.css';
import { Navigate } from 'react-router-dom';

const Account = ({ customerId, onSignOut }) => {
  const [userInfo, setUserInfo] = useState({});
  const [preferredShippingAddress, setPreferredShippingAddress] = useState('');
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState({
    addressType: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [creditCard, setCreditCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentAddressId: ''
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo(customerId);
        setUserInfo(info);
        setPreferredShippingAddress(info.preferredshippingaddress || '');
        setPreferredPaymentMethod(info.preferredpaymentmethod || '');
      } catch (error) {
        console.error('Error fetching user information', error);
      }
    };
    
    const fetchAddresses = async () => {
      try {
        const fetchedAddresses = await getAddresses(customerId);
        setAddresses(fetchedAddresses);
      } catch (error) {
        console.error('Error fetching addresses', error);
      }
    };

    const fetchCreditCards = async () => {
      try {
        const fetchedCreditCards = await getCreditCards(customerId);
        setCreditCards(fetchedCreditCards);
      } catch (error) {
        console.error('Error fetching credit cards', error);
      }
    };

    fetchUserInfo();
    fetchAddresses();
    fetchCreditCards();
  }, [customerId]);

  const handleUpdate = async () => {
    try {
      const updatedInfo = await updateUserInfo(customerId, preferredShippingAddress, preferredPaymentMethod);
      setUserInfo(updatedInfo);
      setMessage('Information updated successfully');
    } catch (error) {
      console.error('Error updating user information', error);
      setMessage('Failed to update information');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCreditCardChange = (e) => {
    setCreditCard({ ...creditCard, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress(customerId, address);
      alert('Address added successfully!');
      setAddress({
        addressType: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      const fetchedAddresses = await getAddresses(customerId);
      setAddresses(fetchedAddresses);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const handleCreditCardSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCreditCard(customerId, creditCard);
      alert('Credit card added successfully!');
      setCreditCard({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        paymentAddressId: ''
      });
      const fetchedCreditCards = await getCreditCards(customerId);
      setCreditCards(fetchedCreditCards);
    } catch (err) {
      console.error('Failed to add credit card:', err);
    }
  };

  if (!customerId) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="account-container">
      <h2>Account Information</h2>
      <div className="account-info">
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
      </div>
      <div className="account-update">
        <label>
          Preferred Shipping Address:
          <select value={preferredShippingAddress} onChange={(e) => setPreferredShippingAddress(e.target.value)}>
            {addresses.map((address) => (
              <option key={address.addressid} value={address.streetaddress}>
                {`${address.addressType}, ${address.streetaddress}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Preferred Payment Method:
          <select value={preferredPaymentMethod} onChange={(e) => setPreferredPaymentMethod(e.target.value)}>
            {creditCards.map((card) => (
              <option key={card.cardid} value={card.cardnumber}>
                {`Card ending in ${card.cardnumber.slice(-4)}, Expires ${card.expirydate}`}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleUpdate}>Update Information</button>
        {message && <p>{message}</p>}
      </div>
      <h2>Add Address</h2>
      <form onSubmit={handleAddressSubmit} className="account-form">
        <input type="text" name="addressType" value={address.addressType} onChange={handleAddressChange} placeholder="Address Type" required />
        <input type="text" name="streetAddress" value={address.streetAddress} onChange={handleAddressChange} placeholder="Street Address" required />
        <input type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="City" required />
        <input type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="State" required />
        <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="Zip Code" required />
        <input type="text" name="country" value={address.country} onChange={handleAddressChange} placeholder="Country" required />
        <button type="submit">Add Address</button>
      </form>
      <h2>Add Credit Card</h2>
      <form onSubmit={handleCreditCardSubmit} className="account-form">
        <input type="text" name="cardNumber" value={creditCard.cardNumber} onChange={handleCreditCardChange} placeholder="Card Number" required />
        <input type="text" name="expiryDate" value={creditCard.expiryDate} onChange={handleCreditCardChange} placeholder="Expiry Date" required />
        <input type="text" name="cvv" value={creditCard.cvv} onChange={handleCreditCardChange} placeholder="CVV" required />
        <input type="text" name="paymentAddressId" value={creditCard.paymentAddressId} onChange={handleCreditCardChange} placeholder="Payment Address ID" required />
        <button type="submit">Add Credit Card</button>
      </form>
      <button onClick={handleSignOut} className="signout-button">Sign Out</button>
    </div>
  );
};

export default Account;
