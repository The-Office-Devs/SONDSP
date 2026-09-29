import type { Strand } from "@/strands/strands.types";

export interface ActivityListItem {
  id: number;
  name: string;
  strand: Strand;
  gradeLevel: string;
  bimester: string; 
  strandImagePath: string; 
  status: boolean;
}

export interface ActivityFilter {
  search?: string;
  status?: boolean;
}

export interface UseActivitiesOption {
  enabled?: boolean;
}

export interface CreateActivityRequest {
  name: string;
  strandId: number;
  gradeLevel: string;
  bimester: string;
  activityModelFile: File;
}
