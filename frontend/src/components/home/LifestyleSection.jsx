import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '../ui/Icons.jsx';
import { useParallax } from '../../animations/useGsapReveal.js';
import { fadeUp, viewportOnce } from '../../animations/variants.js';
import { BannerSkeleton } from './sectionSkeletons.jsx';

export default function LifestyleSection({ banner, loading }) {
  const parallaxRef = useParallax(0.1);

  if (loading) return <BannerSkeleton className="h-[80vh]" />;
  if (!banner) return null;

  return (
    <section className="mx-auto max-w-8xl px-5 py-20 md:px-8 md:py-28">
      <div className="relative h-[70vh] overflow-hidden rounded-4xl">
        <img ref={parallaxRef} src={banner.image?.url} alt="" className="h-[130%] w-full object-cover" />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <span className="eyebrow">{banner.eyebrow}</span>
          <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold leading-tight text-char md:text-4xl">
            {banner.title}
          </h2>
          {banner.subtitle && <p className="mt-3 max-w-md font-body text-char/70">{banner.subtitle}</p>}
        </div>
        <Link
          to={banner.ctaLink || '/shop'}
          className="trace-underline flex shrink-0 items-center gap-1.5 font-body text-sm font-medium text-char"
        >
          {banner.ctaText || 'Explore'} <ArrowRightIcon size={15} />
        </Link>
      </motion.div>
    </section>
  );
}
