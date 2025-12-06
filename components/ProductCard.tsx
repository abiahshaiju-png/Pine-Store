import React, { useState } from 'react';
import { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  currentUser: User | null;
  onLoginClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, currentUser, onLoginClick }) => {
  const [added, setAdded] = useState(false);
  
  const isOutOfStock = product.stock === 0;
  const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const displayPrice = isOnSale ? product.salePrice! : product.price;
  const discountPercent = isOnSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;


  const handleAddToCartClick = () => {
    if (isOutOfStock) return;

    if (!currentUser) {
      onLoginClick();
      return;
    }
    
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col ${isOutOfStock ? 'filter grayscale' : ''}`}>
      <div className="relative">
        <img className="w-full h-56 object-cover" src={product.imageUrl} alt={product.name} />
        {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Out of Stock
            </div>
        )}
        {isOnSale && !isOutOfStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discountPercent}% OFF
            </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-gray-600 flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-start items-center">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-green-600">₹{displayPrice.toFixed(2)}</p>
            {isOnSale && <p className="text-lg font-normal text-gray-400 line-through">₹{product.price.toFixed(2)}</p>}
          </div>
        </div>
        <div className="mt-6">
            <button
                onClick={handleAddToCartClick}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isOutOfStock 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : added 
                      ? 'bg-green-500' 
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
                aria-live="polite"
                disabled={isOutOfStock}
            >
                {isOutOfStock ? 'Out of Stock' : (added ? 'Added!' : 'Add to Cart')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;