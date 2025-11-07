import React, { useState, useEffect } from 'react';
import { CartItem, CustomerDetails, User, Order } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onBackToStore: () => void;
  onPlaceOrder: (customerDetails: CustomerDetails, shippingCost: number, shippingMethod: string, total: number, paymentMethod: Order['paymentMethod']) => void;
  currentUser: User | null;
}

interface FormErrors {
  [key: string]: string | null;
}

const SHIPPING_OPTIONS = [
    { id: 'standard', name: 'Standard', cost: 5.00, delivery: '4-6 business days' },
    { id: 'express', name: 'Express', cost: 15.00, delivery: '2-3 business days' },
];

type PaymentMethod = 'credit-card' | 'upi';

const FormInput = ({ label, id, error, className = '', ...props }: { label: string; id: string; error?: string | null; className?: string, [key: string]: any }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input
                id={id}
                name={id}
                className={`block w-full rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
            />
        </div>
        {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
);

const PaymentMethodRadio = ({ id, label, checked, onChange }: { id: PaymentMethod, label: string, checked: boolean, onChange: (id: PaymentMethod) => void }) => (
    <div className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${checked ? 'bg-green-50 border-green-500 ring-2 ring-green-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`} onClick={() => onChange(id)}>
        <input
            type="radio"
            name="paymentMethod"
            id={id}
            checked={checked}
            onChange={() => onChange(id)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
        />
        <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-800 cursor-pointer">{label}</label>
    </div>
);


const Checkout: React.FC<CheckoutProps> = ({ cartItems, cartTotal, onBackToStore, onPlaceOrder, currentUser }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    upiId: '',
  });

  useEffect(() => {
    if (currentUser) {
        setFormData(prev => ({...prev, fullName: currentUser.name}));
    }
  }, [currentUser]);

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_OPTIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const selectedShipping = SHIPPING_OPTIONS.find(option => option.id === shippingMethod)!;
  const grandTotal = cartTotal + selectedShipping.cost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State / Province is required.';
    if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) newErrors.zip = 'Valid ZIP code is required.';
    
    if (paymentMethod === 'credit-card') {
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required.';
        if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Valid 16-digit card number is required.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Valid expiration date (MM/YY) is required.';
        if (!/^\d{3,4}$/.test(formData.cardCvc)) newErrors.cardCvc = 'Valid CVC is required.';
    }

    if (paymentMethod === 'upi') {
        if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) newErrors.upiId = 'Please enter a valid UPI ID (e.g., yourname@bank).';
    }

    return newErrors;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        onBackToStore();
        return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const { cardName, cardNumber, cardExpiry, cardCvc, upiId, ...customerDetails } = formData;
      const paymentMethodName: Order['paymentMethod'] = paymentMethod === 'credit-card' ? 'Credit Card' : 'UPI';
      onPlaceOrder(customerDetails, selectedShipping.cost, selectedShipping.name, grandTotal, paymentMethodName);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center max-w-lg">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 text-lg mb-6">Your order has been placed successfully.</p>
          <p className="text-gray-500 mb-8">We've sent a confirmation and receipt to your email address. (This is a demo, no email was actually sent).</p>
          <button onClick={onBackToStore} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <button onClick={onBackToStore} className="text-green-600 hover:text-green-800 font-semibold">&larr; Back to Store</button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Side: Forms */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                    {/* Shipping Address */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <FormInput label="Full Name" id="fullName" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} error={errors.fullName} className="sm:col-span-6" />
                            <FormInput label="Address" id="address" placeholder="123 Pineapple Lane" value={formData.address} onChange={handleChange} error={errors.address} className="sm:col-span-6" />
                            <FormInput label="City" id="city" placeholder="Tropicana City" value={formData.city} onChange={handleChange} error={errors.city} className="sm:col-span-2" />
                            <FormInput label="State / Province" id="state" placeholder="Fruitland" value={formData.state} onChange={handleChange} error={errors.state} className="sm:col-span-2" />
                            <FormInput label="ZIP / Postal Code" id="zip" placeholder="90210" value={formData.zip} onChange={handleChange} error={errors.zip} className="sm:col-span-2" />
                        </div>
                    </section>
                    
                    {/* Payment Details */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment Method</h2>
                        <div className="space-y-4">
                            <PaymentMethodRadio id="credit-card" label="Credit / Debit Card" checked={paymentMethod === 'credit-card'} onChange={setPaymentMethod} />
                             <PaymentMethodRadio id="upi" label="UPI" checked={paymentMethod === 'upi'} onChange={setPaymentMethod} />
                        </div>
                        
                        {paymentMethod === 'credit-card' && (
                             <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t pt-6">
                                <FormInput label="Name on Card" id="cardName" placeholder="Jane M. Doe" value={formData.cardName} onChange={handleChange} error={errors.cardName} className="sm:col-span-6" />
                                <FormInput label="Card Number" id="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} error={errors.cardNumber} className="sm:col-span-6" />
                                <FormInput label="Expiration Date (MM/YY)" id="cardExpiry" placeholder="MM/YY" value={formData.cardExpiry} onChange={handleChange} error={errors.cardExpiry} className="sm:col-span-3" />
                                <FormInput label="CVC" id="cardCvc" placeholder="123" value={formData.cardCvc} onChange={handleChange} error={errors.cardCvc} className="sm:col-span-3" />
                            </div>
                        )}

                         {paymentMethod === 'upi' && (
                             <div className="mt-6 border-t pt-6">
                                <FormInput label="UPI ID" id="upiId" placeholder="yourname@bank" value={formData.upiId} onChange={handleChange} error={errors.upiId} />
                                <p className="mt-2 text-sm text-gray-500">You will receive a payment request on your UPI app.</p>
                             </div>
                         )}
                    </section>
                    
                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400"
                            disabled={cartItems.length === 0}
                        >
                           Pay ₹{grandTotal.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
                    <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-4 -mr-4 border-b pb-4">
                        {cartItems.length > 0 ? cartItems.map(item => {
                            const price = item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price;
                            return (
                                <div key={item.product.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover"/>
                                        <div>
                                            <p className="font-semibold">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">₹{(price * item.quantity).toFixed(2)}</p>
                                </div>
                            );
                        }) : <p className="text-gray-500">Your cart is empty.</p>}
                    </div>

                    <fieldset className="mt-6">
                      <legend className="text-lg font-medium text-gray-900">Shipping method</legend>
                      <div className="mt-4 space-y-4">
                        {SHIPPING_OPTIONS.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              id={option.id}
                              name="shippingMethod"
                              type="radio"
                              checked={shippingMethod === option.id}
                              onChange={() => setShippingMethod(option.id)}
                              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor={option.id} className="ml-3 block w-full text-sm text-gray-700">
                              <span className="font-medium text-gray-900 flex justify-between">
                                <span>{option.name}</span>
                                <span>₹{option.cost.toFixed(2)}</span>
                              </span>
                              <span className="text-gray-500 block">{option.delivery}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-6 border-t pt-4 space-y-2">
                         <div className="flex justify-between text-base font-medium text-gray-600">
                            <p>Subtotal</p>
                            <p>₹{cartTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-base font-medium text-gray-600">
                            <p>Shipping</p>
                            <p>₹{selectedShipping.cost.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between font-bold text-xl text-gray-900 border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;