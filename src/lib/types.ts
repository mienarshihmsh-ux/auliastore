
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}
