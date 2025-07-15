// src/pages/AddProductPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Spinner from '../components/Spinner';

const AddProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState<number | ''>('');

  // NEW STATE VARIABLES FOR REQUIRED FIELDS
  const [category, setCategory] = useState('');
  const [ratingRate, setRatingRate] = useState<number>(0); // Initialize to 0 for new products
  const [ratingCount, setRatingCount] = useState<number>(0); // Initialize to 0 for new products
  const [detailsInput, setDetailsInput] = useState(''); // For comma-separated details

  const [loading, setLoading] = useState(false);

  const { token, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated or not an admin
  const isAdmin = user && user.role === 'admin'; // Ensure casing matches backend/DB

  React.useEffect(() => {
    if (user !== null && (!isAuthenticated || !isAdmin)) {
      showToast('You must be logged in as an administrator to add products.', 'error');
      navigate('/login'); // Or navigate('/')
    }
  }, [isAuthenticated, isAdmin, navigate, showToast, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Frontend Validation ---
    if (!name || !category || !price || stock === '') {
      showToast('Please fill in Name, Category, Price, and Stock.', 'error');
      setLoading(false);
      return;
    }

    if (typeof price !== 'number' || price <= 0) {
      showToast('Price must be a positive number.', 'error');
      setLoading(false);
      return;
    }

    if (typeof stock !== 'number' || stock < 0) {
      showToast('Stock must be a non-negative number.', 'error');
      setLoading(false);
      return;
    }

    if (ratingRate < 0) {
      showToast('Rating Rate must not be negative.', 'error');
      setLoading(false);
      return;
    }

    if (ratingCount < 0 || !Number.isInteger(ratingCount)) {
      showToast('Rating Count must be a non-negative integer.', 'error');
      setLoading(false);
      return;
    }

    // Process details input: split by comma, trim whitespace, filter empty strings
    const detailsArray = detailsInput
      .split(',')
      .map(detail => detail.trim())
      .filter(detail => detail !== '');

    // --- API Call ---
    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send JWT token
        },
        body: JSON.stringify({
          name,
          description: description || undefined,
          price,
          imageUrl: imageUrl || undefined,
          stock,
          category,         // <--- NEW: Include category
          ratingRate,       // <--- NEW: Include ratingRate
          ratingCount,      // <--- NEW: Include ratingCount
          details: detailsArray, // <--- NEW: Include details as an array
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        showToast(`Product "${newProduct.name}" added successfully!`, 'success');
        // Clear form fields
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setStock('');
        setCategory('');      // Clear new fields too
        setRatingRate(0);     // Reset to default
        setRatingCount(0);    // Reset to default
        setDetailsInput('');  // Clear details input
        navigate('/products'); // Redirect to products list after adding
      } else {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message || 'Failed to add product.';
        showToast(`Error: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      console.error('Failed to add product:', error);
      showToast(`Network error: ${error.message || 'Failed to connect to server.'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Spinner size="large" />
        <p className="ml-4 text-lg text-gray-700">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category:
          </label>
          <input
            type="text"
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Price:
          </label>
          <input
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Image URL:
          </label>
          <input
            type="url"
            id="imageUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g., http://example.com/product.jpg"
          />
        </div>

        {/* Stock Quantity */}
        <div className="mb-6">
          <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
            Stock Quantity:
          </label>
          <input
            type="number"
            id="stock"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value) || '')}
            required
            min="0"
          />
        </div>

        {/* Rating Rate */}
        <div className="mb-4">
          <label htmlFor="ratingRate" className="block text-gray-700 text-sm font-bold mb-2">
            Rating (0.0 - 5.0):
          </label>
          <input
            type="number"
            id="ratingRate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ratingRate}
            onChange={(e) => setRatingRate(parseFloat(e.target.value) || 0)} // Default to 0 if empty
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Rating Count */}
        <div className="mb-4">
          <label htmlFor="ratingCount" className="block text-gray-700 text-sm font-bold mb-2">
            Number of Ratings:
          </label>
          <input
            type="number"
            id="ratingCount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ratingCount}
            onChange={(e) => setRatingCount(parseInt(e.target.value) || 0)} // Default to 0 if empty
            min="0"
            step="1"
          />
        </div>

        {/* Details */}
        <div className="mb-6">
          <label htmlFor="details" className="block text-gray-700 text-sm font-bold mb-2">
            Details (comma-separated):
          </label>
          <textarea
            id="details"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={detailsInput}
            onChange={(e) => setDetailsInput(e.target.value)}
            placeholder="e.g., Material: Cotton, Color: Blue, Size: M"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Spinner size="small" color="white" />}
          <span className={loading ? 'ml-2' : ''}>Add Product</span>
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;