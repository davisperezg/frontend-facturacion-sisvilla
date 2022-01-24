export const randomColors = () => {
  const arrayColors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "dark",
  ];
  const random = Math.floor(Math.random() * 7);
  return arrayColors[random];
};

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
