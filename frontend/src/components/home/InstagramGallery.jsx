import { motion } from 'framer-motion';
import { CameraIcon } from '../ui/Icons.jsx';
import { staggerContainer, scaleIn, viewportOnce } from '../../animations/variants.js';

const images = Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/ronvero-social-${i}/500/500`);

export default function InstagramGallery() {
  return (
    <section className="mx-auto max-w-8xl px-5 py-16 md:px-8 md:py-20">
      <motion.div variants={scaleIn} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-10 text-center">
        <span className="eyebrow">Tag @ronvero to be featured</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-char md:text-4xl">Worn your way</h2>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-6"
      >
        {images.map((src, i) => (
          <motion.div key={i} variants={scaleIn} className="group relative aspect-square overflow-hidden rounded-2xl">
            <img src={src} alt="Community" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-graphite/0 opacity-0 transition-all duration-300 group-hover:bg-graphite/40 group-hover:opacity-100">
              <CameraIcon className="text-chalk" size={22} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
