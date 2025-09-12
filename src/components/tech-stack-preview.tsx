import { TECH_STACK_ITEMS } from "../lib/constants/tech-stack-items";

export const TechStackPreview = () => {
  return (
    <div className="flex gap-1 pr-2.5 w-fit absolute right-0.5 md:bottom-4 lg:top-16">
      <div className="flex flex-col gap-3 lg:-translate-y-6 z-20">
        {TECH_STACK_ITEMS.leftLists.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="py-2 px-3 text-xs md:text-base text-golden-100/50 rounded-xl text-center bg-[#141628ad]"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:-translate-y-6 lg:-translate-y-0 z-10">
        {TECH_STACK_ITEMS.rightLists.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="py-2 px-3 text-xs md:text-base text-golden-100/50 rounded-xl text-center bg-[#10132e65]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
