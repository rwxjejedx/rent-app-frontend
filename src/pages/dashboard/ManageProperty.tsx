import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Bed, Plus, Calendar, Settings, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";

const ManageProperty = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  
  // State manual untuk menangani perpindahan Tab
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
        <p className="font-bold text-slate-500">Loading Property Details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
        <span>Dashboard</span> <ChevronRight size={10} /> <span>Manage Property</span>
      </div>
      
      {/* Hero Banner */}
      <div className="bg-navy-900 rounded-[2.5rem] p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md w-fit px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
            {property.category?.name || "Property"} Listing
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter">{property.name}</h1>
          <p className="opacity-60 flex items-center gap-2 font-medium">
            <LayoutGrid size={16} className="text-navy-300"/> {property.city} • {property.location}
          </p>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] opacity-5 rotate-12">
          <Settings size={300} />
        </div>
      </div>

      {/* Manual Tabs System */}
      <div className="w-full">
        <div className="bg-slate-100 p-1.5 rounded-2xl mb-10 w-fit flex gap-1">
          <button 
            onClick={() => setActiveTab("rooms")}
            className={`rounded-xl px-10 py-3 text-sm font-bold transition-all duration-300 ${
              activeTab === "rooms" 
              ? "bg-white text-navy-900 shadow-md" 
              : "text-slate-500 hover:text-navy-700"
            }`}
          >
            Room Types
          </button>
          <button 
            onClick={() => setActiveTab("availability")}
            className={`rounded-xl px-10 py-3 text-sm font-bold transition-all duration-300 ${
              activeTab === "availability" 
              ? "bg-white text-navy-900 shadow-md" 
              : "text-slate-500 hover:text-navy-700"
            }`}
          >
            Availability & Rates
          </button>
        </div>

        {/* Tab Content: Room Types */}
        {activeTab === "rooms" && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-navy-900 tracking-tight">Room Configurations</h2>
                <p className="text-slate-400 text-sm mt-1">Define your room categories and set base pricing.</p>
              </div>
              <button className="group flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition hover:bg-navy-800 active:scale-95 shadow-xl shadow-navy-900/10">
                <Plus size={18} className="transition-transform group-hover:rotate-90" />
                Add Room Type
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {property.roomTypes?.map((rt: any) => (
                <div key={rt.id} className="border border-slate-100 bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row justify-between items-center group">
                  <div className="flex items-center gap-8">
                    <div className="bg-slate-50 p-6 rounded-[1.5rem] text-navy-700 group-hover:bg-navy-900 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Bed size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-navy-900">{rt.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                           {rt.capacity} Guests
                         </span>
                         <span className="text-navy-600 font-black">
                           Rp{Number(rt.basePrice).toLocaleString()}<span className="text-slate-300 font-medium text-sm">/night</span>
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <button className="p-4 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-navy-900 transition-colors border border-transparent hover:border-slate-100">
                      <Settings size={20} />
                    </button>
                    <button className="bg-navy-50 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300">
                      Manage Units ({rt.rooms?.length || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Availability */}
        {activeTab === "availability" && (
          <div className="bg-white border-2 border-dashed border-slate-100 p-20 rounded-[3rem] text-center animate-fade-up">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-navy-200" size={40} />
            </div>
            <h3 className="text-2xl font-black text-navy-900 mb-2">Calendar Management</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 font-medium">
              Take control of your schedule. Block specific dates for maintenance or set peak rates for holiday seasons.
            </p>
            <button className="bg-navy-gradient text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-navy-900/20 hover:scale-105 transition-transform">
              Open Smart Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperty;