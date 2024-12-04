import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const Checkout = ({ cartItems }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  useEffect(() => {
    const total = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = () => {
    alert(`Proceeding with ${paymentMethod} payment. Total: $${totalPrice}`);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total Price: ${totalPrice}</p>

      <Form.Group controlId="paymentMethod">
        <Form.Label>Select Payment Method</Form.Label>
        <Form.Control as="select" value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="gcash">Gcash</option>
          <option value="card">Credit Card</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" onClick={handleSubmit}>
        Confirm Order
      </Button>
    </div>
  );
};

export default Checkout;
