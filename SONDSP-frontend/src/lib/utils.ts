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

export function maskDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } 

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}