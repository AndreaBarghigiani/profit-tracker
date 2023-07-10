export const uppercaseFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (date: number | Date | undefined) =>
  Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

type CurrencyConverterType = {
  amount: number | string;
  type?: "short" | "long";
  showSign?: boolean;
};
export const currencyConverter = ({
  amount,
  type = "short",
  showSign = false,
}: CurrencyConverterType) => {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    signDisplay: showSign ? "always" : "never",
    maximumFractionDigits: type === "long" ? 10 : 2,
  }).format(numeric);
};

export const formatNumber = (number: number | string) => {
  const numeric = typeof number === "string" ? parseFloat(number) : number;
  return new Intl.NumberFormat("en-EN", { style: "decimal" }).format(numeric);
};
