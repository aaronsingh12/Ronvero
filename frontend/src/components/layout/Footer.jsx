import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND_NAME, FOOTER_LINKS } from '../../utils/constants.js';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants.js';
import { useCategoriesStore } from '../../store/useCategoriesStore.js';

export default function Footer() {
  const categories = useCategoriesStore((s) => s.categories);
  const loadCategories = useCategoriesStore((s) => s.load);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // "Shop" column reflects the real catalog; the other columns stay static.
  const shopColumn = {
    heading: 'Shop',
    links: [
      { label: 'Shop all', to: '/shop' },
      ...categories.map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })),
    ],
  };
  const columns = [shopColumn, ...FOOTER_LINKS.filter((c) => c.heading !== 'Shop')];

  return (
    <motion.footer
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="bg-graphite px-5 pb-8 pt-16 text-chalk md:px-8"
    >
      <div className="mx-auto grid max-w-8xl grid-cols-2 gap-10 md:grid-cols-5">
        <motion.div variants={fadeUp} className="col-span-2">
          <Link to="/" className="font-display text-2xl font-bold tracking-tightest">
            {BRAND_NAME}
          </Link>
          <p className="mt-3 max-w-xs font-body text-sm text-chalk/60">
            Performance activewear engineered for the mile, the lift, and everything after.
          </p>
          <div className="mt-5 flex gap-3">
            {['IG', 'X', 'TT'].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-chalk/20 font-mono text-[11px] transition-colors hover:border-ember hover:text-ember"
              >
                {s}
              </a>
            ))}
          </div>
        </motion.div>

        {columns.map((col) => (
          <motion.div key={col.heading} variants={fadeUp}>
            <p className="font-mono text-xs uppercase tracking-wideish text-chalk/50">{col.heading}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-sm text-chalk/80 hover:text-chalk">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeUp}
        className="mx-auto mt-14 flex max-w-8xl flex-col gap-2 border-t border-chalk/10 pt-6 font-mono text-xs text-chalk/40 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
        <span>Designed &amp; built for those who show up.</span>
      </motion.div>
    </motion.footer>
  );
}
