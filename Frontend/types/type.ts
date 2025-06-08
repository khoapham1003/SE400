export interface ProductType {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  price?: number;
  quantity?: number;
  shop?: boolean;
  created_at?: string;
  updated_at?: string;
  discount?: number;
  starts_at?: string;
  ends_at?: string;
  picture?: string;
}
export interface SizeType {
  id: number;
  name: string;
  size: number;
}
export interface ColorType {
  id: number;
  name: string;
  hex: string;
}
export interface ProductVariantType {
  id: number;
  productId?: number | null;
  sizeId?: number | null;
  colorId?: number | null;
  quantity: number;

  product?: ProductType | null;
  size?: SizeType | null;
  color?: ColorType | null;
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

export interface UserType {
  userId: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber?: string | null;
  email: string;
  admin: boolean;
  guest: boolean;
  registeredAt: string;
  lastLogin?: string | null;
}

export interface CartType {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  user?: UserType;
}

export interface CartItemType {
  id: number;
  productVID?: number | null;
  cartID: number;
  price: number;
  discount: number;
  quantity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  productVariant?: ProductVariantType | null;
  cart?: CartType;
}

export interface InProcessItemType {
  id: number;
  productVID: number;
  cartID: number;
  price: number;
  discount: number;
  quantity: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  productVariant: ProductVariantType;
  cart?: CartType;
}

export interface OrderType {
  id: number;
  userId: number;
  session: string;
  token: string;
  status: string;
  subTotal: number;
  totalDiscount: number;
  shippingFee: number;
  grandTotal: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  line1: string;
  line2?: string | null;
  city: string;
  province: string;
  country: string;
  createdAt: string;
  updatedAt: string;

  user: UserType;
  orderItems: OrderItemType[];
}

export interface OrderItemType {
  id: number;
  productVID?: number | null;
  orderID: number;
  price: number;
  discount: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;

  productVariant?: ProductVariantType | null;
}

export interface NotificationType {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  grandTotal: number;
}
