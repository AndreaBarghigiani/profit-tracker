// Utils
import { buttonVariants } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
import type { VariantProps } from "class-variance-authority";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { useHodlTransactionModal } from "@/hooks/useTransactionModal";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const contentVariants = cva("w-full", {
  variants: {
    size: {
      default: "sm:max-w-lg",
      large: "sm:max-w-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface AddTransactionModalProps
  extends DialogProps,
    VariantProps<typeof contentVariants> {
  transactionModal: ReturnType<typeof useHodlTransactionModal>;
}

const AddTransactionModal = ({
  children,
  size,
  transactionModal,
}: AddTransactionModalProps) => {
  return (
    <Dialog
      open={transactionModal.open}
      onOpenChange={transactionModal.setOpen}
    >
      <DialogTrigger asChild>
        <Button className={buttonVariants()}>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className={cn(contentVariants({ size }))}>
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
          <DialogDescription>
            Here you can add your transaction.
          </DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
