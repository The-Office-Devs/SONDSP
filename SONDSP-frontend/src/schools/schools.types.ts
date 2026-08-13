export interface School {
  id: number;
  name: string;
  principalName: string;
  codigoInep: string;
  status: boolean;
}

export interface SchoolFilter {
  search?: string;
  status?: boolean;
}

export interface CreateSchoolRequest {
  name: string;
  principalName: string;
  codigoInep: string;
  status: boolean;
}

export type UpdateSchoolRequest = CreateSchoolRequest;
