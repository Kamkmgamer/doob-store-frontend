// D:\projects\projects\doob-store\my-ecommerce-app\src\pages\ProductsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
// import shopData from '../data/shop-data'; // REMOVE THIS LINE
import { Fade } from 'react-awesome-reveal';
import { useToast } from '../contexts/ToastContext'; // Import useToast
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

import type { Product } from '../data/shop-data'; // Keep Product type for consistency

// No longer needs props from App.tsx
// interface ProductsPageProps {
//   addToCart: (product: Product) => void;
// }

const ProductsPage: React.FC = () => { // Removed ProductsPageProps
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user, token } = useAuth(); // Get user and token for adding to cart

  const API_BASE_URL = 'http://localhost:3000'; // Your backend API base URL

  // --- Fetch Products from Backend ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`); // Fetch all products
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
      showToast(`Error loading products: ${err.message}`, 'error');
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Add to Cart Function (now makes API call) ---
  const handleAddToCart = async (productToAdd: Product) => {
    if (!user || !token) {
      showToast('Please log in to add items to your cart.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: productToAdd.id, quantity: 1 }), // Always add 1 for initial click
      });

      if (!response.ok) {
        if (response.status === 409) { // Assuming 409 Conflict for item already in cart
            showToast(`${productToAdd.name} is already in your cart.`, 'info');
        } else {
            throw new Error(`Failed to add to cart: ${response.statusText}`);
        }
      } else {
        showToast(`${productToAdd.name} added to cart!`, 'success');
      }
    } catch (err: any) {
      showToast(`Error adding to cart: ${err.message}`, 'error');
      console.error("Failed to add to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-700">
        <p className="text-xl">Loading products...</p>
        {/* Add a spinner component here if you have one */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600">
        <p className="text-xl">Error: {error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Fade direction="down" triggerOnce>
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Products</h1>
      </Fade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <Fade cascade damping={0.1} triggerOnce>
          {products.map((product) => ( // Use fetched products
            // Corrected: Moved the comment onto its own line
            <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
            // Pass the new handleAddToCart
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default ProductsPage;