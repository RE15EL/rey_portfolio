"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import Lottie from "react-lottie";

import animationData from "@/lib/data/confetti.json";
import { MagicButton } from "./magic-button";
import { IconCopy } from "@tabler/icons-react";
import { IBentoGridItem } from "@/types/ui.interface";
import { TechStackPreview } from "../tech-stack-preview";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-2 lg:gap-4 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: IBentoGridItem) => {
  const [copied, setCopied] = useState(false);

  const defaultOptions = {
    loop: false,
    autoplay: copied,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleCopy = () => {
    const text = "reiselvalle@gmail.com";
    navigator.clipboard.writeText(text);
    setCopied(true);

    // openWhatsapp("58126166", "Hola,Quiero más información!");
  };

  return (
    <div
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl group/bento transition duration-200 flex flex-col justify-between space-y-4  border border-transparent hover:border-golden-100 shadow-md shadow-dark-200 hover:shadow-lg hover:shadow-dark-100 bg-gradient-to-r from-[#06050e7b] to-dark-300",
        className
      )}
    >
      {/* add img divs */}
      <div
        className={cn("h-full", {
          "flex justify-center": id === 6,
        })}
      >
        {/* image */}
        <div className="w-full absolute">
          {img && (
            <Image
              src={img}
              alt={img}
              height={800}
              width={800}
              className={cn(imgClassName, "object-contain object-right-top", {
                "-translate-y-10 md:-translate-y-0": id === 1,
              })}
            />
          )}
        </div>

        <div
          className={cn("absolute ", {
            "left-0 top-0": id === 1,
            "w-full right-0 -bottom-5 opacity-80": id === 5,
          })}
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt={spareImg}
              // fill
              width={200}
              height={200}
              className="object-contain object-center"
            />
          )}
        </div>

        {/* {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )} */}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>

          <div
            className={cn(
              "font-sans text-lg lg:text-3xl max-w-96 md:max-w-[40rem] font-bold z-10",
              {
                "hidden md:block md:text-center md:max-w-full": id === 1,
              }
            )}
          >
            {title}
          </div>

          {/* Tech stack list div */}
          {id === 3 && <TechStackPreview />}

          {id === 6 && (
            <div className="mt-5 relative">
              <div
                className={cn("absolute -bottom-5 right-0", {
                  block: copied,
                })}
              >
                <Lottie options={defaultOptions} height={200} width={400} />
              </div>

              <MagicButton
                type="button"
                title={copied ? "Email copiado!" : "Copie mi email"}
                icon={<IconCopy />}
                position="right"
                handleClick={handleCopy}
                classes="!bg-[#161A31]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
