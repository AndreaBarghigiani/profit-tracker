// Utils
import { useState } from "react";
import va from "@vercel/analytics";

export const useTransactionModal = (tracking?: string) => {
  const [open, setOpen] = useState(false);

  if (open && !!tracking) {
    va.track(`${tracking} modal has been open`);
  }

  return { open, setOpen };
};
