import { Product } from "./Product";
import { Fact } from "./Fact";
export interface DetailsFact {
  _id?: string;
  fact: Fact;
  product: Product;
  quantity: number;
  price: number;
  discount: number;
  status?: boolean;
}
