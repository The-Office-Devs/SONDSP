// Ajustar quando o back tiver pronto
export interface ActivityListItem {
  id: number;
  name: string;
  subject?: string;
  strand?: string;
  schoolYear: string;
  bimester: string;
  activityModelRef: /*File*/ string;
  status: boolean;
}

export interface CreateActivityRequest {
  name: string;
  strandId: number;
  schoolYear: string;
  activityModelFile: File;
  bimester: string;
}