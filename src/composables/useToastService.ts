import type { ToastService } from "../models/toat-service";
import { useToast } from "primevue/usetoast";

export function useToastService(): ToastService {
  const toast = useToast();

  return {
    showSuccessToast: () =>
      toast.add({
        severity: "success",
        summary: "Correct !",
        detail: "Good answer !",
        life: 2000,
      }),
    showErrorToast: () =>
      toast.add({
        severity: "error",
        summary: "Wrong :(",
        detail: "Wrong answer !",
        life: 2000,
      }),
  };
}
