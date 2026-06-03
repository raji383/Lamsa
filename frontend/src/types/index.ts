export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  details?: string;
  category_id?: number;
  category_name?: string;
  base_price: number;
  sale_price?: number;
  currency: string;
  sku?: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_published: boolean;
  total_sold?: number;
  avg_rating?: number;
  review_count?: number;
  meta_title?: string;
  meta_description?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
}

export interface Review {
  id: number;
  product_id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  customer_name: string;
  created_at: string;
}

export interface ProductImage {
  id: number;
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: string;
  size: string;
  color: string;
  color_hex?: string;
  stock: number;
  price_override?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface CartItem {
  id: string; // generate unique id for cart item (product_id + variant_id)
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
