export const calcPercentageVariance = (oldValue: number, newValue: number) => {
  return ((newValue / oldValue - 1) * 100).toFixed(2);
};
