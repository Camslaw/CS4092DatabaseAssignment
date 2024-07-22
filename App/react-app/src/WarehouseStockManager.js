import React, { useState, useEffect } from 'react';
import './WarehouseStockManager.css';

const WarehouseStockManager = ({ product, warehouses, onAddToWarehouse }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToWarehouse = () => {
    onAddToWarehouse(selectedWarehouse, product.productid, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="warehouse-stock-manager">
      <h3>{product.title}</h3>
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
