export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface ProductsData {
  main: Product[];
  mixed: Product[];
  fries: Product[];
  drinks: Product[];
}