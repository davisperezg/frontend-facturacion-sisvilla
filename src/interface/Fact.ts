import { Client } from "./Client";
import { User } from "./User";

export interface Fact {
  _id?: string;
  cod_fact: number;
  user?: User | string;
  client: Client | string;
  payment_type: string;
  way_to_pay: string;
  subtotal: number;
  discount: number;
  customer_payment: number;
  status?: boolean;
  obs?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
