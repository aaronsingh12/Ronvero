import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../product/ProductGrid.jsx';
import Button from '../ui/Button.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';

export default function FeaturedCollection({ collection, loading }) {
  if (!loading && !collection) return null;

  return (
    <section className="mx-auto max-w-8xl px-5 py-16 md:px-8 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <span className="eyebrow">Featured collection</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">
            {loading ? 'Loading…' : collection.name}
          </h2>
          {collection?.tagline && <p className="mt-2 max-w-md font-body text-char/70">{collection.tagline}</p>}
        </div>
        {collection && (
          <Link to={`/collections/${collection.slug}`}>
            <Button variant="ghost">View full edit</Button>
          </Link>
        )}
      </motion.div>

      <ProductGrid products={collection?.products?.slice(0, 8)} loading={loading} columns={4} />
    </section>
  );
}
