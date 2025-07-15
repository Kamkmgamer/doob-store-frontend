// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // To get token and user info
import { useToast } from './ToastContext'; // For user feedback

// Define the shape of a single cart item (from backend)
export interface CartItem {
  id: string; // The ID of the cart item entry itself
  productId: string; // The ID of the product
  name: string;      // Product name
  imageUrl?: string; // Product image
  price: number;     // Product price
  quantity: number;  // Quantity in cart
  // You might add other product details if your backend sends them directly with cart items
}

// Define the shape of the CartContext value
interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => Promise<boolean>;
  removeCartItem: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  fetchCart: () => Promise<void>; // Expose fetchCart for manual refresh
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state for cart
  const { token, isAuthenticated } = useAuth(); // Get auth token from AuthContext
  const { showToast } = useToast(); // Get toast function from ToastContext

  const API_BASE_URL = 'http://localhost:3000'; // Your backend API base URL

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]); // Clear cart if not authenticated
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch cart:', errorData.message || response.statusText);
        showToast(`Failed to load cart: ${errorData.message || 'Please try again.'}`, 'error');
        setCartItems([]); // Clear cart on error
      }
    } catch (error: any) {
      console.error('Network error fetching cart:', error);
      showToast(`Network error loading cart: ${error.message || 'Please check your connection.'}`, 'error');
      setCartItems([]); // Clear cart on network error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, API_BASE_URL, showToast]);

  // Fetch cart when authentication status or token changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to add items to your cart.', 'info');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        // Backend should ideally return the updated cart or the new item
        // For simplicity, we refetch the entire cart after modification
        await fetchCart();
        showToast('Item added to cart!', 'success');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to add to cart:', errorData.message || response.statusText);
        showToast(`Failed to add item: ${errorData.message || 'Please try again.'}`, 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Network error adding to cart:', error);
      showToast(`Network error adding item: ${error.message || 'Please check your connection.'}`, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, fetchCart, API_BASE_URL, showToast]);


  // IMPORTANT: Define removeCartItem BEFORE updateCartItemQuantity
  const removeCartItem = useCallback(async (cartItemId: string) => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to modify your cart.', 'info');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) { // 204 No Content is common for successful deletion
        await fetchCart();
        showToast('Item removed from cart.', 'info');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to remove cart item:', errorData.message || response.statusText);
        showToast(`Failed to remove item: ${errorData.message || 'Please try again.'}`, 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Network error removing cart item:', error);
      showToast(`Network error removing item: ${error.message || 'Please check your connection.'}`, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, fetchCart, API_BASE_URL, showToast]);


  // Now updateCartItemQuantity can safely call removeCartItem
  const updateCartItemQuantity = useCallback(async (cartItemId: string, newQuantity: number) => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to update your cart.', 'info');
      return false;
    }
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      return removeCartItem(cartItemId); // This call is now valid
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchCart();
        showToast('Cart updated!', 'success');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to update cart item:', errorData.message || response.statusText);
        showToast(`Failed to update cart: ${errorData.message || 'Please try again.'}`, 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Network error updating cart item:', error);
      showToast(`Network error updating cart: ${error.message || 'Please check your connection.'}`, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, fetchCart, API_BASE_URL, removeCartItem, showToast]); // removeCartItem in dependencies is correct


  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      showToast('Please log in to clear your cart.', 'info');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, { // Assuming you have a /cart/clear endpoint
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) { // 204 No Content for successful clear
        setCartItems([]); // Directly clear local state as the backend is cleared
        showToast('Your cart has been cleared.', 'info');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to clear cart:', errorData.message || response.statusText);
        showToast(`Failed to clear cart: ${errorData.message || 'Please try again.'}`, 'error');
        return false;
      }
    } catch (error: any) {
      console.error('Network error clearing cart:', error);
      showToast(`Network error clearing cart: ${error.message || 'Please check your connection.'}`, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, API_BASE_URL, showToast]);


  const value = {
    cartItems,
    isLoading,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};