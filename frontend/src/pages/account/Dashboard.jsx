import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import { orderService } from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    orderService.getMine({ limit: 3 }).then((data) => setRecentOrders(data.orders));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-graphite/10 p-6">
        <p className="font-mono text-xs uppercase tracking-wideish text-char/50">Welcome back</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-char">{user?.name}</h2>
        <p className="mt-1 font-body text-sm text-char/60">{user?.email}</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-char">Recent orders</h3>
          <Link to="/account/orders" className="font-mono text-xs text-char/60 underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="font-body text-sm text-char/50">No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between rounded-2xl border border-graphite/10 p-4">
                <div>
                  <p className="font-body text-sm text-char">{order.orderNumber}</p>
                  <p className="font-mono text-xs capitalize text-char/50">{order.status}</p>
                </div>
                <p className="font-mono text-sm text-char">{formatCurrency(order.totalPrice)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
