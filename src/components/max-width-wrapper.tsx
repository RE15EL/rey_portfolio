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
        "size-full max-w-screen-xl mx-auto px-2.5 md:px-20 relative",
        className
      )}
    >
      {" "}
      {children}
    </div>
  );
};
