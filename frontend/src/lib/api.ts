import { API_URL } from "./config";
import type { Category, Product } from "@/types";

export interface Paginated<T> {
  success: boolean;
  data: T;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type PublicSettings = Record<string, string>;

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers ?? {}),
  };
  if (options?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: options?.token ? "include" : "same-origin",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error ?? json.message ?? "Request failed");
  }
  return json as T;
}

// ——— Public ———

export async function fetchPublicSettings(): Promise<PublicSettings> {
  const res = await request<ApiResponse<PublicSettings>>("/settings/public");
  return res.data ?? {};
}

export async function fetchProducts(params?: {
  search?: string;
  category_id?: number;
  sort?: string;
  page?: number;
  per_page?: number;
  featured?: boolean;
  best_seller?: boolean;
  new_arrival?: boolean;
  min_price?: number;
  max_price?: number;
}): Promise<Paginated<Product[]>> {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.category_id) q.set("category_id", String(params.category_id));
  if (params?.sort) q.set("sort", params.sort);
  if (params?.page) q.set("page", String(params.page));
  if (params?.per_page) q.set("per_page", String(params.per_page));
  if (params?.featured) q.set("featured", "true");
  if (params?.best_seller) q.set("best_seller", "true");
  if (params?.new_arrival) q.set("new_arrival", "true");
  if (params?.min_price != null) q.set("min_price", String(params.min_price));
  if (params?.max_price != null) q.set("max_price", String(params.max_price));
  const query = q.toString() ? `?${q}` : "";
  return request<Paginated<Product[]>>(`/products${query}`);
}

export async function fetchProduct(idOrSlug: string): Promise<Product> {
  const res = await request<ApiResponse<Product>>(`/products/${idOrSlug}`);
  if (!res.data) throw new Error("Product not found");
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await request<ApiResponse<Category[]>>("/categories");
  return res.data ?? [];
}

export async function subscribeNewsletter(email: string): Promise<void> {
  await request("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  notes?: string;
  items: {
    product_id: string;
    variant_id?: number;
    quantity: number;
  }[];
}

export interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<Order> {
  const res = await request<ApiResponse<Order>>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data) throw new Error("Order creation failed");
  return res.data;
}

export async function createReview(payload: {
  product_id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title?: string;
  comment?: string;
}): Promise<void> {
  await request("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchProductReviews(productId: string) {
  const res = await request<ApiResponse<unknown[]>>(
    `/products/${productId}/reviews`
  );
  return res.data ?? [];
}

// ——— Admin ———

export async function adminLogin(
  email: string,
  password: string
): Promise<{ access_token: string; user: unknown }> {
  const res = await request<ApiResponse<{ access_token: string; user: unknown }>>(
    "/admin/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
  if (!res.data) throw new Error("Login failed");
  return res.data;
}

export async function adminFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  return request<T>(path, { ...options, token });
}
