import { Product } from "./Product";
import { Fact } from "./Fact";
export interface DetailsFact {
  _id?: string;
  fact: Fact | number;
  product: Product | string;
  quantity: number;
  price: number;
  discount: number;
  status?: boolean;
}
