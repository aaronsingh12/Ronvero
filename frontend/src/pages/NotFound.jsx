import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
      <motion.svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        <motion.path
          d="M6 62 L30 40 L46 54 L74 18 L114 62"
          stroke="#FF4A2E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1 }}
        />
      </motion.svg>
      <h1 className="font-display text-6xl font-bold text-char">404</h1>
      <p className="font-body text-char/60">Looks like this route went off course.</p>
      <Link to="/">
        <Button variant="primary">Back home</Button>
      </Link>
    </div>
  );
}
