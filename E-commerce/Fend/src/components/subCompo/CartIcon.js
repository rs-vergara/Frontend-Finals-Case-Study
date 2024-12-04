import React, { useState } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import ViewCart from '../ViewCart'; // Import the ViewCart component

const CartIcon = () => {
  const [showCart, setShowCart] = useState(false); // State to control modal visibility

  // Get the number of items in the cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle modal open/close
  const handleShow = () => setShowCart(true);
  const handleClose = () => setShowCart(false);

  return (
    <>
      {/* Cart Icon with Item Count Badge */}
      <Button variant="light" onClick={handleShow} style={{ position: 'relative' }}>
        <FaShoppingCart size={30} />
        {itemCount > 0 && (
          <Badge pill bg="danger" style={{ position: 'absolute', top: 0, right: 0 }}>
            {itemCount}
          </Badge>
        )}
      </Button>

      {/* View Cart Modal */}
      <Modal show={showCart} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ViewCart />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartIcon;
