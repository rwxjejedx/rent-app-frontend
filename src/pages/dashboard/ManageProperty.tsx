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
    <div className="container mx-auto p-6 lg:p-10 animate-fade-in">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-navy-900 transition-colors text-sm font-bold mb-4"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight">
            {property?.name}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-navy-400" /> {property?.city}
            </span>
            <span className="flex items-center gap-1">
              <Star size={16} className="text-amber-400 fill-amber-400" /> 
              {property?.avgRating ? Number(property.avgRating).toFixed(1) : "New"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/dashboard/property/${id}/edit`)}
            className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-navy-900 hover:bg-slate-50 transition-all"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => navigate(`/dashboard/property/${id}/room-type/create`)}
            className="group flex items-center gap-3 bg-navy-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Add Room Type
          </button>
        </div>
      </div>

      {/* Tabs Design */}
      <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl mb-10">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "rooms" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-navy-700"
          }`}
        >
          <LayoutGrid size={16} /> Units & Categories
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "availability" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-navy-700"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {property?.roomTypes?.length > 0 ? (
              property.roomTypes.map((rt: any) => (
                <div key={rt.id} className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-navy-50 p-4 rounded-2xl text-navy-600 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-500">
                      <Bed size={28} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Base Rate</p>
                      <p className="text-xl font-black text-navy-900">Rp {Number(rt.basePrice).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-navy-900 mb-2">{rt.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2">{rt.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Capacity</p>
                        <p className="font-bold text-navy-900">{rt.capacity} Pax</p>
                      </div>
                      <div className="text-center border-l border-slate-100 pl-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Units</p>
                        <p className="font-bold text-navy-900">{rt.rooms?.length || 0} Rooms</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/property/${id}/room-type/${rt.id}/rooms`)}
                      className="bg-navy-50 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300"
                    >
                      Manage Units ({rt.rooms?.length || 0})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:col-span-2 bg-white border-2 border-dashed border-slate-100 p-20 rounded-[3rem] text-center">
                <p className="text-slate-400 font-bold mb-4">No room types configured yet.</p>
                <button 
                   onClick={() => navigate(`/dashboard/property/${id}/room-type/create`)}
                   className="text-navy-600 font-black text-sm uppercase underline decoration-2 underline-offset-8"
                >
                  Create your first room type
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="availability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-2 border-slate-50 p-12 lg:p-20 rounded-[3rem] text-center"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="text-navy-200" size={40} />
            </div>
            <h3 className="text-3xl font-black text-navy-900 mb-4">Dynamic Rates & Availability</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-12 font-medium leading-relaxed">
              Adjust your pricing based on seasons or block dates for maintenance. 
              Our Smart Calendar helps you maximize revenue during peak periods.
            </p>
            <button 
              onClick={() => navigate(`/dashboard/property/${id}/availability`)}
              className="bg-navy-gradient text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-navy-900/20 hover:scale-105 transition-transform"
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