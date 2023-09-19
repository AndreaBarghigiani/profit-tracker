const now = new Date();
export const HALF_HOUR = now.getTime() - 30 * 60000;

export const calcPercentageVariance = (oldValue: number, newValue: number) => {
  return ((newValue / oldValue - 1) * 100).toFixed(2);
};

export const calcAverage = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export const percentageOf = (number: number, percentage: number) => {
  return (percentage / 100) * number;
};
