import { useHeader } from "@/hooks/use-header";
import { LearningTrajectoriesDesktop } from "./learning-trajectories-desktop";

export function LearningTrajectoriesMobile() {
  useHeader({ title: "Trajetórias de Aprendizagem" });
  
  return <LearningTrajectoriesDesktop />
}