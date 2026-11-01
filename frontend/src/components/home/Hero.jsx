import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useParallax } from '../../animations/useGsapReveal.js';
import { staggerContainer, fadeUp } from '../../animations/variants.js';

const words = (text) => text.split(' ');

export default function Hero({ banner }) {
  const parallaxRef = useParallax(0.12);

  if (!banner) return <div className="h-[88svh] min-h-[520px] w-full animate-pulse bg-graphite" />;

  return (
    <section className="relative flex h-[88svh] min-h-[520px] max-h-[920px] w-full items-end overflow-hidden bg-graphite">
      <picture>
        {banner.mobileImage?.url && <source media="(max-width: 767px)" srcSet={banner.mobileImage.url} />}
        <img
          ref={parallaxRef}
          src={banner.image?.url}
          alt={banner.title || ''}
          className="absolute inset-0 h-[130%] w-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/40 to-graphite/10" />

      <svg
        className="pointer-events-none absolute right-8 top-24 hidden md:block"
        width="140"
        height="90"
        viewBox="0 0 140 90"
        fill="none"
      >
        <motion.path
          d="M6 74 L38 42 L58 60 L88 20 L134 8"
          stroke="#FF4A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>

      <motion.div
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col gap-6 px-5 pb-16 md:px-12 md:pb-24"
      >
        {banner.eyebrow && (
          <motion.span variants={fadeUp} className="eyebrow">
            {banner.eyebrow}
          </motion.span>
        )}

        <h1 className="max-w-3xl break-words font-display text-4xl font-bold leading-[1.05] tracking-tightest text-chalk sm:text-6xl sm:leading-[1.02] md:text-7xl">
          {words(banner.title).map((word, i) => (
            <span key={i} className="mr-3 inline-block overflow-hidden align-bottom sm:mr-4">
              <motion.span
                variants={fadeUp}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {banner.subtitle && (
          <motion.p variants={fadeUp} className="max-w-md font-body text-base text-chalk/70 md:text-lg">
            {banner.subtitle}
          </motion.p>
        )}

        <motion.div variants={fadeUp}>
          <Link to={banner.ctaLink || '/shop'}>
            <Button variant="accent">{banner.ctaText || 'Shop now'}</Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}\n