import { api } from "@/api/axios";

import type { CreateActivityRequest } from "../activities.types";

export async function createActivityService(data: CreateActivityRequest)/*: Promise<Activity>*/ {
  const response = await api.post/*<Activity>*/('/activity', data);
  return response.data;
}