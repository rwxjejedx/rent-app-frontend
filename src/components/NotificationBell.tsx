import { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { notificationApi, type Notification } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const NotificationBell = ({ variant = 'dark' }: { variant?: 'dark' | 'light' }) => {
  const { isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch {}
  };

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && isAuthenticated) {
      setIsLoading(true);
      try {
        const data = await notificationApi.getAll();
        setNotifications(data);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await notificationApi.markAsRead(n.id);
      setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (n.bookingId) {
      setOpen(false);
      if (isTenant) {
        navigate('/dashboard/reservations');
      } else {
        navigate(`/bookings/${n.bookingId}/payment`);
      }
    }
  };

  const typeIcon: Record<string, string> = {
    BOOKING_NEW: '🏨',
    BOOKING_CONFIRMED: '✅',
    BOOKING_CANCELLED: '❌',
    PAYMENT_UPLOADED: '💳',
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition ${
          variant === 'dark' 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-slate-100'
        }`}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="text-sm font-bold text-[var(--color-foreground)]">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-[var(--color-navy-700)] hover:underline">
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-navy-700)]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--color-muted-fg)]">
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <button key={n.id} onClick={() => handleClick(n)}
                  className={`w-full border-b border-[var(--color-border)] px-4 py-3 text-left transition hover:bg-[var(--color-muted)] last:border-0 ${!n.isRead ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{typeIcon[n.type] ?? '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${!n.isRead ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-fg)]'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-[var(--color-muted-fg)] mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] mt-1">
                        {new Date(n.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
