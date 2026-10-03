import type { Brand, Category, Subcategory } from "@/app/_interface/product";

export interface WishlistResponseType {
  status: string;
  count: number;
  data: WishlistProduct[];
}

export interface WishlistProduct {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  priceAfterDiscount?: number;
}
