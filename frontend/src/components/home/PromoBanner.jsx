import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';
import { BannerSkeleton } from './sectionSkeletons.jsx';

export default function PromoBanner({ banner, loading }) {
  if (loading) return <BannerSkeleton className="h-[360px]" />;
  if (!banner) return null;

  const isDark = banner.theme === 'dark';

  return (
    <section className={`mx-5 overflow-hidden rounded-4xl md:mx-8 ${isDark ? 'bg-graphite' : 'bg-chalk'}`}>
      <div className="relative grid grid-cols-1 md:grid-cols-2">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col justify-center gap-4 p-10 md:p-16"
        >
          <span className="eyebrow">{banner.eyebrow}</span>
          <h2
            className={`font-display text-3xl font-semibold leading-tight md:text-4xl ${
              isDark ? 'text-chalk' : 'text-char'
            }`}
          >
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className={`max-w-sm font-body text-sm ${isDark ? 'text-chalk/70' : 'text-char/70'}`}>
              {banner.subtitle}
            </p>
          )}
          <Link to={banner.ctaLink || '/shop'} className="w-fit">
            <Button variant={isDark ? 'accent' : 'primary'}>{banner.ctaText || 'Shop now'}</Button>
          </Link>
        </motion.div>

        <div className="relative h-56 md:h-auto">
          <img src={banner.image?.url} alt={banner.title} className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
