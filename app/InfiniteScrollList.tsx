'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Post } from './types';
import { loadMorePosts } from './actions';

type Props = {
  initialPosts: Post[];
};

export default function InfiniteScrollList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const { Sentinel: Bottom, isLoading: loadingDown } = useLoadMore({
    handleLoad: newPosts => setPosts(prev => [...prev, ...newPosts]),
    getNext: () => loadMorePosts(posts.at(-1)?.id ?? 0, 10),
  });

  return (
    <div
      style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {posts.map(post => (
          <li
            key={post.id}
            style={{ padding: '8px', borderBottom: '1px solid #eee' }}
          >
            {post.text}
          </li>
        ))}
      </ul>
      {loadingDown && (
        <p style={{ textAlign: 'center' }}>Loading more posts...</p>
      )}
      <Bottom />
    </div>
  );
}

type LoadMore<T> = {
  getNext: () => Promise<T[]>;
  handleLoad: (items: T[]) => void;
};

const useLoadMore = <T,>({ getNext, handleLoad }: LoadMore<T>) => {
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
