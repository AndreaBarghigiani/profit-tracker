// Utils
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { LucideIcon } from "lucide-react";
import type { useHodlTransactionModal } from "@/hooks/useTransactionModal";

// Components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";
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
  Icon?: LucideIcon;
  iconClasses?: string;
  btnVariants?: VariantProps<typeof buttonVariants>;
}

const AddTransactionModal = ({
  children,
  size,
  transactionModal,
  Icon,
  iconClasses,
  btnVariants,
}: AddTransactionModalProps) => {
  return (
    <Dialog
      open={transactionModal.open}
      onOpenChange={transactionModal.setOpen}
    >
      <DialogTrigger asChild>
        <Button {...btnVariants}>
          {!!Icon ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon className={cn(iconClasses)} />
                </TooltipTrigger>
                <TooltipContent className="border-dog-800 text-dog-500">
                  <p>Add transaction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            "Add Transaction"
          )}
        </Button>
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
