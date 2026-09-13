export interface StrandDTO {
  id: number;
  name: string;
  subject: string;
  status: boolean;
}

export interface ActivityListItem {
  id: number;
  name: string;
  strand: StrandDTO;
  schoolYear: string;
  bimester: string; 
  strandImagePath: string; 
  status: boolean;
}
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}