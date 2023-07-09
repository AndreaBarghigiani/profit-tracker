// Utils
import { api } from "@/utils/api";
import { useForm, Controller } from "react-hook-form";
import { uppercaseFirst } from "@/utils/string";
import { getProject } from "@/server/api/routers/project";
import { prisma } from "@/server/db";

// Types
import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ProjectTransaction,
  ProjectTransactionSchema,
} from "@/server/types";
import { TransactionType } from "@prisma/client";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleItem } from "@/components/ui/toggle-group";

const AddProjectPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project }) => {
  const formOptions = {
    resolver: zodResolver(ProjectTransactionSchema),
    defaultValues: {
      type: TransactionType.DEPOSIT,
      amount: 0,
      evaluation: 0,
      projectId: project.id,
    },
  };

  const {
    register,
    handleSubmit,
    control,
    // watch,
    // formState: { errors },
  } = useForm<ProjectTransaction>(formOptions);

  const { mutate } = api.project.transaction.useMutation({
    // onSuccess: async () => {
    //   await router.push(`/project/${project.id}`);
    // },
  });

  const onSubmit: SubmitHandler<ProjectTransaction> = (data) => {
    data.evaluation = data.amount;
    mutate(data);
  };

  const allowedTypes = ["DEPOSIT", "WITHDRAW"];

  if (!project) return <div>Project not found</div>;

  return (
    <>
      <main className="container mx-auto">
        <Heading size="page" gradient="gold" spacing="massive">
          Add a new transaction to {project.name}
        </Heading>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="amount">Transaction Amount</Label>
            <Input
              type="number"
              id="amount"
              step="any"
              {...register("amount", { valueAsNumber: true })}
            />
            <Input
              type="hidden"
              id="evaluation"
              step="any"
              {...register("evaluation", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    className="flex justify-center"
                    onValueChange={field.onChange}
                  >
                    {allowedTypes.map((t) => (
                      <ToggleItem key={t} value={t}>
                        {uppercaseFirst(t)}
                      </ToggleItem>
                    ))}
                  </ToggleGroup>
                </>
              )}
            />
          </div>

          <footer className="flex items-center justify-end gap-x-3">
            <Button variant={"outline"}>Cancel</Button>
            <Button type="submit">Update Project</Button>
          </footer>
        </form>
      </main>
    </>
  );
};

export default AddProjectPage;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  if (!context.params?.id) return;

  const project = await getProject({
    projectId: context.params?.id,
    prisma,
  });

  const massaged = {
    id: project.id,
    name: project.name,
    description: project.description,
    compound: project.compound,
    increaseAmount: project.increaseAmount,
    increaseFrequency: project.increaseFrequency,
  };

  return {
    props: {
      project: massaged,
    },
  };
}
