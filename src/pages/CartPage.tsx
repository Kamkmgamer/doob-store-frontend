// D:\projects\projects\doob-store\my-ecommerce-app\src\pages\CartPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Spinner from '../components/Spinner';
import { BASE_URL } from '../api';
// Import CartItem and Product types from where they are defined
// Assuming src/data/shop-data.ts or similar contains these definitions
import type { CartItem, Product } from '../data/shop-data';

const CartPage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Cart Items from Backend ---
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]); // Clear cart if not authenticated
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.statusText}`);
      }
      const data: CartItem[] = await response.json();
      setCartItems(data);
    } catch (err: any) {
      setError(err.message);
      showToast(`Error loading cart: ${err.message}`, 'error');
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, showToast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- Update Quantity in Cart ---
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to modify your cart.', 'error');
      return;
    }
    if (newQuantity < 1) {
      // If quantity drops to 0 or less, we typically remove the item
      showToast('Quantity cannot be less than 1. Removing item...', 'info');
      handleRemoveFromCart(productId);
      return;
    }

    // Find the current item to check against stock
    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem) {
      showToast('Product not found in cart.', 'error');
      return;
    }

    // Check if newQuantity exceeds available stock
    if (newQuantity > currentItem.product.stock) {
      showToast(`Cannot add more than ${currentItem.product.stock} of ${currentItem.product.name} to cart (current stock).`, 'error');
      // Do not proceed with the API call if quantity exceeds stock
      // Optionally, you could set the quantity input back to currentItem.product.stock
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.productId === productId ? { ...item, quantity: currentItem.product.stock } : item
        )
      );
      return;
    }

    // Optimistic UI update
    const prevCartItems = [...cartItems];
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      // PATCH request to update quantity, expecting productId in URL param
      const response = await fetch(`${BASE_URL}/cart/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }), // Only send quantity in body
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Failed to update quantity: ${errorData.message || response.statusText}`, 'error');
        setCartItems(prevCartItems); // Revert on error
      } else {
        showToast('Cart quantity updated!', 'success');
        // Consider re-fetching the cart here if backend returns full updated cart,
        // or for stronger consistency after optimistic update.
        // await fetchCart();
      }
    } catch (err: any) {
      showToast(`Error updating quantity: ${err.message}`, 'error');
      console.error("Failed to update cart quantity:", err);
      setCartItems(prevCartItems); // Revert on network/other error
    }
  };

  // --- Remove Item from Cart ---
  const handleRemoveFromCart = async (productId: string) => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to modify your cart.', 'error');
      return;
    }

    const prevCartItems = [...cartItems];
    setCartItems(currentItems => currentItems.filter(item => item.productId !== productId)); // Optimistic UI update

    try {
      // DELETE request to remove item, expecting productId in URL param
      const response = await fetch(`${BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Failed to remove item: ${errorData.message || response.statusText}`, 'error');
        setCartItems(prevCartItems); // Revert on error
      } else {
        showToast('Item removed from cart!', 'info');
      }
    } catch (err: any) {
      showToast(`Error removing item: ${err.message}`, 'error');
      console.error("Failed to remove item from cart:", err);
      setCartItems(prevCartItems); // Revert on network/other error
    }
  };

  // --- Clear Entire Cart ---
  const handleClearCart = async () => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to clear your cart.', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
      return;
    }

    const prevCartItems = [...cartItems];
    setCartItems([]); // Optimistic UI update

    try {
      // DELETE request to clear all items, using the /cart/all endpoint
      const response = await fetch(`${BASE_URL}/cart/all`, { // Corrected endpoint to match backend
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Failed to clear cart: ${errorData.message || response.statusText}`, 'error');
        setCartItems(prevCartItems); // Revert on error
      } else {
        showToast('Your cart has been cleared!', 'info');
      }
    } catch (err: any) {
      showToast(`Error clearing cart: ${err.message}`, 'error');
      console.error("Failed to clear cart:", err);
      setCartItems(prevCartItems); // Revert on network/other error
    }
  };

  // Calculate total price using useMemo for optimization
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  }, [cartItems]);

  // Render logic based on authentication, loading, and error states
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-700">
        <p className="text-xl">Please log in to view your cart.</p>
        <Link to="/login" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-700">
        <Spinner size="large" />
        <p className="text-xl mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600">
        <p className="text-xl">Error: {error}</p>
        <button
          onClick={fetchCart}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-2xl mb-4">Your cart is empty.</p>
          <Link to="/products" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                </Link>
                <div className="flex-grow">
                  <Link to={`/products/${item.productId}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600">${Number(item.product.price).toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`quantity-${item.productId}`} className="sr-only">Quantity for {item.product.name}</label>
                    <input
                      type="number"
                      id={`quantity-${item.productId}`}
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                      min="1"
                      max={item.product.stock > 0 ? item.product.stock : 1} // Max quantity is product stock
                      className="w-16 p-2 border border-gray-300 rounded-md text-center"
                    />
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 ml-4">
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg text-gray-700 mb-2">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-700 mb-4 border-b pb-4">
              <span>Shipping:</span>
              <span>Free</span> {/* Placeholder for now */}
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={() => showToast('Checkout functionality coming soon!', 'info')} // Placeholder for checkout
              className="bg-green-600 text-white py-3 rounded-md text-xl font-semibold hover:bg-green-700 transition-colors w-full mb-4"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleClearCart}
              className="bg-gray-200 text-gray-800 py-3 rounded-md text-xl font-semibold hover:bg-gray-300 transition-colors w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;