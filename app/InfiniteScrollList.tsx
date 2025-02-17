'use client';

import React, { useState } from 'react';
import { Post } from './types';
import { loadMorePosts } from './actions';
import { useLoadMore } from './hooks';

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
