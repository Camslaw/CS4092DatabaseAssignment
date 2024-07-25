import React, { useState } from 'react';
import './AddProductForm.css';

const AddProductForm = ({ onAddProduct }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    type: '',
    brand: '',
    size: '',
    description: '',
    price: '',
    imageurl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setNewProduct({
      name: '',
      category: '',
      type: '',
      brand: '',
      size: '',
      description: '',
      price: '',
      imageurl: ''
    });
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" required />
      <input type="text" name="type" value={newProduct.type} onChange={handleChange} placeholder="Type" required />
      <input type="text" name="brand" value={newProduct.brand} onChange={handleChange} placeholder="Brand" required />
      <input type="text" name="size" value={newProduct.size} onChange={handleChange} placeholder="Size" />
      <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Description" required />
      <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price" required />
      <input type="text" name="imageurl" value={newProduct.imageurl} onChange={handleChange} placeholder="Image URL" required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
