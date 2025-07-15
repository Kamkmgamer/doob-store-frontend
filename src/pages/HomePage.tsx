// D:\projects\projects\doob-store\my-ecommerce-app\src\pages\HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
// import shopData from '../data/shop-data'; // REMOVE THIS LINE
import { Fade, Slide } from 'react-awesome-reveal';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

import type { Product } from '../data/shop-data'; // Keep Product type for consistency

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user, token } = useAuth();

  const API_BASE_URL = 'http://localhost:3000'; // Your backend API base URL

  // --- Fetch Products from Backend ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
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

  const featuredProducts = products.slice(0, 8); // Or implement logic to mark products as featured in backend

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
        body: JSON.stringify({ productId: productToAdd.id, quantity: 1 }),
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
    <div className="home-page">
      {/* Hero Section */}
      <Slide direction="down" triggerOnce>
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 mb-12 rounded-lg shadow-xl">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
              Welcome to MyShop!
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-200">
              Discover amazing products at unbeatable prices.
            </p>
            <Link
              to="/products"
              // Corrected className with backticks
              className={`bg-white text-blue-800 px-8 py-3 rounded-full text-lg font-bold shadow-lg
                          hover:bg-blue-100 hover:scale-105 transition-all duration-300 ease-in-out
                          animate-bounce-in`}
            >
              Shop Now!
            </Link>
          </div>
        </section>
      </Slide>

      {/* Featured Products Section */}
      <section className="mb-12">
        <Fade direction="up" triggerOnce>
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Featured Products</h2>
        </Fade>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <Fade cascade damping={0.1} triggerOnce>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
            ))}
          </Fade>
        </div>
        <div className="text-center mt-10">
          <Link
            to="/products"
            // Corrected className with backticks
            className={`inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold
                        hover:bg-gray-300 hover:scale-[1.02] active:bg-gray-400 active:scale-[0.98]
                        transition-all duration-300 ease-in-out`}
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* About Us/Call to Action Section */}
      <section className="bg-gray-100 py-16 px-4 rounded-lg shadow-md">
        <Fade direction="up" triggerOnce delay={200}>
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quality Products, Great Prices</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
              We hand-pick the best products to ensure satisfaction. Shop with confidence!
            </p>
            <Link
              to="/about"
              // Corrected className with backticks
              className={`bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg
                          hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out`}
            >
              Learn More About Us
            </Link>
          </div>
        </Fade>
      </section>
    </div>
  );
};

export default HomePage;