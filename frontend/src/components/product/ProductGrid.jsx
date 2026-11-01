import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';
import QuickViewModal from './QuickViewModal.jsx';
import { ProductGridSkeleton } from '../ui/Skeleton.jsx';
import { staggerContainer, fadeUp, viewportOnce } from '../../animations/variants.js';

export default function ProductGrid({ products, loading, emptyMessage = 'No products found.', columns = 4 }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (loading) return <ProductGridSkeleton count={columns * 2} />;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-graphite/10 py-20 text-center">
        <p className="font-body text-char/60">{emptyMessage}</p>
      </div>
    );
  }

  const colClass = {
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-3 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
  }[columns];

  return (
    <>
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className={`grid grid-cols-2 gap-4 sm:gap-6 ${colClass}`}
      >
        {products.map((product) => (
          <motion.div key={product._id} variants={fadeUp}>
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </motion.div>
        ))}
      </motion.div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
