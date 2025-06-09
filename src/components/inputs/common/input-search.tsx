import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CircleX, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  placeholder?: string;
  onSearch?: (search: string) => void;
};

export const InputSearch: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const debouncedSearch = useDebouncedCallback(
    (search) => props.onSearch?.(search),
    200,
  );

  useEffect(() => {
    debouncedSearch(value);
  }, [value]);

  return (
    <div className="relative max-w-80">
      <Input
        ref={inputRef}
        className={cn("peer min-w-60 ps-9", Boolean(value) && "pe-9")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={props.placeholder ?? "Pesquisar"}
        type="text"
        aria-label="Pesquisar"
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <Search
          size={16}
          strokeWidth={3}
          aria-hidden="true"
          className="stroke-[#2A62B2]"
        />
      </div>
      {Boolean(value) && (
        <Button
          variant="ghost"
          className="absolute hover:bg-transparent inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <X
            className="stroke-muted-foreground stroke-1"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      )}
    </div>
  );
};
