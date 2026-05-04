import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, MapPin, Star, ChevronRight, Building2, Loader2 } from "lucide-react";

const MyProperties = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://rent-app-backend-production-d854.up.railway.app/api/v1/properties/tenant/my-listings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
      </div>
    );
  }

  const propertyList = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">My Properties</h1>
          <p className="text-slate-500 mt-1 font-medium">You have {propertyList.length} active listings</p>
        </div>
        <Link
          to="/dashboard/create"
          className="flex items-center gap-2 bg-slate-950 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>New Property</span>
        </Link>
      </div>

      {propertyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-200 rounded-[3rem]">
          <div className="bg-slate-50 p-6 rounded-full mb-6 text-slate-300">
            <Building2 className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-slate-950 mb-2">No properties yet</h3>
          <p className="text-slate-400 text-sm max-w-xs text-center mb-8 font-medium">
            Start your journey by adding your first property listing.
          </p>
          <Link to="/dashboard/create" className="bg-slate-950 text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-slate-200 hover:scale-105 transition-all">
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyList.map((p: any) => (
            <Link
              key={p.id}
              to={`/dashboard/property/${p.id}`}
              className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-sm">
                  {p.category?.name || "Property"}
                </div>
                <img
                  src={p.images?.[0]?.url || "/placeholder.jpg"}
                  className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                  alt={p.name}
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full text-slate-950 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1 text-slate-950 truncate group-hover:text-blue-600 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-6 font-bold uppercase tracking-wider">
                  <MapPin size={12} />
                  <span>{p.city}</span>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Units</span>
                    <span className="font-bold text-slate-950 text-sm">{p.roomTypes?.length || 0} Room Types</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">Rating</span>
                    <div className="flex items-center gap-1">
                      < Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-950 text-sm">{p.avgRating ? Number(p.avgRating).toFixed(1) : "New"}</span>
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

export default MyProperties;
