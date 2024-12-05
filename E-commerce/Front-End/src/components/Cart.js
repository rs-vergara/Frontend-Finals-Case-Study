import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false); // To track loading state

    // Fetch cart items when the component mounts
    useEffect(() => {
        setLoading(true); // Start loading when making the request
        axios.get('http://127.0.0.1:8000/api/cart')
            .then(response => {
                setCartItems(response.data.cartItems);
                setTotalPrice(response.data.totalPrice);
                setLoading(false); // Stop loading once data is fetched
            })
            .catch(error => {
                setLoading(false); // Stop loading on error
                if (error.response) {
                    // If there's a response from the server
                    setErrorMessage(`Error: ${error.response.data.message || 'Something went wrong'}`);
                } else if (error.request) {
                    // If no response from server
                    setErrorMessage('Network error: No response from the server.');
                } else {
                    // Any other error
                    setErrorMessage(`Error: ${error.message}`);
                }
                console.error('Error fetching cart data:', error);
            });
    }, []);

    const removeItem = (id) => {
        setLoading(true); // Start loading while removing item
        axios.delete(`http://127.0.0.1:8000/api/cart/${id}`)
            .then(response => {
                setCartItems(cartItems.filter(item => item.id !== id));
                setTotalPrice(totalPrice - cartItems.find(item => item.id === id).price);
                setLoading(false); // Stop loading after item removal
            })
            .catch(error => {
                setLoading(false); // Stop loading on error
                if (error.response) {
                    setErrorMessage(`Error: ${error.response.data.message || 'Failed to remove item'}`);
                } else {
                    setErrorMessage('Network error: Failed to remove item.');
                }
                console.error('Error removing item:', error);
            });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) {
            alert('Please enter a valid quantity.');
            return;
        }

        setLoading(true); // Start loading while updating quantity
        axios.put(`http://127.0.0.1:8000/api/cart/${id}`, { quantity })
            .then(response => {
                const updatedCartItems = cartItems.map(item => {
                    if (item.id === id) {
                        item.quantity = quantity;
                    }
                    return item;
                });
                setCartItems(updatedCartItems);
                setTotalPrice(updatedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0));
                setLoading(false); // Stop loading after update
            })
            .catch(error => {
                setLoading(false); // Stop loading on error
                if (error.response) {
                    setErrorMessage(`Error: ${error.response.data.message || 'Failed to update quantity'}`);
                } else {
                    setErrorMessage('Network error: Failed to update quantity.');
                }
                console.error('Error updating quantity:', error);
            });
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {loading && <p>Loading...</p>} {/* Loading message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <p>{item.product_name} - ${item.price}</p>
                            <p>Quantity: 
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                />
                            </p>
                            <p>Total: ${item.price * item.quantity}</p>
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total Price: ₱{totalPrice}</h3>
        </div>
    );
};

export default Cart;

