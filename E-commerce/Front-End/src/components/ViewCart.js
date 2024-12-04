import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to view the cart.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetching cart items failed: ${errorText}`);
      }

      const data = await response.json();
      setCartItems(data.cartItems || []); // Assuming the response contains cartItems
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleCheckout = () => {
    // Handle checkout logic here
    alert('Proceeding to checkout...');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ListGroup>
          {cartItems.map((item, index) => (
            <ListGroup.Item key={index}>
              {item.product.name} - Quantity: {item.quantity} - ${item.product.price}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Button variant="primary" onClick={handleCheckout} disabled={cartItems.length === 0}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default ViewCart;
