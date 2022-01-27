import { ChangeEvent } from "react";

export const types = {
  login: "[auth] login",
  logout: "[auth] logout",
};

export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
