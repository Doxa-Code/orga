"use client";

import * as Icons from "@/components/common/icons";
import { Paragraph } from "@/components/common/typograph";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select as SelectContainer,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { cn, compareStrings } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface SelectProps<T> {
  options?: T[];
  selected?: T[keyof T] | null | number;
  label: keyof T;
  value: keyof T;
  setSelected(option: string | null): void;
  render?: (option: T) => ReactNode;
  noAddButton?: boolean;
  noSearchInput?: boolean;
  onAdd?: () => void;
  disabled?: boolean;
  className?: string;
  noClearButton?: boolean;
}

export function Select<T>(props: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const selected = (props.options || []).find(
    (option) => String(option[props.value]) === String(props.selected),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputSearchRef.current) {
        inputSearchRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <SelectContainer open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "h-10 !grow overflow-hidden flex rounded border border-gray-300 !text-sm text-gray-800 hover:bg-transparent",
          props.className,
        )}
      >
        <SelectTrigger
          className="h-10 px-0 rounded border-none shadow-none"
          asChild
        >
          <Button
            type="button"
            disabled={props.disabled}
            variant="ghost"
            onClick={() => setOpen(true)}
            className="px-2 grow justify-start hover:bg-transparent"
          >
            <div className="flex-1 max-w-44 py-1 truncate text-left text-sm font-light text-slate-800">
              {selected &&
                (props.render
                  ? props.render(selected)
                  : String(selected[props.label]))}
            </div>
          </Button>
        </SelectTrigger>
        <Button
          data-hidden={!selected || props.noClearButton}
          type="button"
          variant="ghost"
          className="p-0 w-7 hover:bg-transparent"
          onClick={() => {
            props.setSelected("");
            setOpen(false);
          }}
        >
          <X size={14} className="stroke-sky-900/80 stroke-2" />
        </Button>
        <Button
          type="button"
          disabled={props.disabled}
          variant="ghost"
          onClick={() => setOpen(true)}
          className="p-0 w-10 hover:bg-transparent"
        >
          <ChevronDown size={20} className="stroke-sky-900 stroke-2" />
        </Button>
      </div>

      <SelectContent position="popper" align="start" className="w-[282px] p-0">
        <Command
          className="p-0"
          filter={(value, text) => {
            const currentOption = (props.options || []).find(
              (option) => option[props.value] === value,
            );

            if (!currentOption) {
              return 0;
            }

            return compareStrings(currentOption[props.label]! as string, text)
              ? 1
              : 0;
          }}
        >
          {props.noSearchInput ? null : (
            <div className="bg-gray-50 px-2 py-2 border-b">
              <CommandInput
                ref={inputSearchRef}
                className="rounded border border-gray-300 font-light text-slate-800"
              />
            </div>
          )}
          <CommandList>
            <CommandEmpty className="px-2 pb-2 pt-4">
              <Paragraph className="text-sm">Nada encontrado...</Paragraph>
            </CommandEmpty>
            <CommandGroup className="w-auto overflow-auto">
              {props?.options?.map((option) => (
                <CommandItem
                  key={String(option[props.value]) || ""}
                  value={String(option[props.value]) || ""}
                  disabled={false}
                  onSelect={(currentValue) => {
                    props.setSelected(currentValue);
                    setOpen(false);
                  }}
                  className="rounded-none py-3 !text-sm font-light text-slate-800"
                >
                  {props.render ? (
                    props.render(option)
                  ) : (
                    <>{option[props.label]}</>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {!props.noAddButton && (
              <Button
                type="button"
                onClick={props.onAdd}
                className="sticky bottom-0 z-[999] flex w-full select-none items-center justify-start gap-2 border-t bg-white px-3 py-2 text-sm !font-medium !text-primary shadow hover:!bg-primary hover:!text-white"
              >
                <Icons.Plus className="size-4" /> Novo
              </Button>
            )}
          </CommandList>
        </Command>
      </SelectContent>
    </SelectContainer>
  );
}
