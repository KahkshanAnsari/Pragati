import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  once?: boolean; // only animate once
}

export function AnimatedCounter({
  target,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  once = true,
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && (!once || !hasAnimated)) {
          animate();
          if (once) setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, once, hasAnimated]);

  const animate = () => {
    const startTime = performance.now();
    const startVal = 0;

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = startVal + (target - startVal) * eased;
      setCurrent(parseFloat(val.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const formatted = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString('en-IN');

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
