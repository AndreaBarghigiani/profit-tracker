// Utils
import { useState } from "react";

export const useHodlTransactionModal = () => {
  const [open, setOpen] = useState(false);

  return { open, setOpen };
};
