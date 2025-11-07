import React, { useState } from 'react';
import { Product, User } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddRating: (productId: number, rating: number) => void;
  currentUser: User | null;
  onLoginClick: () => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.99.942 5.533c.242 1.417-.97 2.515-2.185 1.838L12 18.348l-4.793 2.844c-1.216.677-2.427-.42-2.185-1.838l.942-5.533-4.116-3.99c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddRating, currentUser, onLoginClick }) => {
  const [added, setAdded] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  
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

  const handleRatingSubmit = (rating: number) => {
    setSubmittedRating(rating);
    onAddRating(product.id, rating);
  }

  const renderRating = () => {
    const ratingToDisplay = hoverRating || submittedRating || Math.floor(product.rating);
    const hasRated = submittedRating > 0;

    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                <button
                    key={index}
                    disabled={hasRated}
                    onMouseEnter={() => !hasRated && setHoverRating(starValue)}
                    onMouseLeave={() => !hasRated && setHoverRating(0)}
                    onClick={() => !hasRated && handleRatingSubmit(starValue)}
                    className={`
                        p-0 bg-transparent border-none
                        ${hasRated ? 'cursor-default' : 'cursor-pointer'}
                        transform transition-transform duration-200
                        ${!hasRated && 'hover:scale-125'}
                    `}
                    aria-label={`Rate ${starValue} stars`}
                >
                    <StarIcon
                    className={`w-5 h-5 ${
                        starValue <= ratingToDisplay ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    />
                </button>
                );
            })}
            <span className="ml-2 text-gray-600 font-medium">{product.rating.toFixed(1)}</span>
            </div>
            {hasRated && (
            <p className="text-sm text-green-600 mt-1" role="status">
                Thank you for your rating!
            </p>
            )}
        </div>
    );
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
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-green-600">₹{displayPrice.toFixed(2)}</p>
            {isOnSale && <p className="text-lg font-normal text-gray-400 line-through">₹{product.price.toFixed(2)}</p>}
          </div>
          {renderRating()}
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
