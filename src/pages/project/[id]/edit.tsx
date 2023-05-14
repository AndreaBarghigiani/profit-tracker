// Utils
import { api } from "@/utils/api";
import { useForm, Controller } from "react-hook-form";
import { uppercaseFirst } from "@/utils/string";
import { Frequency } from "@prisma/client";
import { getProject } from "@/server/api/routers/project";
import { prisma } from "@/server/db";
import { useRouter } from "next/router";

// Types
import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type EditProjectValues,
  EditProjectValuesSchema,
} from "@/server/types";

// Components
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditProjectPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project }) => {
  const router = useRouter();
  const formOptions = {
    resolver: zodResolver(EditProjectValuesSchema),
    defaultValues: project,
  };

  const { register, handleSubmit, control } =
    useForm<EditProjectValues>(formOptions);

  const { mutate } = api.project.update.useMutation({
    onSuccess: async () => {
      await router.push(`/project/${project.id}`);
    },
  });

  const onSubmit: SubmitHandler<EditProjectValues> = (data) => {
    data.id = project.id;
    data.increaseFrequency = Frequency[data.increaseFrequency] as Frequency;
    console.log("you want to submit");
    mutate(data);
  };

  if (!project) return <div>Project not found</div>;

  return (
    <>
      <main className="container mx-auto">
        <Heading size="page" gradient="gold" spacing="massive">
          Edit Project
        </Heading>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              type="text"
              placeholder="My new fantastic project"
              id="name"
              {...register("name")}
            />
          </div>

          <div>
            <Label htmlFor="description">Project description</Label>
            <Textarea
              id="description"
              placeholder="Add a description if you wish"
              {...register("description")}
            />
          </div>

          <section className="flex items-end gap-5">
            <div>
              <Label htmlFor="increaseFrequency">Project frequency</Label>
              <Controller
                control={control}
                name="increaseFrequency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Frequency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Frequency).map((f: Frequency) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={f}
                          value={f}
                        >
                          {uppercaseFirst(f)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="increaseAmount">Increase Amount</Label>
              <Input
                type="number"
                id="increaseAmount"
                step=".01"
                {...register("increaseAmount", { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center">
              <Label htmlFor="compound">Does it compound?</Label>
              <Controller
                control={control}
                name="compound"
                render={({ field }) => (
                  <Switch
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    ref={field.ref}
                    className="ml-2"
                  />
                )}
              />
            </div>
          </section>

          <footer className="flex items-center justify-end gap-x-3">
            <Button variant={"outline"}>Cancel</Button>
            <Button type="submit">Update Project</Button>
          </footer>
        </form>
      </main>
    </>
  );
};

export default EditProjectPage;

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
