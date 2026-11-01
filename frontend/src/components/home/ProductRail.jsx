import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductSlider from '../product/ProductSlider.jsx';
import { ArrowRightIcon } from '../ui/Icons.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';
import { ProductGridSkeleton } from '../ui/Skeleton.jsx';

export default function ProductRail({ eyebrow, title, products, loading, viewAllLink }) {
  return (
    <section className="mx-auto max-w-8xl px-5 py-16 md:px-8 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">{title}</h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="trace-underline hidden items-center gap-1.5 font-body text-sm font-medium text-char md:flex"
          >
            View all <ArrowRightIcon size={15} />
          </Link>
        )}
      </motion.div>

      {loading ? <ProductGridSkeleton count={4} /> : <ProductSlider products={products} />}
    </section>
  );
}
