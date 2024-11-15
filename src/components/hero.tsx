import Link from "next/link";
import { Heading } from "./heading";
import { BackgroundBeamsWithCollision, MagicButton } from "./ui";

export const Hero = () => {
  return (
    <BackgroundBeamsWithCollision className="h-screen grid place-items-center">
      <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[54vw] grid place-items-center text-center">
        <Heading className="bg-gradient-to-r from-golden-300 via-golden-100 to-golden-300 bg-no-repeat text-transparent bg-clip-text font-extrabold">
          Dando Vida a Ideas Creando Experiencias Excepcionales
        </Heading>

        <p className="max-w-[80%] md:tracking-wider my-8 md:mt-8 md:mb-12 text-sm md:text-lg lg:text-2xl">
          Hola, soy Reisel Valle - Ingeniero Informático Apasionado por Crear
          Soluciones Web Innovadoras y Confiables
        </p>

        <Link href="#projects">
          <MagicButton type="button" title="Ver mis proyectos" />
        </Link>
      </div>
    </BackgroundBeamsWithCollision>
  );
};
