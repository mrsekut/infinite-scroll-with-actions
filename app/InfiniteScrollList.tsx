'use client';

import React, { useState, useRef } from 'react';
import { useLoadTopMore, useLoadBottomMore } from './hooks';
import { loadPrevPosts, loadMorePosts } from './actions';
import { Post } from './types';

type Props = {
  initialPosts: Post[];
};

export default function InfiniteScrollList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { Sentinel: Top, isLoading: loadingUp } = useLoadTopMore({
    handleLoad: newPosts => setPosts(prev => [...newPosts, ...prev]),
    getPrev: () => loadPrevPosts(posts[0]?.id ?? 0, 10),
    containerRef,
  });
  const { Sentinel: Bottom, isLoading: loadingDown } = useLoadBottomMore({
    handleLoad: newPosts => setPosts(prev => [...prev, ...newPosts]),
    getNext: () => loadMorePosts(posts.at(-1)?.id ?? 0, 10),
  });

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
      {loadingUp && (
        <p style={{ textAlign: 'center' }}>Loading previous posts...</p>
      )}
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
