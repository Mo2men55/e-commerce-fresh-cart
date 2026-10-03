export interface OrderShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderProductDetails {
  _id: string;
  title: string;
  imageCover: string;
  category?: { _id: string; name: string; slug: string; image?: string };
  brand?: { _id: string; name: string; slug: string; image?: string };
  ratingsAverage?: number;
  id: string;
}

export interface OrderCartItem {
  count: number;
  _id: string;
  product: OrderProductDetails;
  price: number;
}

export interface OrderType {
  shippingAddress: OrderShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: OrderUser;
  cartItems: OrderCartItem[];
  createdAt: string;
  updatedAt: string;
  id: number;
}
