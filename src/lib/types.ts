
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

export interface CarouselItem {
  id?: number;
  imageUrl: string;
  title: string;
  caption: string;
}

export interface AboutItem {
  id?: number;
  title: string;
  content: string;
  imageUrl: string;
}

export interface ContactItem {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
}

export interface FooterData {
  storeName: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
