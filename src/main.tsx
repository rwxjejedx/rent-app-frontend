import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

// Inisialisasi QueryClient untuk manajemen state data dari API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Menghindari fetch ulang saat pindah tab
      retry: 1, // Mencoba ulang 1 kali jika request gagal
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Menambahkan Toaster global agar notifikasi success/error muncul */}
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  </StrictMode>
);