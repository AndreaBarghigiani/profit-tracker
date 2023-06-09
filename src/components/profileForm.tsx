/* eslint-disable @typescript-eslint/no-misused-promises */
// Utils
import { api } from "@/utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Types
import type { SubmitHandler } from "react-hook-form";

// Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const ProfileValuesSchema = z.object({
  dailyProfit: z.number().min(0),
});

type ProfileValues = z.infer<typeof ProfileValuesSchema>;
const ProfileForm = ({ profileData }: { profileData: ProfileValues }) => {
  const { mutate } = api.wallet.updateDaily.useMutation();

  const { register, handleSubmit } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileValuesSchema),
    defaultValues: {
      dailyProfit: profileData.dailyProfit,
    },
  });

  const onSubmit: SubmitHandler<ProfileValues> = (data) => {
    mutate(data);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="dailyProfit">Daily Profit</Label>
      <Input
        type="number"
        {...register("dailyProfit", { valueAsNumber: true })}
      />
      <Button variant="active" size="lg" type="submit">
        Save Profile
      </Button>
    </form>
  );
};

export default ProfileForm;
