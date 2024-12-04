import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProductList from './subCompo/AdminProductList';
import Create from './subCompo/Create'; // Import Create Component
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';

const AdminDashboard = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/products');
    const [showCreate, setShowCreate] = useState(false); // State for Modal visibility
    const navigate = useNavigate();

    const InitialOrder = () => setUrl('http://127.0.0.1:8000/api/products');
    const PriceOrderAsc = () => setUrl('http://127.0.0.1:8000/api/products/ascending');
    const PriceOrderDesc = () => setUrl('http://127.0.0.1:8000/api/products/descending');

    const handleLogout = async () => {
        try {
            // Perform logout request
            await fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Clear token and redirect
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleClose = () => setShowCreate(false);
    const handleShow = () => setShowCreate(true);

    return (
        <Container>
            <br />
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            
            <Row>
                <Col>
                    <Button variant="primary" onClick={InitialOrder}>Initial Order</Button>
                    <Button variant="secondary" onClick={PriceOrderAsc}>Ascending By Price</Button>
                    <Button variant="success" onClick={PriceOrderDesc}>Descending By Price</Button>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    <Button variant="info" onClick={handleShow}>Add Product</Button>
                </Col>
            </Row>

            {/* Modal for adding product */}
            <Modal show={showCreate} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Create onClose={handleClose} />
                </Modal.Body>
            </Modal>

            <div>
                <AdminProductList url={url} />
            </div>
        </Container>
    );
};

export default AdminDashboard;
