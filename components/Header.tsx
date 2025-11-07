import React from 'react';
import { User } from '../types';

const SimplePineappleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M256 304C186.2 304 128 354.5 128 424.5C128 448.5 146.2 464 168 464H344C365.8 464 384 448.5 384 424.5C384 354.5 325.8 304 256 304Z" fill="#FBBF24"/>
        <path d="M208 80L232 160L184 128L208 80Z" fill="#22C55E"/>
        <path d="M256 48L288 128L240 160L256 48Z" fill="#16A34A"/>
        <path d="M304 80L280 160L328 128L304 80Z" fill="#22C55E"/>
        <path d="M256 304C294.7 304 328.7 319.3 352 344H160C183.3 319.3 217.3 304 256 304Z" fill="#F59E0B"/>
    </svg>
);

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface HeaderProps {
    cartCount: number;
    onCartClick: () => void;
    onNavigate: (view: 'products' | 'blog' | 'admin' | 'account') => void;
    isAdmin: boolean;
    currentUser: User | null;
    onLoginClick: () => void;
    onLogout: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onNavigate, isAdmin, currentUser, onLoginClick, onLogout, searchTerm, onSearchChange }) => {
  return (
    <header className="relative text-center py-6 px-4 bg-yellow-100/50 shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
            {/* Can be used for a menu icon later */}
        </div>
        <div className="flex-grow flex justify-center">
          <h1 className="text-4xl md:text-6xl font-['Pacifico',_cursive] text-green-800 flex justify-center items-center gap-1 md:gap-2 cursor-pointer" onClick={() => onNavigate('products')}>
            The Pine
            <SimplePineappleIcon className="w-10 h-10 md:w-14 md:h-14" />
            Store
          </h1>
        </div>
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-4">
            <div className="hidden lg:block text-right">
                {currentUser ? (
                    <div className="flex items-center gap-4">
                        <span className="text-green-800 font-semibold hidden sm:inline">Hello, {currentUser.name.split(' ')[0]}</span>
                        <button onClick={onLogout} className="text-sm bg-green-600 text-white font-semibold px-3 py-1 rounded-md hover:bg-green-700 transition">Logout</button>
                    </div>
                ) : isAdmin ? (
                    <div className="flex items-center gap-4">
                        <span className="text-green-800 font-semibold hidden sm:inline">Hello, Admin</span>
                        <button onClick={onLogout} className="text-sm bg-green-600 text-white font-semibold px-3 py-1 rounded-md hover:bg-green-700 transition">Logout</button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="text-lg bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition">Login</button>
                )}
            </div>
            <button
                onClick={onCartClick} 
                className="relative p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full" 
                aria-label={`Open shopping cart with ${cartCount} items`}
            >
            <CartIcon className="w-8 h-8 text-green-800" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
                </span>
            )}
            </button>
        </div>
      </div>
      
      <p className="text-2xl text-amber-600 -mt-2 font-['Pacifico',_cursive]">Farm fresh ready to Serve</p>

      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <input 
            type="search"
            placeholder="Search for pineapple treats..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-green-200 rounded-full bg-white focus:ring-green-500 focus:border-green-500 transition"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <nav className="flex justify-center items-center gap-2 sm:gap-6 flex-wrap">
        <button 
          onClick={() => onNavigate('products')}
          className="text-lg sm:text-xl text-green-800 font-semibold hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-3 py-1"
        >
          Store
        </button>
        <button 
          onClick={() => onNavigate('blog')}
          className="text-lg sm:text-xl text-green-800 font-semibold hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-3 py-1"
        >
          Blog
        </button>
        {currentUser && (
          <button 
            onClick={() => onNavigate('account')}
            className="text-lg sm:text-xl text-green-800 font-semibold hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-3 py-1"
          >
            My Orders
          </button>
        )}
        {isAdmin && (
            <button 
                onClick={() => onNavigate('admin')}
                className="text-lg sm:text-xl text-emerald-700 font-semibold hover:text-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-3 py-1"
            >
                Admin
            </button>
        )}
         <div className="lg:hidden">
            {currentUser ? (
                 <button onClick={onLogout} className="text-lg text-green-800 font-semibold hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-3 py-1">Logout</button>
            ) : !isAdmin && (
                <button onClick={onLoginClick} className="text-lg text-green-800 font-semibold hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg px-3 py-1">Login</button>
            )}
        </div>
      </nav>
    </header>
  );
};

export default Header;