// Utils
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/string";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

// Types
import type { NextPage } from "next";
import type { Project } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import OnlyAdmin from "@/components/ui/custom/OnlyAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProjectTransactionForm from "@/components/ui/custom/AddProjectTransactionForm";
import ProjectStats from "@/components/ui/custom/ProjectStats";
import LastProjectTransaction from "@/components/ui/custom/LastProjectTransaction";
import ProjectTransactionCard from "@/components/ui/custom/Projects/ProjectTransactionCard";
import { Trash, Plus } from "lucide-react";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const utils = api.useContext();

  const { data: project, isLoading } = api.project.get.useQuery(
    { projectId: router.query.id as string },
    { enabled: !!router.query.id },
  );

  const { data: transactions, isLoading: isLoadingTransactions } =
    api.transaction.list.useQuery(
      {
        projectId: router.query.id as string,
        orderBy: "desc",
      },
      { enabled: !!router.query.id },
    );

  const { mutate: deleteProject } = api.project.delete.useMutation({
    onSuccess: async () => {
      await router.push(`/dashboard/`);
    },
  });

  const { mutate: addInterest } = api.transaction.addInterest.useMutation({
    onSuccess: async () => {
      await utils.wallet.getUserStats.invalidate();
      await utils.project.get.invalidate();
      await utils.transaction.list.invalidate();
    },
  });

  const handleAddInterest = () => {
    if (!project) return;

    addInterest({ projectId: project.id, skip: true });
  };

  if (isLoading) return <div>Loading...</div>;

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-4">
      <header>
        <Heading size={"page"} gradient="gold" spacing={"massive"}>
          {project.name}
        </Heading>
        <p className="text-center">{project.description}</p>
      </header>
      <article>
        <header className="flex items-center">
          <Heading as="h2" size="h2">
            Project Details
          </Heading>
          <div className="ml-auto text-right text-sm">
            <p>Created at: {formatDate(project.createdAt)}</p>
          </div>
        </header>

        <ProjectStats project={project} />

        <LastProjectTransaction className="mb-8 mt-3" project={project} />

        <div className="mb-4 flex">
          <Heading as="h3" size="h3">
            Project transactions
          </Heading>
          <div className="ml-auto flex gap-2">
            <OnlyAdmin>
              <Button variant="adminOutline" onClick={handleAddInterest}>
                <Plus className="mr-2 h-3 w-3" />
                Interest
              </Button>
            </OnlyAdmin>
            <AddTransaction project={project} />
            <Button
              variant="ghost-danger"
              onClick={() => deleteProject(project.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 rounded-md bg-foreground/30">
            <p className="p-3">Amount</p>
            <p className="p-3">Type</p>
            <p className="p-3">Date</p>
          </div>
          {isLoadingTransactions
            ? "Loading..."
            : transactions?.map((transaction) => (
                <ProjectTransactionCard
                  transaction={transaction}
                  key={transaction.id}
                />
              ))}
        </div>
      </article>
    </div>
  );
};

export default ProjectPage;

const AddTransaction = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonVariants()}>
          <Plus className="mr-2 h-3 w-3" />
          Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
          <DialogDescription>
            Here you can add your transaction.
          </DialogDescription>
        </DialogHeader>

        <AddProjectTransactionForm project={project} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
