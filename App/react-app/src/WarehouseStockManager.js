import React, { useState } from 'react';
import './WarehouseStockManager.css';

const WarehouseStockManager = ({ product, warehouses, onAddToWarehouse }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddToWarehouse = async () => {
    if (!selectedWarehouse) {
      setErrorMessage('Please select a warehouse.');
      return;
    }

    try {
      await onAddToWarehouse(selectedWarehouse, product.productid, quantity);
      setQuantity(1); // Reset quantity after adding
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      const message = error.response?.data?.details || error.response?.data?.error || error.message || 'An unknown error occurred';
      setErrorMessage(message);
    }
  };

  return (
    <div className="warehouse-stock-manager">
      <h3>{product.title}</h3>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <label htmlFor="warehouse">Warehouse:</label>
      <select
        id="warehouse"
        value={selectedWarehouse}
        onChange={(e) => setSelectedWarehouse(e.target.value)}
      >
        <option value="">Select a warehouse</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.warehouseid} value={warehouse.warehouseid}>
            {warehouse.address}
          </option>
        ))}
      </select>
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />
      <button onClick={handleAddToWarehouse}>Add to Warehouse</button>
    </div>
  );
};

export default WarehouseStockManager;
