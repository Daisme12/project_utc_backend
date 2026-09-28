export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  unitPrice: string;
  packWeight: string;
  stockStatus: string;
  rating: number;
  reviewCount: number;
  discountBadge?: string;
  badge?: string;
  standard?: string;
  weightCategory?: string;
  image: string;
  unit?: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  icon: string;
  count: number;
}
