// D:\projects\projects\doob-store\my-ecommerce-app\src\pages\ProductDetailPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import shopData from '../data/shop-data'; // REMOVE THIS LINE IF YOU HAVE IT
import { Fade } from 'react-awesome-reveal';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../api';
import type { Product } from '../data/shop-data'; // Keep Product type

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const navigate = useNavigate(); // For navigation if product not found
  const { showToast } = useToast();
  const { user, token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // State for quantity to add


  // --- Fetch Single Product from Backend ---
  const fetchProduct = useCallback(async () => {
    if (!id) {
      setError('Product ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found.');
          showToast('Product not found!', 'error');
          // Optionally redirect to a 404 page or product list
          // navigate('/products');
        } else {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
      }
      const data: Product = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message);
      showToast(`Error loading product: ${err.message}`, 'error');
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }, [id, showToast]); // id is a dependency

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // --- Handle Quantity Change ---
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Allow NaN or 0 temporarily to enable typing, but clamp to 1 for add to cart logic
    if (!isNaN(value)) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0); // Allow empty input temporarily
    }
  };

  // --- Add to Cart Function (now makes API call with chosen quantity) ---
  const handleAddToCart = async () => {
    if (!user || !token) {
      showToast('Please log in to add items to your cart.', 'error');
      return;
    }
    if (!product) return; // Should not happen if product is loaded

    if (quantity < 1 || quantity > product.stock) { // Ensure quantity is valid and within stock
      showToast(`Please enter a quantity between 1 and ${product.stock}.`, 'error');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: quantity }),
      });

      if (!response.ok) {
        if (response.status === 409) {
            showToast(`${product.name} is already in your cart (quantity updated).`, 'info');
        } else {
            throw new Error(`Failed to add/update cart: ${response.statusText}`);
        }
      } else {
        showToast(`${quantity}x ${product.name} added to cart!`, 'success');
      }
    } catch (err: any) {
      showToast(`Error adding to cart: ${err.message}`, 'error');
      console.error("Failed to add to cart:", err);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-700">
        <p className="text-xl">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600">
        <p className="text-xl">Error: {error}</p>
        <button
          onClick={() => navigate('/products')} // Go back to products list
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-700">
        <p className="text-xl">Product not found.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Ensure product.price is a number before calling toFixed
  const displayPrice = Number(product.price).toFixed(2);
  const isOutOfStock = product.stock <= 0; // Derive stock status

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Fade direction="down" triggerOnce>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
          <div className="md:w-1/2 p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain rounded-md"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-gray-700 text-lg mb-6">{product.description}</p>
              <div className="text-3xl font-bold text-blue-600 mb-6">${displayPrice}</div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="text-lg font-semibold text-gray-700">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock > 0 ? product.stock : 1} // Max quantity is stock, or 1 if out of stock
                className="w-20 p-2 border border-gray-300 rounded-md text-center text-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={isOutOfStock} // Disable input if out of stock
              />
              {isOutOfStock && <span className="text-red-500 text-sm">Out of Stock</span>}
              {!isOutOfStock && product.stock <= 5 && product.stock > 0 && ( // Low stock warning
                <span className="text-orange-500 text-sm">Only {product.stock} left!</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full bg-blue-600 text-white py-3 rounded-md text-xl font-semibold
                         hover:bg-blue-700 transition-colors duration-200 ease-in-out
                         ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isOutOfStock} // Use isOutOfStock for disabled state
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'} {/* Use isOutOfStock for button text */}
            </button>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ProductDetailPage;