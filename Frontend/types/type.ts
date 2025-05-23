export interface ProductType {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  price?: number;
  quantity?: number;
  shop?: boolean;
  created_at?: string; // Changed from createdAt
  updated_at?: string; // Changed from updatedAt
  discount?: number;
  starts_at?: string; // Changed from startsAt
  ends_at?: string; // Changed from endsAt
  picture?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CategoryType {
  id: number;
  parentId: number | null;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  picture?: string;
}

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NotificationType {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}
