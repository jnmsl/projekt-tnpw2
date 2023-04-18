import { trpc } from '../trpc';
import { List } from '@mantine/core';

export function UserList() {
  const { data, isError, isLoading, error } = trpc.user.getUsers.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div>
      <h2 className='font-bold text-xl'>Users:</h2>
      <List>
        {(data || []).map((user: any) => (
          <List.Item key={user._id}>{user.username}</List.Item>
        ))}
      </List>
    </div>
  );
}
