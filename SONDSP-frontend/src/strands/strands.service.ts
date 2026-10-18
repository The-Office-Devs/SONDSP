import { api } from "@/api/axios";
import type { Strand } from "./strands.types";

export async function getStrandService(id: number): Promise<Strand> {
  const response = await api.get<Strand>(`/strand/${id}`);
  return response.data;
}