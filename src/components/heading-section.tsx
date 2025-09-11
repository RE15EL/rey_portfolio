import { cn } from "@/lib/utils";

interface Props {
  title1: string;
  title2: string;
  headingClasses?: string;
  tittleClasses?: string;
}

export const HeadingSection = ({
  title1,
  title2,
  headingClasses,
  tittleClasses,
}: Props) => {
  return (
    <h1 className={cn("heading", headingClasses)}>
      {title1}
      <span className={cn("text-golden-100", tittleClasses)}> {title2}</span>
    </h1>
  );
};
