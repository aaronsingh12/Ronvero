import { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { orderService } from '../../services/orderService.js';
import { useNotificationStore } from '../../store/useNotificationStore.js';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const refreshNotifications = useNotificationStore((s) => s.load);

  const load = () =>
    orderService
      .listAdmin(statusFilter ? { status: statusFilter } : {})
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (order, status) => {
    await orderService.updateStatus(order._id, { status });
    refreshNotifications({ limit: 50 }).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('')}
          className={`rounded-full px-4 py-1.5 font-mono text-xs ${statusFilter === '' ? 'bg-graphite text-chalk' : 'border border-graphite/15 text-char/60'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs capitalize ${statusFilter === s ? 'bg-graphite text-chalk' : 'border border-graphite/15 text-char/60'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-graphite/10 bg-mist">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-graphite/10">
              {['Order', 'Customer', 'Total', 'Paid', 'Status'].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wideish text-char/50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-body text-sm text-char/50">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-graphite/5 last:border-none">
                <td className="whitespace-nowrap px-4 py-3 font-body text-sm text-char">{order.orderNumber}</td>
                <td className="whitespace-nowrap px-4 py-3 font-body text-sm text-char/70">{order.user?.name}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-char">{formatCurrency(order.totalPrice)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{order.isPaid ? 'Yes' : 'No'}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="rounded-full border border-graphite/15 bg-transparent px-3 py-1.5 font-mono text-xs capitalize outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
