import { getInitialPosts } from './actions';
import InfiniteScrollList from './InfiniteScrollList';

export default async function Page() {
  const initialPosts = await getInitialPosts(200);
  return (
    <div>
      <h1>Infinite Scroll</h1>
      <div className="h-64">
        <InfiniteScrollList initialPosts={initialPosts} />
      </div>
    </div>
  );
}
