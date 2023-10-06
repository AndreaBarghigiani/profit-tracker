// Utils
import { api } from "@/utils/api";

// Components
import { Button } from "@/components/ui/button";

const DeleteModal = ({
  transactionId,
  setOpen,
}: {
  transactionId: string;
  setOpen: (boolean: boolean) => void;
}) => {
  const utils = api.useContext();

  const { mutate: deleteTransaction } = api.transaction.delete.useMutation({
    onSuccess: async () => {
      await utils.hodl.getTransactions.invalidate();
      setOpen(false);
    },
  });

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        onClick={() => {
          setOpen(false);
        }}
      >
        Cancel
      </Button>

      <Button
        variant="destructive"
        onClick={() => {
          deleteTransaction({ transactionId });
        }}
      >
        Yes, delete
      </Button>
    </div>
  );
};

export default DeleteModal;
