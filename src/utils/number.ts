export const calcPercentageVariance = (oldValue: number, newValue: number) => {
  return ((newValue / oldValue - 1) * 100).toFixed(2);
};

export const calcAverage = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};
