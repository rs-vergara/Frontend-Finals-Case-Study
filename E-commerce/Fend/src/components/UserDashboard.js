import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import UserProductList from './subCompo/UserProductList';
import CartIcon from './subCompo/CartIcon';

const UserDashboard = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/products');
  const navigate = useNavigate(); // Use useNavigate hook

  const InitialOrder = () => setUrl('http://127.0.0.1:8000/api/products');
  const PriceOrderAsc = () => setUrl('http://127.0.0.1:8000/api/products/ascending');
  const PriceOrderDesc = () => setUrl('http://127.0.0.1:8000/api/products/descending');

  const handleLogout = async () => {
      try {
          // Perform the logout request
          await fetch('http://127.0.0.1:8000/api/logout', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
          });

          // Clear the token
          localStorage.removeItem('token');

          // Redirect to login page after successful logout
          navigate('/login'); // Use navigate to redirect
      } catch (error) {
          console.error('Logout failed', error);
      }
  };

  return (
    <>
      <br />
      <h1>User Dashboard</h1>
      <p>Welcome, User!</p>

      {/* Add the CartIcon component here */}
      <CartIcon />

      <div>
        <button onClick={InitialOrder}>Initial Order</button>
        <button onClick={PriceOrderAsc}>Ascending By Price</button>
        <button onClick={PriceOrderDesc}>Descending By Price</button>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>

      <div>
        <UserProductList url={url} />
      </div>
    </>
  );
};

export default UserDashboard;
