import { User, Order, Product } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

// In a real app, this would be a secure hashing function.
// For this demo, we'll use a simple "hashing" function.
const hashPassword = (password: string) => `hashed_${password}`;

// --- SIMULATED USERS DATABASE ---
const initialUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', passwordHash: hashPassword('password123') },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', passwordHash: hashPassword('securepass') },
];

class UserDatabase {
    private users: User[];
    private readonly storageKey = 'pine_store_users';

    constructor() {
        this.users = this.loadUsers();
    }

    private loadUsers(): User[] {
        try {
            const savedUsers = localStorage.getItem(this.storageKey);
            if (savedUsers) {
                return JSON.parse(savedUsers);
            }
        } catch (error) {
            console.error("Failed to load or parse users from localStorage", error);
        }
        
        // If loading fails or nothing is there, initialize with default users
        localStorage.setItem(this.storageKey, JSON.stringify(initialUsers));
        return initialUsers;
    }

    private saveUsers(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users));
        } catch (error) {
            console.error("Failed to save users to localStorage", error);
        }
    }

    public getUserByEmail(email: string): User | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    public getUserById(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }

    public verifyPassword(user: User, pass: string): boolean {
        return user.passwordHash === hashPassword(pass);
    }

    public addUser(name: string, email: string, pass: string): User | null {
        if (this.getUserByEmail(email)) {
            return null; // User already exists
        }
        const newUser: User = {
            id: Date.now(),
            name,
            email,
            passwordHash: hashPassword(pass),
        };
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }
}

export const userDB = new UserDatabase();


// --- SIMULATED ORDERS DATABASE ---
export const orders: Order[] = [
    {
      id: 1678886400000,
      customer: {
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
      items: [
        { product: { id: 1, name: 'Pineapple Jam', price: 5.99, rating: 4.8, imageUrl: 'https://picsum.photos/seed/pineapplejam/400/300', description: '', stock: 0, isFeatured: false, salePrice: undefined }, quantity: 2 },
      ],
      total: 16.98,
      shippingCost: 5.00,
      shippingMethod: 'Standard',
      date: new Date('2023-03-15T12:00:00Z'),
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      isComplete: false,
      userId: 1,
    },
];

export const getOrdersByUserId = (userId: number, allOrders: Order[]): Order[] => {
    return allOrders.filter(o => o.userId === userId).sort((a, b) => b.date.getTime() - a.date.getTime());
}

// --- SIMULATED PRODUCTS DATABASE ---
const loadProducts = (): Product[] => {
    const savedProducts = localStorage.getItem('pine_store_products');
    if (savedProducts) {
        return JSON.parse(savedProducts);
    }
    localStorage.setItem('pine_store_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
};

let products: Product[] = loadProducts();

const saveProducts = () => {
    localStorage.setItem('pine_store_products', JSON.stringify(products));
};

export const getAllProducts = (): Product[] => {
    return products;
};

export const updateProduct = (updatedProduct: Product): void => {
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex !== -1) {
        products[productIndex] = updatedProduct;
        saveProducts();
    }
};

export const addProduct = (newProductData: Omit<Product, 'id' | 'rating'>): Product => {
    const newProduct: Product = {
        ...newProductData,
        id: Date.now(),
        rating: 0, // New products start with 0 rating
    };
    products = [newProduct, ...products];
    saveProducts();
    return newProduct;
};