import {
  Breadcrumb as Base,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

type Props = {
  routes: (
    | {
        url?: string;
        label: string;
      }
    | string
  )[];
};

export const Breadcrumb: React.FC<Props> = (props) => {
  return (
    <Base>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home size={15} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {props.routes?.map((route) => {
          if (typeof route !== "string") {
            return (
              <React.Fragment key={route.label}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={route.url || "#"}>
                    <Home size={15} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={route}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{route}</BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Base>
  );
};
