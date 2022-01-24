import { Area } from "./Area";
import { Rol } from "./Rol";

export interface User {
  _id?: string;
  name: string;
  lastname: string;
  email: string;
  nroDocument: string;
  tipDocument: string;
  username: string;
  password: string;
  role: Rol;
  area: Area;
  createdAt?: Date;
  updatedAt?: Date;
  status: boolean;
}
