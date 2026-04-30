import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  Bed, Plus, Calendar, Settings, ChevronRight, 
  LayoutGrid, Loader2, MapPin, Star, ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("rooms");

  const { data: property, isLoading } = useQuery({
    queryKey: ["property-detail", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/api/v1/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-navy-700" />
        <p className="font-bold text-slate-500 animate-pulse">Loading Property Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-950 transition-colors text-xs font-bold mb-4 uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
          <h1 className="text-4xl font-bold text-slate-950 tracking-tight">
            {property?.name}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-sm">
              <MapPin size={14} className="text-slate-400" /> {property?.city}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <Star size={14} className="text-amber-400 fill-amber-400" /> 
              {property?.avgRating ? Number(property.avgRating).toFixed(1) : "New Listing"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/dashboard/property/${id}/edit`)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-950 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => navigate(`/dashboard/property/${id}/room-type/create`)}
            className="group flex items-center gap-3 bg-slate-950 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Add Room Type
          </button>
        </div>
      </div>

      {/* Tabs Design */}
      <div className="flex gap-2 p-1.5 bg-slate-50 w-fit rounded-2xl">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "rooms" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutGrid size={16} /> Units & Categories
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === "availability" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Calendar size={16} /> Smart Calendar
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "rooms" ? (
          <motion.div 
            key="rooms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {property?.roomTypes?.length > 0 ? (
              property.roomTypes.map((rt: any) => (
                <div key={rt.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-500">
                      <Bed size={28} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Base Rate</p>
                      <p className="text-xl font-bold text-slate-950">Rp {Number(rt.basePrice).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-950 mb-2">{rt.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{rt.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Capacity</p>
                        <p className="font-bold text-slate-950">{rt.capacity} Pax</p>
                      </div>
                      <div className="text-center border-l border-slate-100 pl-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Units</p>
                        <p className="font-bold text-slate-950">{rt.rooms?.length || 0} Rooms</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/property/${id}/room-type/${rt.id}/rooms`)}
                      className="bg-slate-50 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-950 hover:text-white transition-all duration-300"
                    >
                      Manage Units
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:col-span-2 bg-white border border-dashed border-slate-200 p-20 rounded-[3rem] text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bed className="text-slate-300" size={24} />
                </div>
                <p className="text-slate-400 font-bold mb-4">No room types configured yet.</p>
                <button 
                   onClick={() => navigate(`/dashboard/property/${id}/room-type/create`)}
                   className="bg-slate-950 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Create First Room Type
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="availability"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-100 p-12 lg:p-24 rounded-[3.5rem] text-center"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Calendar className="text-slate-200" size={40} />
            </div>
            <h3 className="text-3xl font-bold text-slate-950 mb-4 tracking-tight">Dynamic Rates & Availability</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-12 font-medium leading-relaxed">
              Adjust your pricing based on seasons or block dates for maintenance. 
              Our Smart Calendar helps you maximize revenue during peak periods.
            </p>
            <button 
              onClick={() => navigate(`/dashboard/property/${id}/availability`)}
              className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 transition-transform"
            >
              Open Smart Calendar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProperty;
