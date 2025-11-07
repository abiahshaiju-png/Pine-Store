import React, { useState } from 'react';
import { Product, Order, Feedback, BlogPost, PaymentSettings } from '../types';
import { SettingsTab } from './SettingsTab';

type AdminView = 'orders' | 'products' | 'blogs' | 'feedback' | 'settings';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-yellow-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// --- Product Management Components ---
const ProductRow: React.FC<{ product: Product, onUpdateProduct: (p: Product) => void }> = ({ product, onUpdateProduct }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState(product);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({...prev, [name]: checked }));
        } else {
            setFormState(prev => ({...prev, [name]: (name === 'price' || name === 'stock' || name === 'salePrice') ? (value === '' ? undefined : Number(value)) : value }));
        }
    };

    const handleSave = () => {
        onUpdateProduct(formState);
        setIsEditing(false);
    }
    
    if (isEditing) {
        return (
             <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                <input name="name" value={formState.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Product Name" />
                <textarea name="description" value={formState.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
                <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Image URL" />
                <div className="flex flex-col sm:flex-row gap-4">
                    <input name="price" type="number" step="0.01" value={formState.price} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Price" />
                    <input name="salePrice" type="number" step="0.01" value={formState.salePrice || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Sale Price (optional)" />
                    <input name="stock" type="number" value={formState.stock} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Stock" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id={`featured-${formState.id}`} name="isFeatured" checked={!!formState.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <label htmlFor={`featured-${formState.id}`} className="font-medium text-gray-700 select-none">Mark as Featured</label>
                </div>
                <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
            </div>
        )
    }

    return (
         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow">
            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 sm:w-20 sm:h-20 rounded-md object-cover self-center sm:self-auto"/>
            <div className="flex-1 w-full">
                <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">{product.name}</p>
                    {product.isFeatured && <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <div className="flex items-baseline gap-2">
                    <p className={`text-sm ${product.salePrice ? 'text-gray-500 line-through' : 'text-gray-600'}`}>Price: ₹{product.price.toFixed(2)}</p>
                    {product.salePrice && <p className="text-sm text-red-600 font-semibold">Sale: ₹{product.salePrice.toFixed(2)}</p>}
                </div>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto">Edit</button>
        </div>
    )
}
const AddProductForm: React.FC<{ onAddProduct: (p: Omit<Product, 'id' | 'rating'>) => void }> = ({ onAddProduct }) => {
    const initialState = { name: '', description: '', imageUrl: '', price: 0, stock: 0, salePrice: undefined as number | undefined, isFeatured: false };
    const [formState, setFormState] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({...prev, [name]: checked }));
        } else {
             setFormState(prev => ({...prev, [name]: (name === 'price' || name === 'stock' || name === 'salePrice') ? (value === '' ? undefined : Number(value)) : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddProduct(formState);
        setFormState(initialState); // Reset form
    }
    
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Add New Product</h3>
            <input name="name" value={formState.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Product Name" required />
            <textarea name="description" value={formState.description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" required />
            <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Image URL" required />
            <div className="flex flex-col sm:flex-row gap-4">
                <input name="price" type="number" step="0.01" value={formState.price} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Price" required />
                <input name="salePrice" type="number" step="0.01" value={formState.salePrice || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Sale Price (optional)" />
                <input name="stock" type="number" value={formState.stock} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Initial Stock" required />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="featured-new" name="isFeatured" checked={formState.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <label htmlFor="featured-new" className="font-medium text-gray-700 select-none">Mark as Featured</label>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Product</button>
        </form>
    );
}

// --- Blog Management Components ---
const BlogRow: React.FC<{ post: BlogPost, onUpdate: (p: BlogPost) => void, onDelete: (id: number) => void }> = ({ post, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState(post);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdate(formState);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the post "${post.title}"?`)) {
            onDelete(post.id);
        }
    }
    
    if (isEditing) {
        return (
             <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                <input name="title" value={formState.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Post Title" />
                <textarea name="excerpt" value={formState.excerpt} onChange={handleChange} className="w-full p-2 border rounded h-24" placeholder="Excerpt" />
                <textarea name="content" value={formState.content} onChange={handleChange} className="w-full p-2 border rounded h-48" placeholder="Full Content" />
                <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Image URL" />
                <div className="flex flex-col sm:flex-row gap-4">
                    <input name="author" value={formState.author} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Author Name" />
                    <input name="authorImageUrl" value={formState.authorImageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Author Image URL" />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
            </div>
        )
    }

    return (
         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow">
            <img src={post.imageUrl} alt={post.title} className="w-32 h-20 sm:w-28 sm:h-20 rounded-md object-cover self-center sm:self-auto"/>
            <div className="flex-1 w-full">
                <p className="font-bold text-lg">{post.title}</p>
                <p className="text-sm text-gray-600">By {post.author}</p>
                <p className="text-sm text-gray-600">Published: {post.date}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setIsEditing(true)} className="flex-1 bg-yellow-500 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={handleDelete} className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
            </div>
        </div>
    )
}
const AddBlogForm: React.FC<{ onAdd: (p: Omit<BlogPost, 'id' | 'date'>) => void }> = ({ onAdd }) => {
    const initialState = { title: '', excerpt: '', content: '', imageUrl: '', author: '', authorImageUrl: '' };
    const [formState, setFormState] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formState);
        setFormState(initialState); // Reset form
    }
    
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Add New Blog Post</h3>
            <input name="title" value={formState.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Post Title" required />
            <textarea name="excerpt" value={formState.excerpt} onChange={handleChange} className="w-full p-2 border rounded h-24" placeholder="Excerpt" required />
            <textarea name="content" value={formState.content} onChange={handleChange} className="w-full p-2 border rounded h-48" placeholder="Full Content" required />
            <input name="imageUrl" value={formState.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Image URL" required />
             <div className="flex flex-col sm:flex-row gap-4">
                <input name="author" value={formState.author} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Author Name" required />
                <input name="authorImageUrl" value={formState.authorImageUrl} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Author Image URL" required />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Blog Post</button>
        </form>
    );
}

// --- Main Dashboard Component ---
interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  feedbacks: Feedback[];
  blogPosts: BlogPost[];
  paymentSettings: PaymentSettings;
  onUpdateProduct: (p: Product) => void;
  onAddProduct: (p: Omit<Product, 'id' | 'rating'>) => void;
  onUpdateOrderStatus: (orderId: number, status: Order['status']) => void;
  onToggleOrderComplete: (orderId: number) => void;
  onAddBlogPost: (p: Omit<BlogPost, 'id' | 'date'>) => void;
  onUpdateBlogPost: (p: BlogPost) => void;
  onDeleteBlogPost: (id: number) => void;
  onUpdatePaymentSettings: (settings: PaymentSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { 
    products, orders, feedbacks, blogPosts, paymentSettings,
    onUpdateProduct, onAddProduct, onUpdateOrderStatus, onToggleOrderComplete,
    onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost, onUpdatePaymentSettings,
  } = props;
  
  const [activeView, setActiveView] = useState<AdminView>('orders');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
    }
  }

  const renderContent = () => {
    switch(activeView) {
        case 'orders':
            return (
                <div className="space-y-4">
                    {orders.length === 0 ? <p>No orders yet.</p> : orders.map(order => (
                        <div key={order.id} className={`p-4 rounded-lg shadow transition-colors ${order.isComplete ? 'bg-green-50 opacity-70' : 'bg-white'}`}>
                           <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                <div>
                                    <p className="font-bold text-lg sm:text-base">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">{order.date.toLocaleString()}</p>
                                    <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="font-bold text-xl sm:text-lg self-end sm:self-auto">₹{order.total.toFixed(2)}</p>
                           </div>
                           <div className="mt-4 border-t pt-4">
                               <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <p className="font-semibold">{order.customer.fullName}</p>
                                        <p>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}</p>
                                        <p className="text-sm text-gray-500">Payment: {order.paymentMethod}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`complete-${order.id}`}
                                                checked={order.isComplete}
                                                onChange={() => onToggleOrderComplete(order.id)}
                                                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor={`complete-${order.id}`} className="font-medium text-gray-700 select-none">
                                                Mark as Complete
                                            </label>
                                        </div>
                                        <div>
                                            <label htmlFor={`status-${order.id}`} className="sr-only">Update Status</label>
                                            <select
                                                id={`status-${order.id}`}
                                                value={order.status}
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                                className="p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                               </div>
                                <ul className="mt-4 list-disc list-inside text-sm">
                                    {order.items.map(item => (
                                        <li key={item.product.id}>{item.quantity} x {item.product.name}</li>
                                    ))}
                                </ul>
                           </div>
                        </div>
                    ))}
                </div>
            );
        case 'products':
            return (
                 <div className="space-y-6">
                    <AddProductForm onAddProduct={onAddProduct} />
                    <div className="space-y-4">
                        {products.map(p => <ProductRow key={p.id} product={p} onUpdateProduct={onUpdateProduct} />)}
                    </div>
                </div>
            );
        case 'blogs':
            return (
                 <div className="space-y-6">
                    <AddBlogForm onAdd={onAddBlogPost} />
                    <div className="space-y-4">
                        {blogPosts.map(p => <BlogRow key={p.id} post={p} onUpdate={onUpdateBlogPost} onDelete={onDeleteBlogPost} />)}
                    </div>
                </div>
            );
        case 'feedback':
             return (
                <div className="space-y-4">
                    {feedbacks.length === 0 ? <p>No feedback yet.</p> : feedbacks.map(f => (
                         <div key={f.id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                                <p className="font-semibold">{f.productName}</p>
                                <p className="text-sm text-gray-500">{f.date.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center self-start sm:self-auto">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < f.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ))}
                            </div>
                         </div>
                    ))}
                </div>
            );
        case 'settings':
            return <SettingsTab settings={paymentSettings} onSave={onUpdatePaymentSettings} />;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="New Orders" value={orders.filter(o => o.status === 'Pending').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <StatCard title="Total Products" value={products.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
        <StatCard title="Blog Posts" value={blogPosts.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
        <StatCard title="Feedbacks" value={feedbacks.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        {(['orders', 'products', 'blogs', 'feedback', 'settings'] as AdminView[]).map(view => (
            <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex-shrink-0 capitalize px-3 sm:px-6 py-3 font-semibold transition-colors ${activeView === view ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            >
                {view}
            </button>
        ))}
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
