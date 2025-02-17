import { useState, useRef, useCallback, useEffect } from 'react';

type LoadMore<T> = {
  getNext: () => Promise<T[]>;
  handleLoad: (items: T[]) => void;
};

export const useLoadMore = <T,>({ getNext, handleLoad }: LoadMore<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newItems = await getNext();
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        handleLoad(newItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, getNext, handleLoad]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [loadMore]);

  const Sentinel = () => <div ref={ref} style={{ height: '20px' }} />;

  return { Sentinel, isLoading };
};
