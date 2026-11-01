import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon } from '../components/ui/Icons.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { orderService } from '../services/orderService.js';
import { scaleIn } from '../animations/variants.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getById(id).then((data) => setOrder(data.order)).catch(() => setOrder(null));
  }, [id]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-5 py-24 text-center">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="show"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-chalk"
      >
        <CheckIcon size={28} />
      </motion.div>
      <h1 className="font-display text-3xl font-semibold text-char">Order confirmed</h1>
      <p className="font-body text-char/70">
        {order ? `Order ${order.orderNumber} is on its way to being prepared.` : 'Thanks — your order has been placed.'}
      </p>
      {order && (
        <p className="font-mono text-xl font-semibold text-char">{formatCurrency(order.totalPrice)}</p>
      )}
      <div className="mt-4 flex gap-3">
        <Link to="/shop" className="btn-ghost">
          Continue shopping
        </Link>
        <Link to="/account/orders" className="btn-primary">
          View orders
        </Link>
      </div>
    </div>
  );
}
