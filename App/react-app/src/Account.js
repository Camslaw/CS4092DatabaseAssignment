import React, { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo, signOut, addAddress, addCreditCard, getAddresses, getCreditCards, deleteAddress, deleteCreditCard, payBalance, updateAddress, updateCreditCard } from './api';
import './Account.css';
import { Navigate } from 'react-router-dom';

const Account = ({ customerId, onSignOut }) => {
  const [userInfo, setUserInfo] = useState({});
  const [preferredShippingAddress, setPreferredShippingAddress] = useState('');
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState('');
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
  const [addresses, setAddresses] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [payAmount, setPayAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');

  const [editAddress, setEditAddress] = useState(null);
  const [editCreditCard, setEditCreditCard] = useState(null);

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

    const fetchAddressesAndCards = async () => {
      try {
        const [addresses, creditCards] = await Promise.all([
          getAddresses(customerId),
          getCreditCards(customerId)
        ]);
        setAddresses(addresses);
        setCreditCards(creditCards);
      } catch (error) {
        console.error('Error fetching addresses or credit cards', error);
      }
    };

    fetchUserInfo();
    fetchAddressesAndCards();
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

  const handleEditAddressChange = (e) => {
    setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
  };

  const handleEditCreditCardChange = (e) => {
    setEditCreditCard({ ...editCreditCard, [e.target.name]: e.target.value });
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
      const updatedAddresses = await getAddresses(customerId);
      setAddresses(updatedAddresses);
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
      const updatedCreditCards = await getCreditCards(customerId);
      setCreditCards(updatedCreditCards);
    } catch (err) {
      console.error('Failed to add credit card:', err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await deleteAddress(addressId);
      setAddresses(addresses.filter(address => address.addressid !== addressId));
      setCreditCards(creditCards.filter(card => card.paymentaddressid !== addressId));
      alert('Address and associated credit card deleted successfully!');
    } catch (err) {
      console.error('Failed to delete address and associated credit card:', err);
    }
  };
  

  const handleDeleteCreditCard = async (cardId) => {
    try {
      await deleteCreditCard(cardId);
      setCreditCards(creditCards.filter(card => card.cardid !== cardId));
    } catch (err) {
      console.error('Failed to delete credit card:', err);
    }
  };

  const handlePayBalance = async (e) => {
    e.preventDefault();
    if (!payAmount || !selectedCard) {
      alert('Please enter the amount and select a credit card.');
      return;
    }

    try {
      await payBalance(customerId, payAmount, selectedCard);
      alert('Payment successful!');
      setPayAmount('');
      setSelectedCard('');
      const info = await getUserInfo(customerId);
      setUserInfo(info);
    } catch (error) {
      console.error('Failed to pay balance:', error);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAddress(editAddress.addressid, editAddress);
      alert('Address updated successfully!');
      setEditAddress(null);
      const updatedAddresses = await getAddresses(customerId);
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  const handleCreditCardUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCreditCard(editCreditCard.cardid, editCreditCard);
      alert('Credit card updated successfully!');
      setEditCreditCard(null);
      const updatedCreditCards = await getCreditCards(customerId);
      setCreditCards(updatedCreditCards);
    } catch (err) {
      console.error('Failed to update credit card:', err);
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
        <p><strong>Balance:</strong> ${userInfo.balance ? userInfo.balance.toFixed(2) : '0.00'}</p>
      </div>
      <div className="account-update">
        <label>
          Preferred Shipping Address:
          <input
            type="text"
            value={preferredShippingAddress}
            onChange={(e) => setPreferredShippingAddress(e.target.value)}
          />
        </label>
        <label>
          Preferred Payment Method:
          <input
            type="text"
            value={preferredPaymentMethod}
            onChange={(e) => setPreferredPaymentMethod(e.target.value)}
          />
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
      <h3>Saved Addresses</h3>
      <ul>
        {addresses.map(address => (
          <li key={address.addressid}>
            {editAddress && editAddress.addressid === address.addressid ? (
              <form onSubmit={handleAddressUpdate} className="account-form">
                <input type="text" name="addressType" value={editAddress.addressType} onChange={handleEditAddressChange} placeholder="Address Type" required />
                <input type="text" name="streetAddress" value={editAddress.streetAddress} onChange={handleEditAddressChange} placeholder="Street Address" required />
                <input type="text" name="city" value={editAddress.city} onChange={handleEditAddressChange} placeholder="City" required />
                <input type="text" name="state" value={editAddress.state} onChange={handleEditAddressChange} placeholder="State" required />
                <input type="text" name="zipCode" value={editAddress.zipCode} onChange={handleEditAddressChange} placeholder="Zip Code" required />
                <input type="text" name="country" value={editAddress.country} onChange={handleEditAddressChange} placeholder="Country" required />
                <button type="submit">Update Address</button>
              </form>
            ) : (
              <>
                {`${address.streetaddress}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`}
                <button onClick={() => setEditAddress(address)}>Edit</button>
                <button onClick={() => handleDeleteAddress(address.addressid)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2>Add Credit Card</h2>
      <form onSubmit={handleCreditCardSubmit} className="account-form">
        <input type="text" name="cardNumber" value={creditCard.cardNumber} onChange={handleCreditCardChange} placeholder="Card Number" required />
        <input type="text" name="expiryDate" value={creditCard.expiryDate} onChange={handleCreditCardChange} placeholder="Expiry Date" required />
        <input type="text" name="cvv" value={creditCard.cvv} onChange={handleCreditCardChange} placeholder="CVV" required />
        <label>
          Payment Address:
          <select name="paymentAddressId" value={creditCard.paymentAddressId} onChange={handleCreditCardChange} required>
            <option value="">Select an address</option>
            {addresses.map(address => (
              <option key={address.addressid} value={address.addressid}>
                {`${address.streetaddress}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Credit Card</button>
      </form>
      <h3>Saved Credit Cards</h3>
      <ul>
        {creditCards.map(card => (
          <li key={card.cardid}>
            {editCreditCard && editCreditCard.cardid === card.cardid ? (
              <form onSubmit={handleCreditCardUpdate} className="account-form">
                <input type="text" name="cardNumber" value={editCreditCard.cardNumber} onChange={handleEditCreditCardChange} placeholder="Card Number" required />
                <input type="text" name="expiryDate" value={editCreditCard.expiryDate} onChange={handleEditCreditCardChange} placeholder="Expiry Date" required />
                <input type="text" name="cvv" value={editCreditCard.cvv} onChange={handleEditCreditCardChange} placeholder="CVV" required />
                <label>
                  Payment Address:
                  <select name="paymentAddressId" value={editCreditCard.paymentAddressId} onChange={handleEditCreditCardChange} required>
                    <option value="">Select an address</option>
                    {addresses.map(address => (
                      <option key={address.addressid} value={address.addressid}>
                        {`${address.streetaddress}, ${address.city}, ${address.state} ${address.zipcode}, ${address.country}`}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit">Update Credit Card</button>
              </form>
            ) : (
              <>
                {`Card ending in ${card.cardnumber.slice(-4)}`}
                <button onClick={() => setEditCreditCard(card)}>Edit</button>
                <button onClick={() => handleDeleteCreditCard(card.cardid)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="pay-balance">
        <h3>Pay Balance</h3>
        <form onSubmit={handlePayBalance}>
          <div>
            <label>
              Amount to Pay:
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
            </label>
            <label>
              Select Credit Card:
              <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                <option value="">Select a card</option>
                {creditCards.map(card => (
                  <option key={card.cardid} value={card.cardid}>
                    {`Card ending in ${card.cardnumber.slice(-4)}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit">Pay</button>
        </form>
      </div>
      <button onClick={handleSignOut} className="signout-button">Sign Out</button>
    </div>
  );
};

export default Account;
