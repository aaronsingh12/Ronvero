import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '../ui/Icons.jsx';
import { imageReveal, viewportOnce } from '../../animations/variants.js';

export default function CategoryCard({ category, size = 'md' }) {
  const heightClass = size === 'lg' ? 'aspect-[3/4] md:aspect-[4/5]' : 'aspect-[3/4]';

  return (
    <Link to={`/shop?category=${category.slug}`} className="group relative block">
      <motion.div
        variants={imageReveal}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className={`relative overflow-hidden rounded-3xl ${heightClass}`}
      >
        <motion.img
          src={category.image?.url}
          alt={category.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/10 to-transparent transition-opacity duration-500 group-hover:from-graphite/95" />

        <div className="pointer-events-none absolute inset-3 rounded-[1.4rem] border border-chalk/0 transition-colors duration-500 group-hover:border-chalk/30" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
          {category.subtitle && (
            <span className="eyebrow text-chalk/80">{category.subtitle}</span>
          )}
          <h3 className="font-display text-2xl font-semibold text-chalk">{category.name}</h3>
          <span className="mt-2 inline-flex w-fit items-center gap-1.5 font-body text-sm font-medium text-chalk opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
            Shop now <ArrowRightIcon size={15} />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
