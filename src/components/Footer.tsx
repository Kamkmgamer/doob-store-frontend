import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-6 mt-8 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p>&copy; {currentYear} MyShop. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end space-x-4">
          <Link to="/about" className="hover:text-gray-300 transition-colors whitespace-nowrap">
            About Us
          </Link>
          <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors whitespace-nowrap">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-gray-300 transition-colors whitespace-nowrap">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
