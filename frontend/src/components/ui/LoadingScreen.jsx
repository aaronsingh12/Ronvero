import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_DISPLAY_MS = 1400;

export default function LoadingScreen({ ready }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(t);
  }, []);

  const show = !(ready && minTimeElapsed);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-graphite"
        >
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <motion.path
              d="M6 62 L30 40 L46 54 L74 18 L114 8"
              stroke="#FF4A2E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.circle
              cx="114"
              cy="8"
              r="4"
              fill="#FF4A2E"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            />
          </svg>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="font-display text-xl font-semibold tracking-tightest text-chalk"
          >
            RONVERO
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
