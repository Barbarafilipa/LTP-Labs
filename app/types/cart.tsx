export type CartItem = {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Cart = CartItem[];
