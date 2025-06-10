"use client";

import { Paragraph } from "@/components/common/typograph";
import { ChevronDown } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2, Plus, SearchIcon, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface SelectProps<T = string> {
  options?: T[];
  selected?: T | null;
  label?: keyof T;
  value?: keyof T;
  render?: (option: T) => ReactNode;
  onAdd?: () => void;
  disabled?: boolean;
  className?: string;
  noAddButton?: boolean;
  noSearchInput?: boolean;
  noClearButton?: boolean;
  onSearch?: (search: string) => void;
  isSearching?: boolean;
  name?: string;
  onSelect?: (value: T | null) => void;
}

export function Select<T>(props: SelectProps<T>) {
  const [value, setValue] = useState(props.selected || null);
  const [open, setOpen] = useState(false);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputSearchRef.current) {
        inputSearchRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (value !== props.selected) {
      props.onSelect?.(value);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "h-10 w-full flex items-center justify-between rounded relative overflow-hidden border border-border !text-sm text-gray-800 hover:bg-transparent",
          props.className
        )}
      >
        <PopoverTrigger className="h-10 px-2 rounded text-ellipsis border-none text-left text-nowrap truncate font-light max-w-[300px] shadow-none cursor-pointer w-full">
          <input
            type="hidden"
            name={props.name}
            value={
              value && props.value && typeof value === "object"
                ? (value as any)[props.value]
                : value && typeof value !== "object"
                  ? value
                  : ""
            }
          />
          {value &&
            (props.render
              ? props.render(value)
              : typeof value === "string"
                ? value
                : props.label && String(value[props.label]))}
        </PopoverTrigger>
        <div className="flex absolute right-0 items-center gap-2 pr-3">
          <Button
            data-hidden={!value || props.noClearButton}
            type="button"
            variant="ghost"
            size="icon"
            className="p-0 block w-min hover:bg-transparent"
            onClick={() => {
              setValue(null);
              setOpen(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            disabled={props.disabled}
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="p-0 w-min hover:bg-transparent"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <PopoverContent align="start" className="!p-0 z-[9999] rounded">
        <Command className="!p-0 z-[9999]">
          <div
            data-hidden={props.noSearchInput}
            className="bg-background overflow-hidden grid p-2 border-b border-border"
          >
            {props.onSearch ? (
              <div className="flex rounded bg-white border pl-2 border-border items-center gap-0">
                <SearchIcon className="size-4 stroke-[#88ACC5]" />
                <Input
                  onChange={(e) => props.onSearch?.(e.target.value)}
                  className="border-none shadow-none font-light"
                />
              </div>
            ) : (
              <CommandInput
                ref={inputSearchRef}
                className="rounded border border-border font-light"
              />
            )}
          </div>
          {props.isSearching && (
            <div className="flex items-center justify-center p-2 gap-2">
              <Loader2 className="size-4 animate-spin" />
              <Paragraph className="text-sm">Buscando...</Paragraph>
            </div>
          )}

          <CommandList className="!p-0">
            <CommandEmpty
              data-hidden={props.isSearching}
              className="px-2 pb-2 pt-2"
            >
              <Paragraph className="text-sm">Nada encontrado...</Paragraph>
            </CommandEmpty>
            <CommandGroup data-hidden={props.isSearching} className="p-0">
              {props.options?.map((option) => {
                const value =
                  typeof option === "string"
                    ? option
                    : props.value && String(option[props.value]);
                return (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      const selected = props.options?.find((option) => {
                        if (typeof option === "string") {
                          return option === currentValue;
                        }
                        return (
                          props.value && option[props.value] === currentValue
                        );
                      });

                      setValue(selected ?? null);
                      setOpen(false);
                    }}
                    className="rounded-none p-3 !text-sm font-light text-slate-800"
                  >
                    {props.render
                      ? props.render(option)
                      : typeof option === "string"
                        ? option
                        : props.label && String(option[props.label])}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <Button
              data-hidden={props.noAddButton}
              type="button"
              onClick={props.onAdd}
              className="sticky bottom-0 z-[999] flex w-full select-none rounded-none items-center justify-start gap-2 border-t bg-white px-3 py-2 text-sm !font-medium !text-primary shadow hover:!bg-primary hover:!text-white"
            >
              <Plus className="size-4" /> Novo
            </Button>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
