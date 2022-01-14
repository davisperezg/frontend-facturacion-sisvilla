export const setsesionLocal = (key: string, valor: string) => {
  return localStorage.setItem(key, valor);
};

export const getsesionLocal = (key: string) => {
  return localStorage.getItem(key);
};

export const deleteSesions = () => {
  return localStorage.clear();
};
