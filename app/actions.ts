'use server';

import { Post } from './types';

export async function getInitialPosts(startId: number): Promise<Post[]> {
  return range(startId, startId + 10).map(id => ({
    id,
    text: `Post #${id}`,
  }));
}

export async function loadMorePosts(
  cursor: number,
  size: number,
): Promise<Post[]> {
  return range(cursor + 1, cursor + size).map(id => ({
    id,
    text: `Post #${id}`,
  }));
}

export async function loadPrevPosts(
  cursor: number,
  size: number,
): Promise<Post[]> {
  if (cursor <= 1) return [];

  const start = cursor - size;
  const start_ = Math.max(start, 1);

  return range(start_, cursor - 1).map(id => ({
    id,
    text: `Post #${id}`,
  }));
}

const range = (n1: number, n2?: number): number[] => {
  if (n2 == null) {
    return n1 >= 0 ? [...new Array(n1).keys()] : [];
  }

  const start = n1;
  const end = n2;

  // startがendより大きい場合、降順の範囲を生成
  const step = start <= end ? 1 : -1;

  return [...Array(Math.abs(end - start) + 1)].map((_, i) => start + i * step);
};
