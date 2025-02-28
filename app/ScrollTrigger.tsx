import React, { useRef, useEffect } from 'react';

type Props = {
  onTrigger: () => Promise<void>;
};

export const ScrollTrigger: React.FC<Props> = ({ onTrigger }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]!.isIntersecting) {
        onTrigger();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [onTrigger]);

  return <div ref={ref} style={{ height: '20px' }} />;
};
