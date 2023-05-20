export const uppercaseFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

export const currencyConverter = (amount: string) => {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(amount));
};
