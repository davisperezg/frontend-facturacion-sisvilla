import { Menu } from "./Menu";

export interface Module {
  _id?: string;
  name: string;
  menu?: Menu[];
  status?: boolean;
}
