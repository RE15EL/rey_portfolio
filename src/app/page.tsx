import dynamic from "next/dynamic";

import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { RecentProjects } from "@/components/projects";
import { navItems } from "@/lib/constants/menu";

const Experience = dynamic(
  () => import("@/components/experience").then((mod) => mod.Experience),
  { ssr: false }
);

const FloatingNav = dynamic(
  () =>
    import("@/components/ui/floating-navbar").then((mod) => mod.FloatingNav),
  { ssr: false }
);

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
