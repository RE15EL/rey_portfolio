"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HeadingSection } from "./heading-section";
import { workExperienceCards } from "@/lib/constants";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export const Experience = () => {
  return (
    <div id="experience" className="py-20">
      <HeadingSection title1="Mi" title2="Experiencia" />
      <div className="w-full mt-12 md:mt-36">
        <ExpandableCardDemo />
      </div>
    </div>
  );
};

function ExpandableCardDemo() {
  const [active, setActive] = useState<
    (typeof workExperienceCards)[number] | boolean | null
  >(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* overlay */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* modal */}
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] bg-black-100/20">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 md:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full sm:h-fit md:max-h-[90%] flex flex-col gap-6 justify-center items-center py-4 bg-slate-900/50 sm:rounded-3xl overflow-hidden border border-golden-100 shadow-2xl shadow-golden-100"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-64 md:h-52 object-cover object-top"
                />
              </motion.div>

              <div className="w-[80%]">
                <div className="space-y-2 lg:space-y-1 w-full grid place-items-center">
                  <div className=" text-center">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-sans text-lg md:text-base font-bold text-golden-200 leading-4"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="font-sans font-extralight text-xs text-center text-golden-100/50 pt-2"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>

                <div className="pt-2 md:pt-4 relative w-full px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-golden-100/80 font-extralight text-sm md:text-base h-40 md:h-fit pb-10 flex flex-col items-center gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="max-w-[86%] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {workExperienceCards.map((card) => (
          // cards
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 bg-slate-900/50 shadow-md shadow-dark-100 hover:shadow-lg border border-transparent hover:border-golden-100 rounded-xl cursor-pointer"
          >
            <div className="grid grid-cols-1 place-items-center gap-2 md:gap-4 md:grid-cols-3">
              {/* image */}
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-20 w-20 md:h-24 md:w-24 rounded-lg object-cover object-top"
                />
              </motion.div>

              {/* title & desc */}
              <div className="md:col-span-2 w-full text-center md:text-left space-y-2 lg:space-y-1">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-sans text-lg md:text-base font-bold text-purple leading-4"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="font-sans font-extralight text-xs text-center md:text-left text-[#C1C2D3]"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
