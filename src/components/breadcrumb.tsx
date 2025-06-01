import {
  Breadcrumb as Base,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

type Props = {
  routes: string[];
};

export const Breadcrumb: React.FC<Props> = (props) => {
  return (
    <Base>
      <BreadcrumbList>
        {props.routes?.map((route, i) => {
          return (
            <React.Fragment key={route}>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-base text-[#020304]">
                  {route}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator
                className="text-[#020304]"
                data-hidden={i === props.routes.length - 1}
              />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Base>
  );
};
