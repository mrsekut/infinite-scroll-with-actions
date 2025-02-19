import { useState, useCallback } from 'react';

type LoadMore<T> = {
  getNext: () => Promise<T[]>;
  handleLoad: (items: T[]) => void;
};

export const useLoadMore = <T>({ getNext, handleLoad }: LoadMore<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  return { loadMore, isLoading };
};
