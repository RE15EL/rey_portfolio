import { About, FloatingNav, Hero, MaxWidthWrapper } from "@/components";
import { navItems } from "@/lib/constants";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <FloatingNav navItems={navItems} />
      <Hero />
      <About />
    </MaxWidthWrapper>
  );
}
