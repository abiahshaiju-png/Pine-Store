import { Product, BlogPost } from './types';

export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Pineapple Jam', 
    price: 5.99, 
    isFeatured: true,
    rating: 4.8, 
    imageUrl: 'https://picsum.photos/seed/pineapplejam/400/300',
    description: 'Sweet and tangy jam, perfect for your morning toast. Made with fresh, ripe pineapples.',
    stock: 50,
  },
  { 
    id: 2, 
    name: 'Pineapple Pickle', 
    price: 7.49, 
    rating: 4.5, 
    imageUrl: 'https://picsum.photos/seed/pineapplepickle/400/300',
    description: 'A spicy and savory pickle that adds a kick to any meal. A unique and delicious treat.',
    stock: 35,
  },
  { 
    id: 3, 
    name: 'Dried Pineapple', 
    price: 9.99, 
    rating: 4.9, 
    imageUrl: 'https://picsum.photos/seed/driedpineapple/400/300',
    description: 'Naturally sweet and chewy dried pineapple rings. A healthy and convenient snack.',
    stock: 0,
  },
  { 
    id: 4, 
    name: 'Pineapple Chutney', 
    price: 6.99, 
    salePrice: 5.49,
    rating: 4.7, 
    imageUrl: 'https://picsum.photos/seed/pineapplechutney/400/300',
    description: 'A flavorful blend of sweet and spicy, perfect with cheese, crackers, or grilled meats.',
    stock: 40,
  },
];

export const BLOG_POSTS: BlogPost[] = [
    {
    id: 1,
    title: 'The Sweet History of the Pineapple',
    date: 'October 26, 2023',
    author: 'Jane Pineapple',
    authorImageUrl: 'https://i.pravatar.cc/40?u=jane',
    imageUrl: 'https://picsum.photos/seed/bloghistory/400/250',
    excerpt: 'Discover the fascinating journey of the pineapple, from a symbol of royalty and hospitality to a beloved tropical fruit found in kitchens worldwide.',
    content: 'Discover the fascinating journey of the pineapple, from a symbol of royalty and hospitality to a beloved tropical fruit found in kitchens worldwide. This article delves deep into its origins in South America, its discovery by European explorers, and its subsequent spread across the globe, becoming a staple in many cultures and cuisines.'
  },
  {
    id: 2,
    title: '5 Health Benefits You Never Knew About Pineapples',
    date: 'October 15, 2023',
    author: 'Dr. John Ananas',
    authorImageUrl: 'https://i.pravatar.cc/40?u=john',
    imageUrl: 'https://picsum.photos/seed/bloghealth/400/250',
    excerpt: 'Beyond its delicious taste, the pineapple is a powerhouse of nutrients and vitamins. Learn how it can boost your immune system and aid digestion.',
    content: 'Beyond its delicious taste, the pineapple is a powerhouse of nutrients and vitamins. Learn how it can boost your immune system, aid digestion, promote healthy bones, and even help in recovery after surgery. We break down the science behind bromelain, vitamin C, and manganese, and what they mean for your health.'
  },
  {
    id: 3,
    title: 'From Our Farm to Your Jar: The Making of Pineapple Jam',
    date: 'September 30, 2023',
    author: 'The Pine Store Team',
    authorImageUrl: 'https://i.pravatar.cc/40?u=team',
    imageUrl: 'https://picsum.photos/seed/blogjam/400/250',
    excerpt: 'A behind-the-scenes look at how we create our signature pineapple jam, using only the freshest ingredients and a whole lot of love.',
    content: 'A behind-the-scenes look at how we create our signature pineapple jam, using only the freshest ingredients and a whole lot of love. Follow the journey from the moment our pineapples are picked at peak ripeness to the careful process of cooking them down with natural sweeteners and spices to create the perfect jar of jam for your table.'
  },
   {
    id: 4,
    title: 'Creative Ways to Use Pineapple Chutney',
    date: 'September 12, 2023',
    author: 'Chef Alani',
    authorImageUrl: 'https://i.pravatar.cc/40?u=alani',
    imageUrl: 'https://picsum.photos/seed/blogchutney/400/250',
    excerpt: 'Tired of the same old condiments? Our pineapple chutney is the secret ingredient you need to elevate your dishes from simple to spectacular.',
    content: 'Tired of the same old condiments? Our pineapple chutney is the secret ingredient you need to elevate your dishes from simple to spectacular. We share five inventive recipes, from glazing grilled chicken and pork to topping a baked brie or even mixing it into a savory yogurt dip. Get ready to impress your guests!'
  },
];