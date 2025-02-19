'use client';

import React, { useState } from 'react';
import { loadPrevPosts, loadMorePosts } from './actions';
import { Post } from './types';
import { useScrollTrigger } from './useScrollTrigger';
import { useLoadPrev } from './useLoadPrev';
import { useLoadMore } from './useLoadMore';

type Props = {
  initialPosts: Post[];
};

export default function InfiniteScrollList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const {
    loadPrev,
    isLoading: loadingUp,
    containerRef,
  } = useLoadPrev({
    handleLoad: newPosts => setPosts(prev => [...newPosts, ...prev]),
    getPrev: () => loadPrevPosts(posts[0]?.id ?? 0, 10),
  });
  const { loadMore, isLoading: loadingDown } = useLoadMore({
    handleLoad: newPosts => setPosts(prev => [...prev, ...newPosts]),
    getNext: () => loadMorePosts(posts.at(-1)?.id ?? 0, 10),
  });

  const Top = useScrollTrigger(loadPrev);
  const Bottom = useScrollTrigger(loadMore);

  return (
    <div
      ref={containerRef}
      style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <Top />
      {loadingUp && <p style={{ textAlign: 'center' }}>Loading prev...</p>}
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
      {loadingDown && <p style={{ textAlign: 'center' }}>Loading next...</p>}
      <Bottom />
    </div>
  );
}
