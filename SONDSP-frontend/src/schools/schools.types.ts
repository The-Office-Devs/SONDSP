export interface School {
  id: number;
  name: string;
  principalName: string;
  status: boolean;
}

export interface SchoolFilter {
  search?: string
}

export interface CreateSchoolRequest {
  name: string;
  principalName: string;
  status: boolean;
}

export type UpdateSchoolRequest = CreateSchoolRequest;
