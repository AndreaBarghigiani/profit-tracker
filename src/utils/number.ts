const now = new Date();
export const ONE_MINUTE = now.getTime() - 1 * 60000;
export const HALF_HOUR = now.getTime() - 29 * 60000; // We have cron jobs that run every 30 minutes
export const ONE_DAY_AGO = Date.now() - 1000 * 60 * 60 * 24;

export const calcPercentageVariance = (oldValue: number, newValue: number) => {
  return ((newValue / oldValue - 1) * 100).toFixed(2);
};

export const calcAverage = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export const percentageOf = (number: number, percentage: number) => {
  return (percentage / 100) * number;
};
