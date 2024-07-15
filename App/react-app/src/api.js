import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Update the URL to point to your backend

export const getCartItems = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items', error);
    throw error;
  }
};

export const addItemToCart = async (customerId, productId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      customerId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart', error);
    throw error;
  }
};

export const removeItemFromCart = async (cartItemId) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/remove`, {
      data: { cartItemId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart', error);
    throw error;
  }
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
