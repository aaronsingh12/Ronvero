import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button.jsx';
import { imageReveal, viewportOnce, fadeUp } from '../../animations/variants.js';
import { BannerSkeleton } from './sectionSkeletons.jsx';

export default function CollectionBanner({ collection, loading }) {
  if (loading) return <BannerSkeleton className="h-[70vh]" />;
  if (!collection) return null;

  return (
    <section className="relative mx-5 overflow-hidden rounded-4xl md:mx-8">
      <motion.div variants={imageReveal} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <img src={collection.bannerImage?.url} alt={collection.name} className="h-[70vh] w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/80 via-graphite/20 to-transparent" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center gap-4 p-8 md:p-14"
      >
        <span className="eyebrow text-chalk/80">Featured drop</span>
        <h2 className="font-display text-4xl font-semibold leading-tight text-chalk md:text-5xl">
          {collection.name}
        </h2>
        {collection.tagline && <p className="font-body text-chalk/70">{collection.tagline}</p>}
        <Link to={`/collections/${collection.slug}`} className="w-fit">
          <Button variant="accent">Shop the edit</Button>
        </Link>
      </motion.div>
    </section>
  );
}
