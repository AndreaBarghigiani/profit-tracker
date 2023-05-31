export const uppercaseFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

type CurrencyConverterType = {
  amount: number | string;
  type?: "short" | "long";
};
export const currencyConverter = ({
  amount,
  type = "short",
}: CurrencyConverterType) => {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: type === "long" ? 10 : 2,
  }).format(numeric);
};
