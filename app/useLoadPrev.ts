import React, { useState, useCallback } from 'react';

type UseLoadTopMore<T> = {
  handleLoad: (items: T[]) => void;
  getPrev: () => Promise<T[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const useLoadPrev = <T>({
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
