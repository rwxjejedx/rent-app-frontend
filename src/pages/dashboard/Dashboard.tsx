import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Home, Users, Star, Loader2, MapPin, Building2, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      // Mengambil data dari endpoint tenant yang spesifik
      const res = await axios.get("http://localhost:3000/api/v1/properties/tenant/my-listings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-navy-700" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">Syncing your properties...</p>
      </div>
    );
  }

  const propertyList = Array.isArray(data) ? data : [];

  return (
    <div className="container mx-auto p-6 lg:p-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black font-display text-navy-900 tracking-tight">Management</h1>
          <p className="text-slate-500 font-medium">You have {propertyList.length} active listings</p>
        </div>
        <Link 
          to="/dashboard/create" 
          className="group flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-2xl shadow-xl hover:bg-navy-800 transition-all active:scale-95"
        >
          <Plus size={20} className="transition-transform group-hover:rotate-90" />
          <span className="font-bold text-sm uppercase tracking-widest">New Property</span>
        </Link>
      </div>

      {propertyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
          <div className="bg-white p-6 rounded-full shadow-sm mb-6">
            <Building2 className="h-12 w-12 text-navy-200" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">Empty Listings</h3>
          <p className="text-slate-400 text-sm max-w-xs text-center mb-8">
            You haven't added any properties yet. Start your journey as a tenant now.
          </p>
          <Link to="/dashboard/create" className="bg-white border-2 border-navy-900 text-navy-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-900 hover:text-white transition-colors">
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyList.map((p: any) => (
            // Penambahan Link ke rute detail management
            <Link 
              key={p.id} 
              to={`/dashboard/property/${p.id}`} 
              className="group border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-navy-900 shadow-sm">
                  {p.category?.name || "Property"}
                </div>
                {/* Overlay saat di-hover */}
                <div className="absolute inset-0 z-10 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white p-3 rounded-full text-navy-900 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ChevronRight size={24} />
                   </div>
                </div>
                <img 
                  src={p.images?.[0]?.url || "/placeholder.jpg"} 
                  className="object-cover w-full h-full transition duration-700 group-hover:scale-110" 
                  alt={p.name} 
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-1 text-navy-900 truncate group-hover:text-navy-700 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-6 font-medium">
                  <MapPin size={14} className="text-navy-300" />
                  <span>{p.city}</span>
                </div>
                
                <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Units</span>
                    <span className="font-bold text-navy-900">{p.roomTypes?.length || 0} Room Types</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-navy-900">{p.avgRating ? Number(p.avgRating).toFixed(1) : "New"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;