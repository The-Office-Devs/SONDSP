export interface School {
  id: number;
  name: string;
}

export interface SchoolRow {
  id: number;
  name: string;
  director: string;
}

export interface CreateSchoolRequest {
  name: string;
}

export interface UpdateSchoolRequest {
  name: string;
}

export interface UserListItem {
  id: number;
  name: string;
  registration: string;
  email: string;
}
