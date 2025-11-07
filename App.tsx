import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import Checkout from './components/Checkout';
import BlogPage from './components/BlogPage';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import AccountPage from './components/AccountPage';
import { ToastContainer } from './components/Toast';
import { BLOG_POSTS as INITIAL_BLOG_POSTS } from './constants';
import { Product, CartItem, Order, Feedback, CustomerDetails, User, BlogPost, PaymentSettings, ToastMessage } from './types';
import { userDB, orders as dbOrders, getOrdersByUserId, getAllProducts, updateProduct as dbUpdateProduct, addProduct as dbAddProduct } from './db';

const App: React.FC = () => {
  // App State
  const [products, setProducts] = useState<Product[]>(getAllProducts());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('pine_store_orders');
    return savedOrders ? JSON.parse(savedOrders, (key, value) => key === 'date' ? new Date(value) : value) : dbOrders;
  });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'products' | 'checkout' | 'blog' | 'admin' | 'account'>('products');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const savedSettings = localStorage.getItem('pine_store_payment_settings');
    return savedSettings ? JSON.parse(savedSettings) : { gatewayApiKey: '', bankAccountName: '', bankAccountNumber: '', bankIfscCode: '' };
  });
  
  // Search & Notifications
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pine_store_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('pine_store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pine_store_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pine_store_currentUser');
    }
  }, [currentUser]);
  
  useEffect(() => {
    localStorage.setItem('pine_store_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setView('admin');
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    if(view === 'account' || view === 'checkout' || view === 'admin') {
      setView('products');
    }
  }
  
  const handleSignUp = (name: string, email: string, pass: string): User | null => {
    const newUser = userDB.addUser(name, email, pass);
    if (newUser) {
      handleLoginSuccess(newUser);
      return newUser;
    }
    return null;
  }

  const handleAddToCart = (product: Product, quantity: number) => {
     const productInState = products.find(p => p.id === product.id);
    if (!productInState) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      
      const availableStock = productInState.stock - currentQuantityInCart;
      const quantityToAdd = Math.min(quantity, availableStock);

      if (quantityToAdd <= 0) {
          addToast("Sorry, there is not enough stock to add this quantity.", 'error');
          return prevCart;
      }
      
      addToast(`${product.name} added to cart!`, 'success');

      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: quantityToAdd }];
    });
  };
  
  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    setCart(currentCart => {
      if (newQuantity <= 0) {
        return currentCart.filter(item => item.product.id !== productId);
      }

      const productInState = products.find(p => p.id === productId);

      if (productInState && newQuantity > productInState.stock) {
        addToast('Sorry, the requested quantity is not available.', 'error');
        return currentCart;
      }

      return currentCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart => cart.filter(item => item.product.id !== productId));
  };
  
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const handlePlaceOrder = (customerDetails: CustomerDetails, shippingCost: number, shippingMethod: string, total: number, paymentMethod: Order['paymentMethod']) => {
    const newOrder: Order = {
      id: Date.now(),
      customer: customerDetails,
      items: cart,
      shippingCost,
      shippingMethod,
      total,
      date: new Date(),
      status: 'Pending',
      paymentMethod,
      isComplete: false,
      userId: currentUser?.id,
    };
    setOrders(prev => [newOrder, ...prev]);
    
    setProducts(currentProducts => {
        const updatedProducts = currentProducts.map(p => {
            const cartItem = cart.find(item => item.product.id === p.id);
            if (cartItem) {
                const updatedProduct = {
                    ...p,
                    stock: p.stock - cartItem.quantity
                };
                dbUpdateProduct(updatedProduct);
                return updatedProduct;
            }
            return p;
        });
        return updatedProducts;
    });

    setCart([]);
  };
  
  const handleAddFeedback = (productId: number, rating: number) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newFeedback: Feedback = {
          id: Date.now(),
          productId,
          productName: product.name,
          rating,
          date: new Date(),
      };
      setFeedbacks(prev => [newFeedback, ...prev]);
  };
  
  // Admin Handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    dbUpdateProduct(updatedProduct);
    setProducts(products => products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'rating'>) => {
      const newProduct = dbAddProduct(newProductData);
      setProducts(prev => [newProduct, ...prev]);
  }

  const handleUpdateOrderStatus = (orderId: number, status: Order['status']) => {
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status } : o));
  };
  
  const handleToggleOrderComplete = (orderId: number) => {
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, isComplete: !o.isComplete } : o));
  };

  const handleAddBlogPost = (newPostData: Omit<BlogPost, 'id' | 'date'>) => {
    const newPost: BlogPost = {
        ...newPostData,
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}),
    };
    setBlogPosts(prev => [newPost, ...prev]);
  }

  const handleUpdateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(posts => posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  }
  
  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(posts => posts.filter(p => p.id !== postId));
  }

  const handleUpdatePaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettings(settings);
  };


  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.salePrice && item.product.salePrice < item.product.price
      ? item.product.salePrice
      : item.product.price;
    return total + price * item.quantity;
  }, 0);
  const userOrders = currentUser ? getOrdersByUserId(currentUser.id, orders) : [];

  const renderContent = () => {
    switch (view) {
      case 'checkout':
        return <Checkout 
                    cartItems={cart}
                    cartTotal={cartTotal}
                    onBackToStore={() => {
                        setView('products');
                        if (cart.length > 0) {} else { setCart([]); }
                    }}
                    onPlaceOrder={handlePlaceOrder}
                    currentUser={currentUser}
                />;
      case 'blog':
        return <BlogPage posts={blogPosts} />;
      case 'admin':
        return isAdmin ? <AdminDashboard 
                            products={products}
                            orders={orders}
                            feedbacks={feedbacks}
                            blogPosts={blogPosts}
                            paymentSettings={paymentSettings}
                            onUpdateProduct={handleUpdateProduct}
                            onAddProduct={handleAddProduct}
                            onUpdateOrderStatus={handleUpdateOrderStatus}
                            onToggleOrderComplete={handleToggleOrderComplete}
                            onAddBlogPost={handleAddBlogPost}
                            onUpdateBlogPost={handleUpdateBlogPost}
                            onDeleteBlogPost={handleDeleteBlogPost}
                            onUpdatePaymentSettings={handleUpdatePaymentSettings}
                         /> : <p>Access Denied</p>;
      case 'account':
        return currentUser ? <AccountPage user={currentUser} orders={userOrders} /> : <p>Please log in to view your account.</p>;
      case 'products':
      default:
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(lowercasedSearchTerm));

        const featuredProducts = filteredProducts.filter(p => p.isFeatured);
        
        const topRatedProducts = [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .filter(p => !p.isFeatured && p.name.toLowerCase().includes(lowercasedSearchTerm));
        
        const topRatedIds = topRatedProducts.map(p => p.id);

        const regularProducts = filteredProducts.filter(p => !p.isFeatured && !topRatedIds.includes(p.id));

        return (
          <main className="container mx-auto px-4 py-12">
            {featuredProducts.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-green-800 mb-8 border-b-2 border-yellow-200 pb-2">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard 
                                key={product.id} product={product} onAddToCart={handleAddToCart}
                                onAddRating={handleAddFeedback} currentUser={currentUser} onLoginClick={() => setIsLoginModalOpen(true)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {topRatedProducts.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-green-800 mb-8 border-b-2 border-yellow-200 pb-2">Top Rated</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {topRatedProducts.map((product) => (
                            <ProductCard
                                key={product.id} product={product} onAddToCart={handleAddToCart}
                                onAddRating={handleAddFeedback} currentUser={currentUser} onLoginClick={() => setIsLoginModalOpen(true)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="text-3xl font-bold text-center text-green-800 mb-8 border-b-2 border-yellow-200 pb-2">
                    {featuredProducts.length > 0 || topRatedProducts.length > 0 ? 'All Products' : 'Our Products'}
                </h2>
                {regularProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {regularProducts.map((product) => (
                            <ProductCard 
                            key={product.id} product={product} onAddToCart={handleAddToCart}
                            onAddRating={handleAddFeedback} currentUser={currentUser} onLoginClick={() => setIsLoginModalOpen(true)}
                            />
                        ))}
                    </div>
                ) : (
                  <p className="text-center text-gray-500 text-lg">No products found matching your search.</p>
                )}
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setView}
        isAdmin={isAdmin}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <CartPanel 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleProceedToCheckout}
      />
      
      {renderContent()}

      <footer className="text-center py-6 bg-yellow-100/50 mt-8">
        <p className="text-green-900">&copy; {new Date().getFullYear()} The Pine Store. All rights reserved.</p>
      </footer>
      
      {isLoginModalOpen && (
          <LoginModal 
            onClose={() => setIsLoginModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onSignUp={handleSignUp}
          />
      )}
    </div>
  );
};

export default App;
