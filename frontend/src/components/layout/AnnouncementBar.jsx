import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MESSAGES = [
  'Free shipping on orders over ₹2,999',
  'New: the Monsoon Shell edit is live',
  '10% off your first order — code FIRSTRUN10',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-9 items-center justify-center overflow-hidden bg-graphite px-4 text-chalk">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] tracking-wideish sm:text-xs"
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
