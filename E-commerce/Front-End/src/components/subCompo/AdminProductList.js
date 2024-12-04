import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Spinner, Col, Row, Modal } from 'react-bootstrap';
import Delete from './Delete';
import Update from './Update';
import Search from './Search';
import ProductDetails from './ProductDetails';

function AdminProductList({ url }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('initial');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    let sortedUrl = url;

    if (sortOrder === 'ascending') {
      sortedUrl = 'http://127.0.0.1:8000/api/products/ascending';
    } else if (sortOrder === 'descending') {
      sortedUrl = 'http://127.0.0.1:8000/api/products/descending';
    }

    if (selectedCategory) {
      sortedUrl = `http://127.0.0.1:8000/api/products/category/${selectedCategory}`;
    }

    try {
      const response = await fetch(sortedUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Fetching Failed');
      }

      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Fetching Categories Failed');
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [url, sortOrder, selectedCategory]);

  const handleSearchResults = (searchResults) => {
    setProducts(searchResults);
    setSortOrder('initial');
    setSelectedCategory('');
  };

  const handleDeleteSuccess = (deletedId) => {
    setProducts(products.filter((product) => product.id !== deletedId));
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchProducts(); // Refresh the products after update
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Product List</h1>

      <Search onSearchResults={handleSearchResults} />

      <Form.Group controlId="sortOrder">
        <Form.Label>Sort By Price:</Form.Label>
        <Form.Control as="select" value={sortOrder} onChange={handleSortChange}>
          <option value="initial">Initial Order</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="categoryFilter">
        <Form.Label>Filter By Category:</Form.Label>
        <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.category}>
              {category.category}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ${product.price}
                    <br />
                    <strong>Category:</strong> {product.category}
                    <br />
                    <strong>Description:</strong> {product.description}
                  </Card.Text>
                  <Button variant="info" onClick={() => openDetailsModal(product)}>
                    View Details
                  </Button>
                  <Delete productId={product.id} onDeleteSuccess={handleDeleteSuccess} />
                  <Button variant="warning" onClick={() => { setSelectedProduct(product); setShowUpdateModal(true); }}>
                    Update Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* Modal for updating the product */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Update
              product={selectedProduct}
              onClose={() => setShowUpdateModal(false)}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminProductList;
