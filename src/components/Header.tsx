import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Brand & Copyright */}
        <div className="text-center md:text-left">
          <p className="text-lg font-medium">&copy; {currentYear} MyShop</p>
          <p className="text-sm text-gray-400">All rights reserved</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <FooterLink to="/about" label="About Us" />
          <FooterLink to="/privacy-policy" label="Privacy Policy" />
          <FooterLink to="/terms-of-service" label="Terms of Service" />
          {/* Add more links here if needed */}
        </div>
      </div>
    </footer>
  );
};

// Reusable Footer Link Component
const FooterLink: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
  >
    <span>{label}</span>
    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default Footer;
