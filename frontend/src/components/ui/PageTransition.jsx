import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function PageTransition({ children }) {
  return (
    <motion.div variants={variants} initial="hidden" animate="show" exit="exit">
      {children}
    </motion.div>
  );
}
