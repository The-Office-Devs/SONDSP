import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { 
  StrandFilter,
  Strand,
  CreateStrandRequest
} from "./strands.types";

export async function listStrandsService(
  filter?: StrandFilter & PaginationParams
): Promise<PageResponse<Strand>> {
  const response = await api.get<PageResponse<Strand>>('/strand', { params: filter });
  return response.data;
}

export async function getStrandService(id: number): Promise<Strand> {
  const response = await api.get<Strand>(`/strand/${id}`);
  return response.data;
}

export async function createStrandService(data: CreateStrandRequest): Promise<Strand> {
  const response = await api.post<Strand>('/strand', data);
  return response.data;
}

export async function changeStrandStatusService(id: number): Promise<string> {
  const response = await api.patch<string>(`/strand/${id}/changeStatus`);
  return response.data;
}