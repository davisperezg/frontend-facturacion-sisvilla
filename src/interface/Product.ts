import { Area } from "./Area";
import { Mark } from "./Mark";
import { Model } from "./Model";
import { Unit } from "./Unit";
export interface Product {
  _id?: string;
  cod_internal: string;
  name: string;
  note?: string;
  mark: Mark | string;
  area?: Area | string;
  model: Model | string;
  unit: Unit | string;
  stock: number;
  price: number;
  status?: boolean;
  price_c: number;
  fecVen?: Date | string;
}
