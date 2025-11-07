import React from 'react';
import { CartItem } from '../types';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose, cartItems, cartTotal, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-6 border-b">
                <h2 id="cart-heading" className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Close cart panel">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-700">Your cart is empty</h3>
                        <p className="mt-2 max-w-xs mx-auto">Looks like you haven't added anything yet. Start shopping to find your new favorite pineapple treats!</p>
                        <button
                            onClick={onClose}
                            className="mt-6 py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 -my-4">
                        {cartItems.map(item => {
                            const price = item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price;
                            const originalPrice = item.product.price;
                            return (
                                <li key={item.product.id} className="flex items-start gap-4 py-4">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                                                <div className="flex items-baseline gap-2 text-sm">
                                                    <p className="text-gray-500">₹{price.toFixed(2)}</p>
                                                    {price < originalPrice && <p className="text-gray-400 line-through">₹{originalPrice.toFixed(2)}</p>}
                                                </div>
                                            </div>
                                            <button onClick={() => onRemoveItem(item.product.id)} className="text-gray-400 hover:text-red-600 p-1 -m-1" aria-label={`Remove ${item.product.name} from cart`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center">
                                                <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-0.5 border rounded-l-md hover:bg-gray-100" aria-label="Decrease quantity">-</button>
                                                <span className="px-3 w-10 text-center py-0.5 border-t border-b">{item.quantity}</span>
                                                <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-0.5 border rounded-r-md hover:bg-gray-100" aria-label="Increase quantity">+</button>
                                            </div>
                                            <p className="font-semibold text-lg">₹{(price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {cartItems.length > 0 && (
                 <footer className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Shipping and taxes calculated at checkout.</p>
                    <button 
                        onClick={onCheckout}
                        className="w-full mt-4 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                </footer>
            )}
        </div>
      </div>
    </>
  );
};

export default CartPanel;