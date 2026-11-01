import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard.jsx';
import SimpleBarChart from '../../components/admin/SimpleBarChart.jsx';
import { orderService } from '../../services/orderService.js';
import { useNotificationStore } from '../../store/useNotificationStore.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const loadNotifications = useNotificationStore((s) => s.load);

  useEffect(() => {
    orderService.getAnalytics().then(setData).catch(() => setData(null));
    loadNotifications({ limit: 10 }).catch(() => {});
  }, [loadNotifications]);

  if (!data) return <p className="font-body text-sm text-char/50">Loading analytics...</p>;

  const chartData = data.revenueByDay.map((day) => ({
    label: day._id.slice(5),
    value: day.revenue,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={formatCurrency(data.summary.totalRevenue)} />
        <StatCard label="Total orders" value={data.summary.totalOrders} />
        <StatCard label="Avg. order value" value={formatCurrency(data.summary.avgOrderValue)} />
        <StatCard label="Unread alerts" value={unreadCount} sub="Orders, inventory and catalog" />
      </div>

      <div className="rounded-2xl border border-graphite/10 p-5">
        <p className="mb-4 font-body text-sm font-medium text-char">Revenue - last 30 days</p>
        <SimpleBarChart data={chartData} formatValue={formatCurrency} />
      </div>

      <div className="rounded-2xl border border-graphite/10 p-5">
        <p className="mb-4 font-body text-sm font-medium text-char">Top products</p>
        <div className="flex flex-col divide-y divide-graphite/10">
          {data.topProducts.map((product) => (
            <div key={product._id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-body text-sm text-char">{product.name}</p>
                <p className="font-mono text-xs text-char/50">{product.unitsSold} units sold</p>
              </div>
              <p className="font-mono text-sm text-char">{formatCurrency(product.revenue)}</p>
            </div>
          ))}
          {data.topProducts.length === 0 && <p className="py-4 font-body text-sm text-char/50">No sales yet.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-graphite/10 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-body text-sm font-medium text-char">Recent notifications</p>
          <Link to="/admin/notifications" className="font-mono text-xs text-char/50 underline">
            View all
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-graphite/10">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification._id} className="flex items-start gap-3 py-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${notification.read ? 'bg-char/20' : 'bg-ember'}`} />
              <div>
                <p className="font-body text-sm text-char">{notification.title}</p>
                <p className="mt-0.5 font-body text-xs text-char/50">{notification.message}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="py-4 font-body text-sm text-char/50">No notifications yet.</p>}
        </div>
      </div>
    </div>
  );
}
