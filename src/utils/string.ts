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

export const formatTime = (
  date: number | Date | undefined,
  timeType: TimeTypes = "short",
): string =>
  Intl.DateTimeFormat("en-EN", {
    timeStyle: timeType,
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
  removeZeros?: boolean;
};

export const currencyConverter = ({
  amount,
  showSign = false,
  removeZeros = false,
}: CurrencyConverterType) => {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  const numUnits = maxSignificantDigits(numeric);
  const minSignificant = numUnits === 1 ? 3 : 2;
  const maxSignifican = numUnits >= 1 ? numUnits + 2 : 2;

  const formatted = new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    signDisplay: showSign ? "always" : "never",
    minimumSignificantDigits: minSignificant,
    maximumSignificantDigits: maxSignifican,
  }).format(numeric);

  const hasDecimal = /\./;
  const hasSingleDecimal = /\.\d$/;
  const hasTooManyZeros = /\.0{6,}(\d)/;

  if (!hasDecimal.test(formatted)) {
    return formatted + ".00";
  }

  if (hasSingleDecimal.test(formatted)) {
    return formatted + "0";
  }

  if (hasTooManyZeros.test(formatted) && removeZeros) {
    return formatted.replace(hasTooManyZeros, ".0...$1");
  }

  return formatted;
};

export const formatNumber = (number: number | string) => {
  const numeric = typeof number === "string" ? parseFloat(number) : number;
  return new Intl.NumberFormat("en-EN", {
    style: "decimal",
    notation: "compact",
  }).format(numeric);
};
