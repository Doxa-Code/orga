import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
type Props = {
  tabsName: string[];
};
export const TabListSession: React.FC<Props> = ({ tabsName = [] }) => {
  return (
    <TabsList className="border-b-2 rounded-none w-full justify-start bg-transparent">
      {tabsName.map((tab) => (
        <TabsTrigger
          key={tab}
          className="!shadow-none data-[state=active]:text-primary data-[state=active]:border-b-4 w-full max-w-[200px] rounded-none data-[state=active]:border-b-primary text-gray-800 py-2 text-sm"
          value={tab}
        >
          {tab}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
