import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";
import { LearningTrajectoriesDesktop } from "./components/learning-trajectories-desktop";
import { LearningTrajectoriesMobile } from "./components/learning-trajectories-mobile";


export function LearningTrajectoriesPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Trajetórias de Aprendizagem "});

  return isDesktop ? <LearningTrajectoriesDesktop /> : <LearningTrajectoriesMobile />
} 
