import { useState, useCallback, useRef } from 'react';

type UseLoadTopMore<T> = {
  handleLoad: (items: T[]) => void;
  getPrev: () => Promise<T[]>;
};

export const useLoadPrev = <T>({ handleLoad, getPrev }: UseLoadTopMore<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreUp, setHasMoreUp] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  const loadPrev = useCallback(async () => {
    if (isLoading || !hasMoreUp) return;
    setIsLoading(true);
    if (!ref.current) return;

    // Store the current scroll height
    const previousScrollHeight = ref.current.scrollHeight;
    const previousScrollTop = ref.current.scrollTop;

    try {
      const newItems = await getPrev();

      if (newItems.length === 0) {
        setHasMoreUp(false);
      } else {
        handleLoad(newItems);
        // Adjust the scroll position so it doesn't shift when new items are added to the top
        const observer = new MutationObserver(() => {
          if (ref.current) {
            const newScrollHeight = ref.current.scrollHeight;
            const addedContentHeight = newScrollHeight - previousScrollHeight;
            ref.current.scrollTop = previousScrollTop + addedContentHeight;
          }
          observer.disconnect();
        });
        observer.observe(ref.current, { childList: true, subtree: true });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMoreUp, ref, getPrev, handleLoad]);

  return { loadPrev, isLoading, containerRef: ref };
};
