// Components
import { Input } from "@/components/ui/input";
import {
  FormControl,
  // FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type DollarInputProps = {
  label: string;
  placeholder?: string;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const DollarInput = ({ label, placeholder, setValue }: DollarInputProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex h-10 items-center rounded-md border border-dog-600 px-3 focus-within:ring-2 focus-within:ring-main-600 focus-within:ring-offset-main-700">
          <span className="focus:text-main-600">$</span>
          <Input
            type="number"
            min={0.01}
            step="any"
            placeholder={placeholder}
            className="h-8 border-none focus:border-none focus:ring-0"
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default DollarInput;
