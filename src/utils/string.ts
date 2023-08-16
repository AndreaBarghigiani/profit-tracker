// Types
type DateTypes = "long" | "short" | "full" | "medium" | undefined;
type TimeTypes = "long" | "short" | "full" | "medium" | undefined;

export const uppercaseFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (
  date: number | Date | undefined,
  dateType: DateTypes = "long",
  timeType?: TimeTypes,
) =>
  Intl.DateTimeFormat("en", {
    dateStyle: dateType,
    timeStyle: !!timeType ? timeType : undefined,
  }).format(date);

const maxSignificantDigits = (num: number, count: number = 0): number => {
  if (num > 0) {
    return maxSignificantDigits(Math.floor(num / 10), ++count);
  }
  return count;
};

type CurrencyConverterType = {
  amount: number | string;
  showSign?: boolean;
};

export const currencyConverter = ({
  amount,
  showSign = false,
}: CurrencyConverterType) => {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  const numUnits = maxSignificantDigits(numeric);
  const minSignificant = numUnits === 1 ? 3 : 2;
  const maxSignifican = numUnits >= 1 ? numUnits + 2 : 2;

  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    signDisplay: showSign ? "always" : "never",
    minimumSignificantDigits: minSignificant,
    maximumSignificantDigits: maxSignifican,
  }).format(numeric);
};

export const formatNumber = (number: number | string) => {
  const numeric = typeof number === "string" ? parseFloat(number) : number;
  return new Intl.NumberFormat("en-EN", {
    style: "decimal",
    notation: "compact",
  }).format(numeric);
};
