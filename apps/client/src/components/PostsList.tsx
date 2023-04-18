import { PostCard } from './PostCard';
import { trpc } from '../trpc';

export function PostsList() {
  const { data, isError, isLoading, error } = trpc.post.get.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      {(data || []).map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
