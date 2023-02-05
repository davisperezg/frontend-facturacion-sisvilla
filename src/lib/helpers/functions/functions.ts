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
  maximumFractionDigits: 4,
});

export const formatDate = (date: Date) => {
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
};

//usandose para la consulta producto
export const convertDateToUTCLocal = (inputDate: Date) => {
  const date = new Date(
    inputDate.getTime() + inputDate.getTimezoneOffset() * 60000
  );
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  );
};

//usandose para el input del form producto
export const formatFech = (inputDate: Date) => {
  const isoDate = inputDate.toISOString();

  return isoDate.substring(0, 10);
};
