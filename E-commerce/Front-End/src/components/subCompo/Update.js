import React, { useState, useEffect } from 'react';

const Update = ({ product, onClose, onUpdateSuccess }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategory(product.category);
    setDescription(product.description);
  }, [product]);

  const updateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    if (price <= 0 || quantity <= 0) {
      setError('Price and quantity must be greater than zero.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/product/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          quantity,
          category,
          description,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product. Please try again.');
      }

      alert(data.message || 'Product updated successfully');
      onUpdateSuccess();
      onClose();
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='UpdateForm'>
      <form onSubmit={updateProduct}>
        <h2>Updating Product</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Name</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Product Name' disabled={loading} required />

        <br />

        <label>Price</label>
        <input type='number' value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} placeholder='Enter Product Price' disabled={loading} required />

        <br />

        <label>Quantity</label>
        <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} placeholder='Enter Product Quantity' disabled={loading} required />

        <br />

        <label>Category</label>
        <input type='text' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Enter Product Category' disabled={loading} required />

        <br />

        <label>Description</label>
        <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter Product Description' disabled={loading} required />

        <br />

        <button type='submit' disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};


export default Update;
