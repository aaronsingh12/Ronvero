import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '../ui/Icons.jsx';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js';
import { overlayFade } from '../../animations/variants.js';

export default function AdminModal({ open, title, onClose, children }) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-mist p-6 shadow-lift"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-char">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close">
                <CloseIcon size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
