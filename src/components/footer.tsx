import Link from "next/link";
import Image from "next/image";

import { footerWords, socialMedia } from "@/lib/constants";
import { MagicButton, TypewriterEffect } from "./ui";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="w-full pt-[6.8rem] md:pt-[9.4rem] pb-20 relative min-h-96 "
    >
      <div className="w-full absolute left-0 bottom-0 min-h-96 z-10">
        <Image
          src="/images/footer-grid.svg"
          alt="footer grid"
          fill
          className="size-full opacity-50 object-cover object-center"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <TypewriterEffect words={footerWords} className=" lg:max-w-[50vw]" />

        <p className="text-white-200 my-0 text-center w-[75vw] lg:max-w-[45vw]">
          Conectemos y Exploremos Juntos el Camino hacia tus Metas.
        </p>

        <Link href="mailto:reiselvalle@gmail.com" className="mt-2 z-50">
          <MagicButton
            title="Pongámonos en Contacto"
            type="button"
            position="right"
            classes="hover:text-purple transition-all"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center mt-4">
        <p className="text-[.8rem] md:text-base md:font-normal font-light text-white-200">
          Copyright © 2024 Reisel
        </p>

        <div className="flex items-center gap-4 mt-4">
          {socialMedia.map(({ id, img, link }) => (
            <Link
              href={link}
              key={id}
              className="group w-8 h-8 flex justify-center items-center bg-golden-200/50 rounded-lg hover:cursor-pointer transition-colors duration-200 z-50"
            >
              <Image
                src={img}
                alt={`${id}`}
                width={18}
                height={18}
                className="cursor-pointer transition-all duration-200 ease-in-out group-hover:scale-125"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <Image
          src="/images/brand.png"
          alt="footer brand"
          width={400}
          height={400}
          className="opacity-75 pointer-events-none"
        />
      </div>
    </footer>
  );
};

export default Footer;
