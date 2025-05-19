export interface ProductType {
  id: number;
  title: string;
  slug: string;
  content: string;
  price: number;
  quantity: number;
  shop: boolean;
  createdAt: string;
  updatedAt: string;
  discount: number;
  startsAt: string;
  endsAt: string;
  picture: string;
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
