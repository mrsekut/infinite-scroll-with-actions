import React, { useRef, useEffect } from 'react';

export const useScrollTrigger = (fn: () => Promise<void>) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]!.isIntersecting) {
        fn();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [fn]);

  const Sentinel = () => <div ref={ref} style={{ height: '20px' }} />;

  return Sentinel;
};
