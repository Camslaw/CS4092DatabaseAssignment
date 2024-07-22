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
            name="title"
            value={editedProduct.title}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={editedProduct.description}
            onChange={handleChange}
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <>
          <img src={product.imageurl} alt={product.title} className="product-image" />
          <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
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
