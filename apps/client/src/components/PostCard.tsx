import { trpc } from '../trpc';
import { Button } from '@mantine/core';
import { Text } from '@mantine/core';

export function PostCard({ post }: any) {
  const deletePost = trpc.post.delete.useMutation();
  const context = trpc.useContext();

  // Fetch the current user information
  const currentUser = trpc.user.getCurrentUser.useQuery();

  const onDeletePost = () => {
    deletePost.mutate(post._id, {
      onSuccess(data) {
        if (data) {
          context.post.get.invalidate();
        }
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  // Check if the current user is the post's creator
  const isPostCreator =
    currentUser.data && post.user._id === currentUser.data._id;

  return (
    <div className='p-2 mb-2 flex'>
      <div>
        <h1 className='font-bold text-xl'>{post.title}</h1>
        <Text fz='sm'>Posted by: {post.user.username}</Text>
        <p>{post.content}</p>
      </div>

      {/* Render the delete button only if the current user is the post's creator */}
      {isPostCreator && (
        <Button
          onClick={() => onDeletePost()}
          variant='outline'
          color='red'
          className='ml-auto'
        >
          {deletePost.isLoading ? 'Loading...' : 'Delete'}
        </Button>
      )}
    </div>
  );
}
