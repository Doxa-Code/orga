import { Paragraph } from "@/components/common/typograph";
import { Button } from "@orga/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@orgapover";

type Props = {
  title: string;
  options: {
    label: string;
    onSelect(): void;
  }[];
};

export const ButtonPopover: React.FC<Props> = (props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-[#1B9B44] font-bold hover:bg-[#1B9B44]">
          {props.title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] border bg-white p-0" align="start">
        <div className="w-full flex-1 rounded bg-white py-2">
          {props.options?.map((option) => (
            <PopoverClose key={option.label} asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start rounded"
                onClick={() => {
                  option.onSelect();
                }}
              >
                <Paragraph className="font-light text-slate-800">
                  {option.label}
                </Paragraph>
              </Button>
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
