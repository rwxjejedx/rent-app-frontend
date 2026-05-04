import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  CalendarCheck,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { bookingApi, formatPrice, statusConfig } from "@/lib/booking";

const Dashboard = () => {
  // Fetch properties
  const { data: properties = [], isLoading: loadingProps } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://rent-app-backend-production-d854.up.railway.app/api/v1/properties/tenant/my-listings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
  });

  // Fetch bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["tenant-bookings"],
    queryFn: bookingApi.getTenantBookings,
  });

  const isLoading = loadingProps || loadingBookings;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Calculate metrics
  const totalListings = properties.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b: any) => b.status === "PENDING").length;
  const totalRevenue = bookings
    .filter((b: any) => b.status === "COMPLETED" || b.status === "CONFIRMED")
    .reduce((sum: number, b: any) => sum + Number(b.totalPrice), 0);

  const stats = [
    { label: "Total Listings", value: totalListings, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Bookings", value: totalBookings, icon: CalendarCheck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Approvals", value: pendingBookings, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Estimated Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const recentBookings = [...bookings].sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your rental business performance and activity.</p>
        </div>
        <Link
          to="/dashboard/create"
          className="flex items-center gap-2 bg-slate-950 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-950 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-950">Recent Reservations</h3>
            <Link to="/dashboard/reservations" className="text-sm font-bold text-slate-400 hover:text-slate-950 flex items-center gap-1 transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-50">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.map((booking: any) => {
                  const status = statusConfig[booking.status as keyof typeof statusConfig];
                  return (
                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            {booking.user?.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{booking.user?.name || "Guest"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{booking.roomType?.property?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${status?.dot || "bg-slate-300"}`} />
                          <span className="text-xs font-bold text-slate-700">{status?.label || booking.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-slate-950">{formatPrice(booking.totalPrice)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {recentBookings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-400 font-medium">No reservations found yet.</p>
            </div>
          )}
        </div>

        {/* Quick Links / Active Properties */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-950">Active Properties</h3>
          <div className="space-y-4">
            {properties.slice(0, 4).map((p: any) => (
              <Link
                key={p.id}
                to={`/dashboard/property/${p.id}`}
                className="flex items-center gap-4 group"
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.jpg"}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                  alt={p.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-600 transition-colors">{p.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{p.roomTypes?.length || 0} Units</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
            {properties.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 font-medium">No properties added.</p>
              </div>
            )}
          </div>
          <Link to="/dashboard" className="block text-center py-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            Manage All Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
