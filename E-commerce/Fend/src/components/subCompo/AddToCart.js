import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function AddToCart({ productId }) {
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async () => {
    const token = localStorage.getItem('token'); // Assuming the user is logged in and has a token

    if (!token) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Adding to cart failed: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        setIsAdded(true); // Mark item as added
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Button variant="info" onClick={addToCart}>
        {isAdded ? 'Added to Cart' : 'Add to Cart'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AddToCart;
