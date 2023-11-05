// Components
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type DollarInputProps = {
  label?: string;
  value?: number | string;
  placeholder?: string;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

const DollarInput = ({
  label,
  placeholder,
  value,
  setValue,
}: DollarInputProps) => {
  return (
    <FormItem>
      {!!label && <FormLabel>{label}</FormLabel>}

      <FormControl>
        <div className="group flex h-10 items-center rounded-md border border-dog-600 px-3 focus-within:ring-2 focus-within:ring-main-600 focus-within:ring-offset-main-700">
          <span className="group-focus-within:text-main-600 ">$</span>
          <Input
            type="text"
            min={0}
            step="any"
            placeholder={placeholder}
            value={value}
            className="h-8 border-none focus:border-none focus:ring-0"
            onChange={(e) => setValue(Math.abs(parseFloat(e.target.value)))}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default DollarInput;
