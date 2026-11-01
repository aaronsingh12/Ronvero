import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Applies a vertical parallax offset to a ref'd element as it crosses the viewport.
 * Use for hero imagery / lifestyle banners — Framer Motion handles simple fades elsewhere,
 * GSAP + ScrollTrigger owns anything that needs to scrub with scroll position.
 */
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * Draws an SVG path in as it scrolls into view by animating stroke-dashoffset.
 * Used for the RONVERO "trace line" signature motif.
 */
export function useTraceDraw() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
