import { Module } from "./Module";

export interface Rol {
  _id?: string;
  name: string;
  description?: string;
  status?: boolean;
  module?: Module[];
}
