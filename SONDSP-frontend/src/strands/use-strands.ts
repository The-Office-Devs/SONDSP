import { useQuery } from "@tanstack/react-query";
import { getStrandService } from "./strands.service";
import { useStrandsBySubject } from "@/activities/activities-page/use-activities";

export function useStrand(id: number | null) {
  return useQuery({
    queryKey: ["strand", id],
    queryFn: () => getStrandService(id as number),
    enabled: !!id,
  });
}

export function useStrandOptions(subjectLabel?: string) {
  const { data, isLoading } = useStrandsBySubject(subjectLabel);

  const options =
    data?.map((strand) => ({ 
      value: String(strand.id), 
      label: strand.name 
    })) ?? [];

  return { options, isLoading };
}
