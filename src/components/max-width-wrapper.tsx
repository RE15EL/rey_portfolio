import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MWWProps {
  className?: string;
  children: ReactNode;
}

export const MaxWidthWrapper = ({ className, children }: MWWProps) => {
  return <div className={cn("h-full mx-auto w-full max-w-screen-lg px-2.5 md:px-20",className)}> {children}</div>;
};
