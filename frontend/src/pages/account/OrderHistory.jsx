import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { orderService } from '../../services/orderService.js';

const statusColor = {
  pending: 'text-char/60',
  processing: 'text-trace',
  shipped: 'text-trace',
  delivered: 'text-green-700',
  cancelled: 'text-ember',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMine()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="font-body text-sm text-char/50">Loading orders…</p>;
  if (orders.length === 0) return <p className="font-body text-sm text-char/50">You haven't placed any orders yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Link
          key={order._id}
          to={`/order-success/${order._id}`}
          className="flex items-center justify-between rounded-2xl border border-graphite/10 p-5 transition-colors hover:border-char"
        >
          <div>
            <p className="font-body text-sm font-medium text-char">{order.orderNumber}</p>
            <p className="font-mono text-xs text-char/50">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <p className={`font-mono text-xs capitalize ${statusColor[order.status]}`}>{order.status}</p>
          <p className="font-mono text-sm text-char">{formatCurrency(order.totalPrice)}</p>
        </Link>
      ))}
    </div>
  );
}
