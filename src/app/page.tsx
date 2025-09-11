import {
  About,
  Experience,
  Footer,
  Hero,
  MaxWidthWrapper,
  RecentProjects,
} from "@/components";
import { FloatingNav } from "@/components/ui";
import { navItems } from "@/lib/constants";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <FloatingNav navItems={navItems} />
      <Hero />
      <About />
      <RecentProjects />
      <Experience />
      <Footer />
    </MaxWidthWrapper>
  );
}
