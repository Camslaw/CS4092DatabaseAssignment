import React, { useState, useEffect } from 'react';
import StaffProductCard from './StaffProductCard';
import StaffSignIn from './StaffSignIn';
import WarehouseStockManager from './WarehouseStockManager';
import AddProductForm from './AddProductForm';
import { deleteProduct } from './api';
import './Staff.css';

const Staff = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const handleSignIn = (staff) => {
    setIsAuthenticated(true);
    console.log('Authenticated staff member:', staff);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/warehouses');
        const data = await response.json();
        setWarehouses(data);
      } catch (err) {
        console.error('Error fetching warehouses:', err);
      }
    };

    fetchProducts();
    fetchWarehouses();
  }, []);

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, data]);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${updatedProduct.productid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productid === data.productid ? data : product
        )
      );
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log(`Deleting product with id: ${productId}`);
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productid !== productId)
      );
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleAddToWarehouse = async (warehouseId, productId, quantity) => {
    try {
      const response = await fetch(`http://localhost:3001/api/warehouses/${warehouseId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      console.log('Product added to warehouse:', data);
    } catch (err) {
      console.error('Error adding product to warehouse:', err);
    }
  };

  return (
    <div className="staff-container">
      {isAuthenticated ? (
        <>
          <h1>Staff Dashboard</h1>
          <button onClick={handleSignOut} className="signout-button">Sign Out</button>
          <AddProductForm onAddProduct={handleAddProduct} />
          <h2>Product Management</h2>
          <div className="product-grid">
            {products.map((product, index) => (
              <StaffProductCard
                key={index}
                product={product}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
          <h2>Warehouse Management</h2>
          <div className="warehouse-grid">
            {products.map((product, index) => (
              <WarehouseStockManager
                key={index}
                product={product}
                warehouses={warehouses}
                onAddToWarehouse={handleAddToWarehouse}
              />
            ))}
          </div>
        </>
      ) : (
        <StaffSignIn title="Staff Sign In" onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default Staff;
