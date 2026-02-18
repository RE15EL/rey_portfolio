import dynamic from "next/dynamic";

import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { RecentProjects } from "@/components/projects";
import { navItems } from "@/lib/constants/menu";
import { createProjectsModule } from "@/modules/projects/infrastructure/projects-module";

const Experience = dynamic(
  () => import("@/components/experience").then((mod) => mod.Experience),
  { ssr: false }
);

const FloatingNav = dynamic(
  () =>
    import("@/components/ui/floating-navbar").then((mod) => mod.FloatingNav),
  { ssr: false }
);

export default async function Home() {
  const projectsModule = await createProjectsModule();
  const projects = await projectsModule.listPublishedProjects.execute();

  return (
    <MaxWidthWrapper>
      <FloatingNav navItems={navItems} />
      <Hero />
      <About />
      <RecentProjects projects={projects} />
      <Experience />
      <Footer />
    </MaxWidthWrapper>
  );
}
