export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const imageReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export const viewportOnce = { once: true, amount: 0.25 };

export const drawerVariants = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '100%', transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } },
};

export const overlayFade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const dropdownVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};
