import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { cn } from '../../utils/cn.js';

/**
 * Product-card image gallery.
 *  - Desktop: on hover it auto-advances through the images (a slideshow).
 *  - Touch/mobile: it auto-slides while the card is in view, and the user can
 *    swipe the strip horizontally (native scroll-snap) to move between images.
 * Dots reflect / control the active image. Falls back to a single static image.
 */
export default function ProductImageGallery({ images, alt, to, isHovering, resetKey }) {
  const list = useMemo(() => (images || []).filter(Boolean).slice(0, 6), [images]);
  const count = list.length;
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(() => new Set());
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.5 });

  // Does this device actually have a hover-capable pointer (desktop mouse)?
  const canHover = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches,
    []
  );

  // Reset to the first frame when the image set changes (e.g. color switch).
  useEffect(() => {
    setIndex(0);
    setBroken(new Set());
  }, [resetKey, count]);

  // Autoplay: on hover for desktop, while in-view for touch devices.
  const playing = count > 1 && (canHover ? isHovering : inView);
  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % count),
      canHover ? 1100 : 2400
    );
    return () => clearInterval(timer);
  }, [playing, count, canHover]);

  // On desktop, snap back to the primary image once the mouse leaves.
  useEffect(() => {
    if (canHover && !isHovering) setIndex(0);
  }, [isHovering, canHover]);

  if (count === 0) {
    return <div className="absolute inset-0 bg-graphite/10" />;
  }

  return (
    <div ref={rootRef} className="absolute inset-0">
      <motion.div
        className="flex h-full"
        style={{ width: `${count * 100}%` }}
        animate={{ x: `-${index * (100 / count)}%` }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {list.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full shrink-0 bg-graphite/5" style={{ width: `${100 / count}%` }}>
            {broken.has(i) ? (
              // Clean fallback when an image URL fails (no broken-image alt text).
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-graphite/10 to-graphite/5">
                <span className="px-3 text-center font-mono text-[10px] uppercase tracking-wideish text-char/30">
                  {alt || 'RONVERO'}
                </span>
              </div>
            ) : (
              <motion.img
                src={src}
                alt=""
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(i))}
                className="h-full w-full object-cover"
                animate={{ scale: isHovering ? 1.04 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Navigation overlay — tapping the image opens the product */}
      {to && <Link to={to} aria-label={alt} className="absolute inset-0 z-[1]" />}

      {/* Dots */}
      {count > 1 && (
        <div
          className={cn(
            'absolute inset-x-0 bottom-2.5 z-[2] flex items-center justify-center gap-1.5 transition-opacity duration-300',
            canHover && !isHovering ? 'opacity-0' : 'opacity-100'
          )}
        >
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                'h-1.5 rounded-full bg-chalk shadow-soft transition-all duration-300',
                i === index ? 'w-4 opacity-100' : 'w-1.5 opacity-60'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
