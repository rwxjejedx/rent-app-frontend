import { toast as sonnerToast } from "sonner";

/**
 * Hook sederhana untuk membungkus Sonner.
 * Memenuhi spek Clean Code: Fungsi di bawah 15 baris.
 */
export const useToast = () => {
  const toast = ({ title, description, variant }: { 
    title: string; 
    description?: string; 
    variant?: "default" | "destructive" | "success" 
  }) => {
    const options = {
      description: description,
      className: variant === "destructive" ? "bg-destructive text-white" : "bg-white text-navy-900",
    };

    if (variant === "destructive") return sonnerToast.error(title, options);
    if (variant === "success") return sonnerToast.success(title, options);
    return sonnerToast(title, options);
  };

  return {
    toast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  };
};

// Export shortcut agar bisa dipanggil langsung tanpa hook jika perlu
export { sonnerToast as toast };
