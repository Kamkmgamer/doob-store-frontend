// D:\projects\projects\doob-store\my-ecommerce-app\src\App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';
import AddProductPage from './pages/AddProductPage';
import AboutPage from './pages/AboutPage';             // <--- NEW: Import AboutPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // <--- NEW: Import PrivacyPolicyPage
import TermsOfServicePage from './pages/TermsOfServicePage'; // <--- NEW: Import TermsOfServicePage


// Context Imports
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />

              <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Route */}
                  <Route
                    path="/add-product"
                    element={
                      <ProtectedRoute>
                        <AddProductPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* NEW PUBLIC STATIC PAGES */}
                  <Route path="/about" element={<AboutPage />} />             {/* <--- NEW ROUTE */}
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} /> {/* <--- NEW ROUTE */}
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} /> {/* <--- NEW ROUTE */}

                  {/* Add more routes here as needed */}
                </Routes>
              </main>

              <Footer />
              <BackToTopButton />
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;