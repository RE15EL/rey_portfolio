import Image from "next/image";
import { PinContainer } from "./ui";
// import { LocateIcon } from "lucide-react";
import { projects } from "@/lib/constants/projects";

export const RecentProjects = () => {
  return (
    <div id="projects" className="py-20">
      <h1 className="heading ">
        Explora <span className="text-golden-100">Mis Proyectos</span>
      </h1>

      {/* projects cards */}
      <div className="flex flex-wrap justify-center items-center p-4 md:gap-x-20 gap-y-4 md:gap-y-0 mt-10">
        {projects.map(({ des, iconLists, id, img, link, title }) => (
          <div
            key={id}
            className="flex items-center justify-center w-full md:w-96 h-[24rem] lg:min-h-[32rem]"
          >
            <PinContainer title={title} href={link} containerClassName="w-full">
              <div className="relative flex justify-center items-center w-full h-[20vh] lg:h-[30vh] sm:w-96 mb-10 overflow-hidden">
                <div className="size-full">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-fill rounded-t-lg "
                  />
                </div>
              </div>

              <h1 className="font-bold text-golden-100 text-base md:text-xl lg:text-2xl line-clamp-1">
                {title}
              </h1>

              <p className="text-sm lg:text-[1rem] lg:font-normal font-light line-clamp-2 mt-2 mb-12">
                {des}
              </p>

              <div className="flex items-center justify-between mt-4 mb-3">
                <div className="flex items-center">
                  {iconLists.map((icon, index) => (
                    <div
                      key={icon}
                      className=" rounded-full w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index * 2}px)`,
                      }}
                    >
                      <Image
                        src={icon}
                        alt={icon}
                        width={40}
                        height={40}
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};
