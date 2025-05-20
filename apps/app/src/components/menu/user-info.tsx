"use client";

import { getPayload } from "@/app/actions/auth";
import { Heading, Logo, Paragraph } from "@/components/common/typograph";
import { Avatar, AvatarFallback } from "@orga/ui/avatar";
import { Skeleton } from "@orgaeleton";
import { useEffect } from "react";
import { useServerAction } from "zsa-react";

export function UserInfo() {
  const { data, execute, status } = useServerAction(getPayload);
  const name = data?.payload?.user?.name || "Budget Saas User";
  const email = data?.payload?.user?.email || "Not identifier";

  useEffect(() => {
    execute();
  }, []);

  if (status !== "success") {
    return (
      <Skeleton className="my-4 flex w-full items-center gap-2 bg-secondary/10 px-4 py-6">
        <div>
          <Skeleton className="h-10 w-10 rounded-full bg-secondary" />
        </div>
        <div className="flex w-full flex-col gap-2 p-2">
          <Skeleton className="h-3 w-20 bg-secondary" />
          <Skeleton className="h-3 w-full bg-secondary" />
        </div>
      </Skeleton>
    );
  }

  return (
    <div className="my-4 flex items-center gap-2 bg-secondary/10 px-4 py-6">
      <div>
        <Avatar>
          <AvatarFallback className="bg-secondary text-white">
            <Logo className="select-none text-sm">
              {name
                ?.split(" ")
                ?.map((word) => word.at(0))
                ?.filter((_, i) => i < 2)
                ?.join("")}
            </Logo>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex select-none flex-col p-2">
        <Heading level={2} className="text-sm text-secondary">
          {name}
        </Heading>
        <Paragraph className="w-44 truncate text-xs text-secondary">
          {email}
        </Paragraph>
      </div>
    </div>
  );
}
