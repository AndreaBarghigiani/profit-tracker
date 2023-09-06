// Utils
import { api } from "@/utils/api";
import { useState } from "react";

// Types
import type { Session } from "next-auth";

// Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ChangesModal = ({ session }: { session: Session | null }) => {
  const [open, setOpen] = useState(false);
  const MODAL_ID = "merge_multiple_hodl_positions";

  const { data: user } = api.user.getRedisUser.useQuery(undefined, {
    onSuccess: (data) => {
      setOpen(!data?.modals[MODAL_ID]);
    },
    enabled: !!session?.user?.id,
  });

  const setModal = async () => {
    if (!session?.user?.id || !!user) return;

    await fetch("/api/user/acceptMessage", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        modalId: "merge_multiple_hodl_positions",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleCloseModal = async () => {
    setOpen(false);
    await setModal();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            There&apos;s been a change!
          </DialogTitle>
        </DialogHeader>
        <section className="space-y-2 text-dog-400">
          <p className="text-xl font-semibold">👋 Hi all, Andrea here.</p>
          <p>
            This is just a quick message in order to tell you that I&#39;ve
            pushed a significant change in the logic of the platform. It is not
            possible to have multiple Hodl positions, and if you were affected
            you have to do nothing.
          </p>
          <p>
            All the transaction that were spread should be merged automatically,
            but if you encounter any issues feel free to contact me in the
            Underdog Investors Group or via the Feedback feature above.
          </p>
        </section>

        <DialogFooter>
          <Button variant="default" size="sm" onClick={handleCloseModal}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangesModal;
