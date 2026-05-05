import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

export const useCreateProperty = () => {
  // Gunakan categoryId: 0 atau undefined sebagai initial state agar user dipaksa memilih
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    categoryId: 0
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Ambil data profil tenant
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => api.get('/users/me').then(r => r.data),
  });

  // PERBAIKAN: Endpoint diarahkan ke /categories/all sesuai route baru yang publik
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get('/categories/all').then(r => r.data),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(e.target.files));
      setImages(prev => [...prev, ...urls]);
      toast({ title: "Images uploaded!", variant: "success" });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post('/properties', payload),
    onSuccess: () => {
      toast({ title: "Property Published!", variant: "success" });
      navigate("/dashboard/properties"); // Redirect ke list property tenant
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || "Check your input and role";
      toast({
        title: "Create Failed",
        description: errMsg,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi tambahan sebelum kirim ke backend
    if (!formData.categoryId || formData.categoryId === 0) {
      return toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
    }
    if (formData.description.length < 10) {
      return toast({
        title: "Error",
        description: "Description must be at least 10 characters",
        variant: "destructive"
      });
    }
    if (images.length === 0) {
      return toast({
        title: "Error",
        description: "Please upload at least 1 photo",
        variant: "destructive"
      });
    }

    // Kirim payload dengan format yang benar
    mutation.mutate({
      ...formData,
      images // Backend Anda biasanya menerima array string untuk gambar
    });
  };

  return {
    formData,
    setFormData,
    images,
    setImages,
    uploading,
    profile,
    profileLoading,
    categories,
    handleImageUpload,
    handleSubmit,
    isPending: mutation.isPending
  };
};

/**
 * Helper function untuk upload ke Cloudinary
 */
const uploadFiles = async (files: File[]) => {
  const promises = files.map(async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || "Upload failed");
    return result.secure_url;
  });

  return Promise.all(promises);
};