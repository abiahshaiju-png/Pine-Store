export interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  isFeatured?: boolean;
  rating: number;
  imageUrl: string;
  description: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  content: string;
  author: string;
  authorImageUrl: string;
}

export interface CustomerDetails {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: number;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  shippingCost: number;
  shippingMethod: string;
  date: Date;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'UPI';
  isComplete: boolean;
  userId?: number;
}

export interface Feedback {
  id: number;
  productId: number;
  productName: string;
  rating: number;
  date: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string; // In a real app, this would be a securely hashed password
}

export interface PaymentSettings {
  gatewayApiKey: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
