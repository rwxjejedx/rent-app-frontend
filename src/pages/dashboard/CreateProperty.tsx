import { Loader2 } from "lucide-react";
import { useCreateProperty } from "@/hooks/useCreateProperty";
import ProfileIncompleteGuard from "@/components/dashboard/property/ProfileIncompleteGuard";
import PropertyImageGallery from "@/components/dashboard/property/PropertyImageGallery";
import { BasicInfoFields, DetailFields } from "@/components/dashboard/property/PropertyFormFields";

const CreateProperty = () => {
  const {
    formData, setFormData, images, setImages, uploading, profile, 
    profileLoading, categories, handleImageUpload, handleSubmit, isPending
  } = useCreateProperty();

  if (profileLoading) return <LoadingState />;
  if (!profile?.isProfileComplete) return <ProfileIncompleteGuard />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl border shadow-xl mt-12 mb-20 animate-fade-up">
      <h2 className="text-3xl font-extrabold mb-8 font-display text-navy-900 tracking-tight">New Property Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <PropertyImageGallery images={images} setImages={setImages} uploading={uploading} onUpload={handleImageUpload} />
        <BasicInfoFields formData={formData} setFormData={setFormData} />
        <DetailFields formData={formData} setFormData={setFormData} categories={categories} />
        <SubmitButton isPending={isPending} uploading={uploading} />
      </form>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-navy-700" />
  </div>
);

const SubmitButton = ({ isPending, uploading }: { isPending: boolean; uploading: boolean }) => (
  <button type="submit" disabled={isPending || uploading}
    className="w-full bg-navy-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition hover:bg-navy-800 disabled:opacity-50 shadow-xl">
    {isPending ? "Publishing..." : "Launch Listing"}
  </button>
);

export default CreateProperty;
