import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import { motion } from 'framer-motion';
import Rating from '../ui/Rating.jsx';
import { fadeUp, viewportOnce } from '../../animations/variants.js';
import { TextSkeleton } from '../ui/Skeleton.jsx';

export default function Testimonials({ testimonials, loading }) {
  return (
    <section className="bg-graphite py-20 md:py-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto mb-10 max-w-8xl px-5 md:px-8"
      >
        <span className="eyebrow">From the community</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-chalk md:text-4xl">Worn, tested, trusted.</h2>
      </motion.div>

      <div className="mx-auto max-w-8xl px-5 md:px-8">
        {loading ? (
          <TextSkeleton lines={3} />
        ) : (
          <Swiper
            modules={[Autoplay, A11y]}
            spaceBetween={24}
            slidesPerView={1.05}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{ 768: { slidesPerView: 2.2 }, 1280: { slidesPerView: 3 } }}
          >
            {testimonials?.map((t) => (
              <SwiperSlide key={t._id}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-chalk/10 bg-chalk/5 p-7">
                  <Rating value={t.rating} />
                  <p className="font-body text-[15px] leading-relaxed text-chalk/90">"{t.message}"</p>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <img src={t.avatar?.url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-body text-sm font-medium text-chalk">{t.name}</p>
                      <p className="font-mono text-xs text-chalk/50">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
