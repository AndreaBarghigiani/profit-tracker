/* eslint-disable @typescript-eslint/no-misused-promises */
// Utils
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { uppercaseFirst } from "@/utils/string";
import { Frequency } from "@prisma/client";

// Types
import type { NextPage } from "next";
import type { SubmitHandler } from "react-hook-form";

// Components
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

export const ProjectValuesSchema = z.object({
  name: z.string(),
  description: z.string(),
  currentHolding: z.number(),
  initial: z.number(),
  increaseFrequency: z.nativeEnum(Frequency),
  increaseAmount: z.number(),
  compound: z.boolean(),
});

type ProjectValues = z.infer<typeof ProjectValuesSchema>;

const AddProject: NextPage = () => {
  const { register, handleSubmit, control } = useForm<ProjectValues>({
    resolver: zodResolver(ProjectValuesSchema),
    defaultValues: {
      increaseFrequency: Frequency.DAILY,
      compound: false,
    },
  });

  const { mutate } = api.project.create.useMutation();

  const onSubmit: SubmitHandler<ProjectValues> = (data) => {
    data.increaseFrequency = Frequency[data.increaseFrequency] as Frequency;
    data.currentHolding = data.initial;
    mutate(data);
  };

  return (
    <>
      <main className="container mx-auto">
        <h1 className="text-3xl font-semibold">Add Project</h1>

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

          <Button type="submit">Save Project</Button>
        </form>
      </main>
    </>
  );
};

export default AddProject;
