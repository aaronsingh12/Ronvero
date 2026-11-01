import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../utils/cn.js';

const variantClass = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
};

/**
 * Button with two signature micro-interactions:
 *  - "magnetic" pull toward the cursor while hovering (disable with magnetic={false})
 *  - a ripple that expands from the click point
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  magnetic = true,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMouseMove = (e) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      const size = Math.max(rect.width, rect.height) * 1.6;
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
      ]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    }
    props.onClick?.(e);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <Component
        {...props}
        onClick={handleClick}
        className={cn(variantClass[variant], 'relative overflow-hidden', className)}
      >
        {children}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full bg-white/50"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </Component>
    </motion.div>
  );
}
