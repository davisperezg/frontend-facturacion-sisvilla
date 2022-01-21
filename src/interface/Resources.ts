import { Module } from "./Module";
import { Rol } from "./Rol";

export interface Resources {
  _id?: string;
  role?: Rol | string;
  module?: Module | string;
  canCreate: boolean;
  canUpdate: boolean;
  canRead: boolean;
  canDelete: boolean;
  canRestore: boolean;
}
