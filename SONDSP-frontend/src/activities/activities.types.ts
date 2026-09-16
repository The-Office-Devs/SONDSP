import type { Strand } from "@/strands/strands.types";

export interface ActivityListItem {
  id: number;
  name: string;
  strand: Strand;
  schoolYear: string;
  bimester: string; 
  strandImagePath: string; 
  status: boolean;
}

export interface ActivityFilter {
  search?: string;
  status?: boolean;
}

export interface CreateActivityRequest {
  name: string;
  strandId: number;
  schoolYear: string;
  bimester: string;
  activityModelFile: File;
}
