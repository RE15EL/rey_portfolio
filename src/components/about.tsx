import { BentoGrid, BentoGridItem } from "./ui";
import { aboutItems } from "@/lib/constants";

export const About = () => {
  return (
    <section id="about" className="min-w-full">
      <BentoGrid className="max-w-full mx-auto py-4 lg:py-6 md:auto-rows-[20rem]">
        {aboutItems.map(
          ({
            id,
            title,
            description,
            className,
            img,
            imgClassName,
            titleClassName,
            spareImg,
          }) => (
            <BentoGridItem
              id={id}
              key={`item_${id}`}
              title={title}
              description={description}
              className={className}
              img={img}
              imgClassName={imgClassName}
              titleClassName={titleClassName}
              spareImg={spareImg}
            />
          )
        )}
      </BentoGrid>
    </section>
  );
};
