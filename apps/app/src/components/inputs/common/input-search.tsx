import { Input } from "@orga/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  onSearch?: (search: string) => void;
};
export const InputSearch: React.FC<Props> = (props) => {
  const debouncedSearch = useDebouncedCallback(
    (search) => props.onSearch?.(search),
    200,
  );
  return (
    <div className="flex border bg-background overflow-hidden border-slate-300 rounded">
      <Input
        className="border-none rounded-none min-w-60 bg-white"
        value={props.value || ""}
        onChange={(e) => {
          props.onChange?.(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder={props.placeholder}
      />
      <div className="w-12 max-h-10 border-l border-slate-300 bg-transparent flex justify-center items-center">
        <Search strokeWidth={2} size={20} className="text-sky-800" />
      </div>
    </div>
  );
};
