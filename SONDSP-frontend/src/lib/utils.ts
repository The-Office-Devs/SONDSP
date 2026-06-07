import type { AxiosError } from "axios"
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(
  error: AxiosError<{ error: string }>,
  defaultMessage: string = "Ocorreu um erro. Tente novamente."
) {
  const message = error.response?.data?.error ?? defaultMessage;
  toast.error(message);
}
