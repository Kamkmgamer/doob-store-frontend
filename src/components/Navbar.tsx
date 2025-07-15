// src/components/Navbar.tsx (partial content)
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
// import { UserRole } from '../users/enums/user-role.enum'; // If you define UserRole in frontend

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  console.log('Current user object in Navbar:', user); // <--- ADD THIS LINE
  console.log('isAdmin status:', user && user.role === 'admin'); 
  // FIX: Ensure 'admin' matches your database/backend casing (most likely lowercase now)
  const isAdmin = user && user.role === 'admin'; // Changed from 'ADMIN' to 'admin'

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
          MyShop
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/products" className="hover:text-gray-300 transition-colors">
            Products
          </Link>

          {/* NEW: Add Product link for Admins */}
          {isAuthenticated && isAdmin && (
            <Link to="/add-product" className="hover:text-gray-300 transition-colors">
              Add Product
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-gray-300 transition-colors">
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Welcome, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;