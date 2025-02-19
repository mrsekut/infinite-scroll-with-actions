import React, { useState, useCallback } from 'react';

type UseLoadTopMore<T> = {
  handleLoad: (items: T[]) => void;
  getPrev: () => Promise<T[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const useLoadTopMore = <T,>({
  handleLoad,
  getPrev,
  containerRef,
}: UseLoadTopMore<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreUp, setHasMoreUp] = useState(true);

  const loadPrev = useCallback(async () => {
    if (isLoading || !hasMoreUp) return;
    setIsLoading(true);
    if (!containerRef.current) return;

    // Store the current scroll height
    const previousScrollHeight = containerRef.current.scrollHeight;

    try {
      const newItems = await getPrev();

      if (newItems.length === 0) {
        setHasMoreUp(false);
      } else {
        handleLoad(newItems);
        // Adjust the scroll position so it doesn't shift when new items are added to the top
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const addedContentHeight = newScrollHeight - previousScrollHeight;
            containerRef.current.scrollTop =
              containerRef.current.scrollTop + addedContentHeight;
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMoreUp, containerRef, getPrev, handleLoad]);

  return { loadPrev, isLoading };
};

type LoadMore<T> = {
  getNext: () => Promise<T[]>;
  handleLoad: (items: T[]) => void;
};

export const useLoadBottomMore = <T,>({ getNext, handleLoad }: LoadMore<T>) => {
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
