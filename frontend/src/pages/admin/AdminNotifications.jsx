import { useEffect } from 'react';
import Button from '../../components/ui/Button.jsx';
import { useNotificationStore } from '../../store/useNotificationStore.js';

const severityClass = {
  info: 'border-char/10 bg-char/5 text-char',
  success: 'border-green-700/20 bg-green-700/10 text-green-900',
  warning: 'border-amber-700/20 bg-amber-700/10 text-amber-900',
  critical: 'border-ember/30 bg-ember/10 text-ember',
};

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function AdminNotifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const status = useNotificationStore((s) => s.status);
  const load = useNotificationStore((s) => s.load);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    load({ limit: 80 }).catch(() => {});
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-char">Notifications</p>
          <p className="mt-1 font-body text-sm text-char/60">
            {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
          </p>
        </div>
        <Button type="button" variant="ghost" magnetic={false} onClick={markAllRead} disabled={unreadCount === 0}>
          Mark all read
        </Button>
      </div>

      <div className="rounded-2xl border border-graphite/10 bg-mist">
        {status === 'loading' && notifications.length === 0 && (
          <p className="p-5 font-body text-sm text-char/50">Loading notifications...</p>
        )}

        {status !== 'loading' && notifications.length === 0 && (
          <p className="p-5 font-body text-sm text-char/50">No notifications yet.</p>
        )}

        <div className="divide-y divide-graphite/10">
          {notifications.map((notification) => (
            <div key={notification._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    notification.read ? 'bg-char/20' : 'bg-ember'
                  }`}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-body text-sm font-medium text-char">{notification.title}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wideish ${
                        severityClass[notification.severity] || severityClass.info
                      }`}
                    >
                      {notification.type}
                    </span>
                  </div>
                  {notification.message && <p className="mt-1 font-body text-sm text-char/60">{notification.message}</p>}
                  <p className="mt-2 font-mono text-xs text-char/40">{formatDate(notification.createdAt)}</p>
                </div>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  onClick={() => markRead(notification._id)}
                  className="w-fit rounded-full border border-graphite/15 px-3 py-1.5 font-mono text-xs text-char/60 hover:text-char"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
