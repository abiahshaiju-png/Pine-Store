import React from 'react';
import { User, Order } from '../types';

interface AccountPageProps {
  user: User;
  orders: Order[];
}

const getStatusClasses = (status: Order['status']) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'Shipped':
            return 'bg-blue-100 text-blue-800';
        case 'Delivered':
            return 'bg-green-100 text-green-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const AccountPage: React.FC<AccountPageProps> = ({ user, orders }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Orders</h1>
        <p className="text-lg text-gray-600 mb-8">Track your purchases and view your order history, {user.name.split(' ')[0]}.</p>
        
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet!</h2>
              <p className="text-gray-500">Looks like you haven't placed any orders. Time for some pineapple goodness!</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">Placed on: {order.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                     <p className="text-sm text-gray-500">Paid with: {order.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <p className="font-bold text-xl text-gray-800">₹{order.total.toFixed(2)}</p>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                        {order.status}
                     </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                        <h3 className="font-semibold mb-3 text-gray-700">Items Ordered:</h3>
                        <ul className="space-y-3">
                            {order.items.map(item => (
                            <li key={item.product.id} className="flex items-center gap-4">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0"/>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Quantity: {item.quantity}</span>
                                        <span>₹{item.product.price.toFixed(2)} each</span>
                                    </div>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                     <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-gray-700">Shipping To:</h3>
                        <address className="text-sm text-gray-600 not-italic">
                            <strong className="block">{order.customer.fullName}</strong>
                            {order.customer.address}<br />
                            {order.customer.city}, {order.customer.state} {order.customer.zip}
                        </address>
                     </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
