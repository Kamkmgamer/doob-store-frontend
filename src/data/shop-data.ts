// D:\projects\projects\doob-store\my-ecommerce-app\src\data\shop-data.ts
// (Keep your existing Product interface and shopData array if still in use)

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: { rate: number; count: number };
  details: string[];
  stock: number;
}

// Add this new interface for CartItem
export interface CartItem {
  id: string; // Unique ID for the cart item itself (if your backend provides one)
  productId: string; // The ID of the product
  quantity: number;
  product: Product; // Full product details nested within the cart item
}
