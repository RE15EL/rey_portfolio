import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MWWProps {
  className?: string;
  children: ReactNode;
}

export const MaxWidthWrapper = ({ className, children }: MWWProps) => {
  return (
    <div
      className={cn(
        "relative mx-auto size-full max-w-screen-xl px-3 sm:px-4 md:px-20",
        className
      )}
    >
      {" "}
      {children}
    </div>
  );
};
