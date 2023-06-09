import { PostForm } from './components/PostForm';
import { PostsList } from './components/PostsList';
import { Wrapper } from './components/Wrapper';
import { trpc } from './trpc';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';

export function AppContent() {
  const navigate = useNavigate();

  // Fetch the current user information
  const currentUser = trpc.user.getCurrentUser.useQuery();

  // Check if the user is logged in
  const isLoggedIn = currentUser.data !== null;

  const login = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    return null;
  };

  const register = () => {
    if (!isLoggedIn) {
      navigate('/register');
    }
    return null;
  };

  return (
    <Wrapper>
      {/* Render a loading component or an empty fragment while the data is being fetched */}
      {currentUser.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isLoggedIn && (
            <h1 className='text-4xl font-bold text-center py-5'>Home</h1>
          )}
          {isLoggedIn && <PostForm />}
          {isLoggedIn && <PostsList />}
          {!isLoggedIn && (
            <>
              <h1 className='text-4xl font-bold text-center py-5'>
                You are not logged in
              </h1>
              <p className='text-center'>Please login or register to post.</p>
              <br />
              <div className='text-center'>
                <Button
                  variant='outline'
                  size='md'
                  className='ml-auto'
                  onClick={login}
                >
                  Login
                </Button>

                <Button
                  variant='outline'
                  size='md'
                  className='ml-2'
                  onClick={register}
                >
                  Register
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}
