import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

export const useCreateProperty = () => {
  const [formData, setFormData] = useState({ name: "", description: "", location: "", city: "", categoryId: 1 });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["my-profile"], queryFn: () => api.get('/users/me').then(r => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"], queryFn: () => api.get('/categories').then(r => r.data),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(e.target.files));
      setImages(prev => [...prev, ...urls]);
      toast({ title: "Images uploaded!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post('/properties', payload),
    onSuccess: () => {
      toast({ title: "Property Published!", variant: "success" });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || "Check your input and role";
      toast({ title: "Create Failed", description: errMsg, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 10) {
      return toast({ title: "Error", description: "Description must be at least 10 characters", variant: "destructive" });
    }
    if (images.length === 0) {
      return toast({ title: "Error", description: "Please upload at least 1 photo", variant: "destructive" });
    }
    mutation.mutate({ ...formData, images });
  };

  return {
    formData, setFormData, images, setImages, uploading, profile, profileLoading,
    categories, handleImageUpload, handleSubmit, isPending: mutation.isPending
  };
};

const uploadFiles = async (files: File[]) => {
  const promises = files.map(async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST", body: data,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || "Upload failed");
    return result.secure_url;
  });
  return Promise.all(promises);
};
