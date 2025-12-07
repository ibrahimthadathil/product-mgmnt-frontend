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

export interface Iuser extends Document {
  userName: string;
  email: string;
  password: string;
  createdAt?: Date;
}
