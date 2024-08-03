import React, { useState } from 'react';
import './StaffProductCard.css';

const StaffProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProduct({ ...product });
  };

  const handleSaveClick = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <div className="staff-product-card">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="category"
            value={editedProduct.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="type"
            value={editedProduct.type}
            onChange={handleChange}
            placeholder="Type"
          />
          <input
            type="text"
            name="brand"
            value={editedProduct.brand}
            onChange={handleChange}
            placeholder="Brand"
          />
          <input
            type="text"
            name="size"
            value={editedProduct.size}
            onChange={handleChange}
            placeholder="Size"
          />
          <textarea
            name="description"
            value={editedProduct.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="imageurl"
            value={editedProduct.imageurl}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <>
          <img src={`/images${product.imageurl}`} alt={product.name} className="product-image" />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-type">Type: {product.type}</p>
            <p className="product-brand">Brand: {product.brand}</p>
            <p className="product-size">Size: {product.size}</p>
            <p className="product-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={() => onDelete(product.productid)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffProductCard;
