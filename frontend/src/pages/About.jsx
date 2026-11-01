import { motion } from 'framer-motion';
import { fadeUp, viewportOnce, staggerContainer } from '../animations/variants.js';

const values = [
  { title: 'Built on data', body: 'Every fit is tested against real training logs, not a lookbook.' },
  { title: 'Made to last', body: 'Fabrics chosen for wash after wash, not just the first photo.' },
  { title: 'No wasted moves', body: 'If a feature doesn\u2019t earn its place in a session, it doesn\u2019t ship.' },
];

export default function About() {
  return (
    <div>
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-graphite">
        <img src="https://picsum.photos/seed/ronvero-about-hero/1600/900" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent" />
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative z-10 max-w-2xl px-5 pb-14 md:px-12">
          <span className="eyebrow text-chalk/80">Our story</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-chalk md:text-5xl">
            We build for the mile after the one that felt easy.
          </h1>
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="font-body text-lg leading-relaxed text-char/80">
          RONVERO started with a simple frustration: most "performance" activewear looked the part but fell apart
          under real training load. So we started over — testing fabrics against actual tempo runs, heavy lift days,
          and the long recovery stretches in between. What's left is a kit built for the training you actually do,
          not the training you post about.
        </motion.p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((v) => (
            <motion.div key={v.title} variants={fadeUp} className="rounded-3xl border border-graphite/10 p-7">
              <h3 className="font-display text-xl font-semibold text-char">{v.title}</h3>
              <p className="mt-2 font-body text-sm text-char/70">{v.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5 pb-16 md:grid-cols-4 md:px-8">
        {['ronvero-about-1', 'ronvero-about-2', 'ronvero-about-3', 'ronvero-about-4'].map((seed) => (
          <div key={seed} className="aspect-square overflow-hidden rounded-2xl">
            <img src={`https://picsum.photos/seed/${seed}/500/500`} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </section>
    </div>
  );
}
