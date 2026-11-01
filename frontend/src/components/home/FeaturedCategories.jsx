import { motion } from 'framer-motion';
import CategoryCard from '../category/CategoryCard.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';
import { CategoryGridSkeleton } from './sectionSkeletons.jsx';

export default function FeaturedCategories({ categories, loading }) {
  return (
    <section className="mx-auto max-w-8xl px-5 py-20 md:px-8 md:py-28">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-10">
        <span className="eyebrow">Shop by category</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">Find your lane.</h2>
      </motion.div>

      {loading ? (
        <CategoryGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
