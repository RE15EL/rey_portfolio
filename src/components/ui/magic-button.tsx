"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagicButtonProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  type: "submit" | "reset" | "button" | undefined;
  icon?: ReactNode;
  position?: "left" | "top" | "right" | "bottom";
  classes?: string;
  handleClick?: () => void;
}

export const MagicButton = ({
  title,
  type,
  icon,
  position = "left",
  classes,
  handleClick,
  ...props
}: MagicButtonProps) => {
  return (
    <button
      type={type}
      className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-golden-300 shadow-md shadow-dark-200 hover:shadow-md hover:shadow-dark-100"
      onClick={handleClick}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#D0AD50_50%,#E2CBFF_100%)]" />
      <span
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 px-5 py-1 text-sm font-medium text-golden-100 backdrop-blur-3xl hover:bg-opacity-50",
          classes
        )}
      >
        {icon && position === "left" && icon}
        {title}
        {icon && position === "right" && icon}
      </span>
    </button>
  );
};
