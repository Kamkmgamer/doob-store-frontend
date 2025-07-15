// D:\projects\projects\doob-store\my-ecommerce-app\src\components\ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/shop-data'; // Ensure Product type is imported

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void; // Explicitly define this prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product detail page when clicking add to cart
    e.preventDefault(); // Prevent default button behavior
    addToCart(product);
  };

  const displayPrice = Number(product.price).toFixed(2); // Ensure price is number for toFixed
  const isOutOfStock = product.stock <= 0; // Check if product is out of stock

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative h-48 w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-80"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {product.name}
        </Link>
        <p className="text-gray-600 text-sm mt-1 mb-2 line-clamp-3">{product.description}</p>
        <div className="mt-auto"> {/* Pushes price and button to bottom */}
          <p className="text-2xl font-bold text-blue-600 mb-3">${displayPrice}</p>
          <button
            onClick={handleAddToCartClick}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200
                        ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;