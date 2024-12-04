import React, { useState, useEffect } from 'react';
import AddToCart from './AddToCart';
import ProductDetails from './ProductDetails';
import { Button, Form, Table, Spinner } from 'react-bootstrap';

function UserProductList({ url }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('initial');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
        const errorText = await response.text();
        throw new Error(`Fetching Failed: ${errorText}`);
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
        const errorText = await response.text();
        throw new Error(`Fetching Categories Failed: ${errorText}`);
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

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Product List</h1>

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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>
                  <Button variant="info" onClick={() => openDetailsModal(product)}>
                    View Details
                  </Button>
                  <AddToCart product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default UserProductList;
  