import { Area } from "./Area";

export interface Sequence {
  _id?: string;
  sequence: number;
  area: Area | string;
}
