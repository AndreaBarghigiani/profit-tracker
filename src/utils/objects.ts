/* eslint-disable @typescript-eslint/no-explicit-any */
export const isObject = (value: unknown) => {
  return !!(value && typeof value === "object" && !Array.isArray(value));
};

export const isObjectEmpty = (obj: any) => {
  if (!isObject(obj)) return false;
  for (const prop in obj) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
};
