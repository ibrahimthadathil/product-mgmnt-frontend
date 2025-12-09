export type ViewMode = "grid" | "table";

export interface Product {
  _id?: string ;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export interface CartItem extends Product {
  user: string | Iuser;
  items: [{ product: string | Product; quantity: number }];
  created_at?: Date;
}

export interface Iuser {
  name: string;
  email: string;
  role:string;
  password: string;
  createdAt?: Date;
}

export interface BackendCartResponse {
  _id: string;
  user: string;
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      description: string;
      price: string | number;
      category: string;
      images: string[];
      createdAt?: string;
      updatedAt?: string;
    };
    quantity: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}