import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Base URL for your backend

export const getCartItems = async (customerId) => {
  const response = await fetch(`${API_URL}/api/cart/${customerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart items');
  }
  return await response.json();
};

export const removeItemFromCart = async (cartItemId) => {
  const response = await fetch(`${API_URL}/api/cart/remove/${cartItemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from cart');
  }
  return await response.json();
};

export const addItemToCart = async (customerId, productId, quantity) => {
  const response = await fetch(`${API_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId, productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }
  return await response.json();
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await fetch(`${API_URL}/api/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cartItemId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Failed to update cart item quantity');
  }
  return await response.json();
};

export const signOut = async () => {
  try {
    const response = await axios.post(`${API_URL}/signout`);
    return response.data;
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

export const getUserInfo = async (customerId) => {
  const response = await fetch(`${API_URL}/api/user/${customerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }
  return await response.json();
};

export const updateUserInfo = async (customerId, preferredShippingAddress, preferredPaymentMethod) => {
  const response = await fetch(`${API_URL}/api/user/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ preferredShippingAddress, preferredPaymentMethod }),
  });
  if (!response.ok) {
    throw new Error('Failed to update user information');
  }
  return await response.json();
};

export const addAddress = async (customerId, address) => {
  const response = await axios.post(`${API_URL}/api/account/address`, { customerId, ...address });
  return response.data;
};

export const addCreditCard = async (customerId, creditCard) => {
  const response = await axios.post(`${API_URL}/api/account/credit-card`, { customerId, ...creditCard });
  return response.data;
};

export const getAddresses = async (customerId) => {
  const response = await axios.get(`${API_URL}/api/account/addresses/${customerId}`);
  return response.data;
};

export const getCreditCards = async (customerId) => {
  const response = await axios.get(`${API_URL}/api/account/credit-cards/${customerId}`);
  return response.data;
};
