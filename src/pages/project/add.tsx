// Utils
import { useForm, Controller } from "react-hook-form";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { uppercaseFirst } from "@/utils/string";
import { Frequency } from "@prisma/client";
import { useRouter } from "next/router";

// Types
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";
import { ProjectValuesSchema, type ProjectValues } from "@/server/types";

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

const AddProject: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<ProjectValues>({
    resolver: zodResolver(ProjectValuesSchema),
    defaultValues: {
      increaseFrequency: Frequency.DAILY,
      compound: false,
    },
  });

  const { mutate } = api.project.create.useMutation({
    onSuccess: async () => {
      await router.push(`/projects/`);
    },
  });

  const onSubmit: SubmitHandler<ProjectValues> = (data) => {
    data.increaseFrequency = Frequency[data.increaseFrequency] as Frequency;
    mutate(data);
  };

  return (
    <main className="container mx-auto">
      <Heading size="page" gradient="gold" spacing="massive">
        Add Project
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
            <Label htmlFor="initial">Initial Deposit</Label>
            <Input
              type="number"
              id="initial"
              step=".01"
              {...register("initial", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="increaseFrequency">Project frequency</Label>
            <Controller
              control={control}
              name="increaseFrequency"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Frequency..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Frequency).map((f: Frequency) => (
                      <SelectItem className="cursor-pointer" key={f} value={f}>
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

        <Button type="submit">Save Project</Button>
      </form>
    </main>
  );
};

export default AddProject;
