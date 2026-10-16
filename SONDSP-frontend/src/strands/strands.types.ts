export interface Strand {
  id: number;
  name: string;
  subject: string;
  code?: string;
  status: boolean;
};

export interface StrandFilter {
  search?: string;
  name?: string;
  subject?: string;
}

export interface CreateStrandRequest {
  name: string;
  subject: string;
}