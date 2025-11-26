export interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  is_admin?: boolean;
  avatar?: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string;
  condicion?: string;
  estado?: string;
  vendedor_id?: number;
  created_at?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
