import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export const useManageAvailability = () => {
  const { id: propertyId } = useParams();
  const { toast } = useToast();
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [blockDate, setBlockDate] = useState("");
  const [peakRate, setPeakRate] = useState({ startDate: "", endDate: "", rateType: "PERCENTAGE", rateValue: "" });

  const { data: property, isLoading } = useQuery({
    queryKey: ["manage-prop", propertyId],
    queryFn: () => api.get(`/properties/${propertyId}`).then(r => r.data)
  });

  const peakMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/rooms/room-types/${selectedRoomType}/peak-rates`, payload),
    onSuccess: () => {
      toast({ title: "Berhasil!", description: "Harga khusus (Peak Rate) telah diterapkan." });
      setPeakRate({ startDate: "", endDate: "", rateType: "PERCENTAGE", rateValue: "" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.response?.data?.message, variant: "destructive" })
  });

  const availMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/availability/room-types/${selectedRoomType}`, payload),
    onSuccess: () => {
      toast({ title: "Berhasil!", description: "Status ketersediaan kamar diperbarui." });
      setBlockDate("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.response?.data?.message, variant: "destructive" })
  });

  const handleSetPeakRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType) return toast({ title: "Pilih Tipe Kamar", variant: "destructive" });
    peakMutation.mutate({ ...peakRate, rateValue: Number(peakRate.rateValue) });
  };

  const handleManualBlock = () => {
    if (!selectedRoomType || !blockDate) return;
    availMutation.mutate({ dates: [{ date: blockDate, isAvailable: false }] });
  };

  return {
    property, isLoading, selectedRoomType, setSelectedRoomType, blockDate, setBlockDate,
    peakRate, setPeakRate, handleSetPeakRate, handleManualBlock,
    isPeakPending: peakMutation.isPending, isAvailPending: availMutation.isPending
  };
};
