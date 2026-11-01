import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MegaMenu({ item, onNavigate }) {
  if (!item?.megaMenu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass absolute left-0 right-0 top-full border-t-0 shadow-soft"
      onMouseLeave={onNavigate.close}
    >
      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-10 px-8 py-10 md:grid-cols-[1fr_1fr_1.2fr]">
        <div>
          <p className="eyebrow">{item.label}</p>
          <p className="mt-2 max-w-[22ch] font-display text-xl text-char">{item.megaMenu.description}</p>
        </div>

        {item.megaMenu.columns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-wideish text-char/50">{col.heading}</p>
            {col.links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={onNavigate.close}
                className="trace-underline w-fit font-body text-[15px] text-char transition-colors hover:text-ember"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
